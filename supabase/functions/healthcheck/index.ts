import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders, getCorsHeaders } from '../_shared/cors.ts';


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      env: Deno.env.get('SUPABASE_URL') ? 'configured' : 'missing',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        ...getCorsHeaders(req),
        'Content-Type': 'application/json',
      },
    },
  );
});
