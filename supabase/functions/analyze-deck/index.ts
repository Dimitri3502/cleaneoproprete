import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import OpenAI from 'npm:openai@^6.10.0';

import { corsHeadersForPOST } from '../_shared/cors.ts';

type Payload = {
  deal_id: string;
  storage_bucket?: string;
  storage_path: string;
};

function json(data: unknown, req: Request, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeadersForPOST, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeadersForPOST });
  }

  try {
    if (req.method !== 'POST') {
      return json({ error: 'POST required' }, req, 405);
    }

    const body = (await req.json()) as Payload;
    if (!body.deal_id || !body.storage_path) {
      return json({ error: 'Missing deal_id or storage_path' }, req, 400);
    }

    /* ------------------------------
           Supabase (service role)
        ------------------------------ */
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const bucket = body.storage_bucket ?? 'deal-decks';

    /* ------------------------------
           1) Download PDF from Storage
        ------------------------------ */
    const { data: file, error } = await supabase.storage.from(bucket).download(body.storage_path);

    if (error || !file) {
      return json({ error: 'Failed to download PDF', details: error?.message }, req, 500);
    }

    /* ------------------------------
           2) Upload PDF to OpenAI Files (CORRECT)
        ------------------------------ */

    // Supabase gives you a Blob
    const arrayBuffer = await file.arrayBuffer();

    // 🔑 Create a File (NOT just a Blob)
    const pdfFile = new File(
      [arrayBuffer],
      'deck.pdf', // filename is REQUIRED
      { type: 'application/pdf' },
    );

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const openaiFile = await openai.files.create({
      file: pdfFile, // ✅ now valid
      purpose: 'user_data',
    });

    /* ------------------------------
           3) Use file_id in Responses
        ------------------------------ */
    const response = await openai.responses.create({
      model: 'gpt-5-mini',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: `
You are a VC investment analyst.
Rules:
- Use ONLY information in the deck.
- If missing, say "missing".
- Do NOT invent numbers or traction.
Return STRICT JSON following the schema.
          `.trim(),
            },
          ],
        },
        {
          role: 'user',
          content: [
            { type: 'input_file', file_id: openaiFile.id },
            {
              type: 'input_text',
              text: 'Analyze the pitch deck for IC pre-screening.',
            },
          ],
        },
      ],

      // ✅ NEW shape for Structured Outputs in Responses API
      text: {
        format: {
          type: 'json_schema',
          name: 'deal_analysis',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false, // ✅ REQUIRED
            required: [
              'one_liner',
              'summary_5_bullets',
              'thesis_fit_subscore',
              'stage_ticket_subscore',
              'team_subscore',
              'data_signal_subscore',
              'total_score',
              'go_no_go',
              'why_go_no_go_3_bullets',
              'overall_confidence',
              'evidence_json',
              'confidence_json',
            ],
            properties: {
              one_liner: { type: 'string' },

              summary_5_bullets: {
                type: 'array',
                minItems: 5,
                maxItems: 5,
                items: { type: 'string' },
              },

              thesis_fit_subscore: { type: 'number', minimum: 0, maximum: 100 },
              stage_ticket_subscore: { type: 'number', minimum: 0, maximum: 100 },
              team_subscore: { type: 'number', minimum: 0, maximum: 100 },
              data_signal_subscore: { type: 'number', minimum: 0, maximum: 100 },
              total_score: { type: 'number', minimum: 0, maximum: 100 },

              go_no_go: { type: 'string', enum: ['GO', 'NO_GO', 'REVIEW'] },

              why_go_no_go_3_bullets: {
                type: 'array',
                minItems: 3,
                maxItems: 3,
                items: { type: 'string' },
              },

              overall_confidence: { type: 'number', minimum: 0, maximum: 1 },

              evidence_json: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false, // ✅ REQUIRED for nested object
                  required: ['field', 'quote', 'location_hint'],
                  properties: {
                    field: { type: 'string' },
                    quote: { type: 'string' },
                    location_hint: { type: 'string' },
                  },
                },
              },

              confidence_json: {
                type: 'object',
                additionalProperties: false, // ✅ REQUIRED
                required: ['field_confidence'],
                properties: {
                  field_confidence: {
                    type: 'object',
                    additionalProperties: false, // ✅ REQUIRED
                    required: ['one_liner', 'summary_5_bullets'],
                    properties: {
                      one_liner: { type: 'number', minimum: 0, maximum: 1 },
                      summary_5_bullets: { type: 'number', minimum: 0, maximum: 1 },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.output_text);

    const { data: updated, error: updateError } = await supabase
      .from('deals')
      .update({
        one_liner: result.one_liner,
        summary_5_bullets: result.summary_5_bullets,
        thesis_fit_subscore: Math.round(result.thesis_fit_subscore),
        stage_ticket_subscore: Math.round(result.stage_ticket_subscore),
        team_subscore: Math.round(result.team_subscore),
        data_signal_subscore: Math.round(result.data_signal_subscore),
        total_score: Math.round(result.total_score),
        go_no_go: result.go_no_go,
        why_go_no_go_3_bullets: result.why_go_no_go_3_bullets,
        overall_confidence: result.overall_confidence,
        evidence_json: result.evidence_json,
        confidence_json: result.confidence_json,
        status: 'ic_ready',
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.deal_id)
      .select('id,status,updated_at') // 👈 critical
      .single();

    if (updateError) {
      console.error('DB update failed:', updateError);
      return json({ error: 'DB update failed', details: updateError.message }, 500);
    }

    if (!updated?.id) {
      console.error('No row updated for id:', body.deal_id);
      return json({ error: 'No row updated', deal_id: body.deal_id }, 404);
    }

    return json({
      ok: true,
    });
  } catch (err) {
    return json({ error: 'Unhandled error', details: String(err) }, 500);
  }
});
