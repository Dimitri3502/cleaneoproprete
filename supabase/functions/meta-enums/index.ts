import { createClient } from 'npm:@supabase/supabase-js';
import { corsHeadersForPOST } from '../_shared/cors.ts';

const CONFIG = [
  { table: 'deals', column: 'sector' },
  { table: 'deals', column: 'stage' },
  { table: 'deals', column: 'go_no_go' },
  { table: 'deals', column: 'status' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeadersForPOST });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const result: Record<string, string[]> = {};

  for (const { table, column } of CONFIG) {
    const key = `${table}.${column}`;

    const { data, error } = await supabase.rpc('get_column_enum_values', {
      p_table: table,
      p_column: column,
    });

    result[key] = error ? [] : (data ?? []);
  }

  return new Response(JSON.stringify({ enums: result }), {
    headers: { ...corsHeadersForPOST, 'Content-Type': 'application/json' },
    status: 200,
  });
});
