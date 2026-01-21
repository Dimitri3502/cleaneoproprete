import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(() => {
  return new Response(
      JSON.stringify({
        ok: true,
        env: Deno.env.get("SUPABASE_URL") ? "configured" : "missing",
        timestamp: new Date().toISOString(),
      }),
      { headers: { "content-type": "application/json" } }
  );
});
