import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders, getCorsHeaders } from '../_shared/cors.ts';

const getExtendedCorsHeaders = (req: Request) => ({
  ...getCorsHeaders(req),
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, max-age=300',
});

// Configuration: which table columns to check for enums
const CONFIG = [
  { table: 'deals', column: 'sector' },
  { table: 'deals', column: 'stage' },
  { table: 'deals', column: 'go_no_go' },
  { table: 'deals', column: 'status' },
];

// Fallback map for non-enum constraints or static lists
const FALLBACKS: Record<string, string[]> = {
  // Example: "deals.some_column": ["value1", "value2"]
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getExtendedCorsHeaders(req) });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const result: Record<string, string[]> = {};

    for (const item of CONFIG) {
      const key = `${item.table}.${item.column}`;

      console.log(`Processing ${key}`);

      // Fetch enum values using our RPC
      const { data: enumValues, error: rpcError } = await supabase.rpc('get_column_enum_values', {
        p_table: item.table,
        p_column: item.column,
      });

      if (rpcError) {
        console.error(`RPC error for ${key}:`, rpcError);
        result[key] = FALLBACKS[key] || [];
      } else if (!enumValues || enumValues.length === 0) {
        console.warn(`No values returned for ${key}`);
        result[key] = FALLBACKS[key] || [];
      } else {
        result[key] = enumValues;
      }
    }

    return new Response(JSON.stringify({ enums: result }), {
      headers: { ...getExtendedCorsHeaders(req), 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...getExtendedCorsHeaders(req), 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
