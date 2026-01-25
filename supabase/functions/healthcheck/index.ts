import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { AuthMiddleware } from '../_shared/jwt/default.ts';

Deno.serve((req) =>
  AuthMiddleware(req, async (req) => {
    return new Response(
      JSON.stringify({
        ok: true,
        env: Deno.env.get('SUPABASE_URL') ? 'configured' : 'missing',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }),
);
