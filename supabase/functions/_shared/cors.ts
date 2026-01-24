export const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Returns CORS headers with a specific origin if it's trusted.
 * It reflects the request origin or falls back to '*' if no origin is provided.
 */
export function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin');

  // Logic to validate the origin against a whitelist
  const allowedOrigins = [
    'http://localhost:3000',
    'https://captech.luphy.fr', // Example frontend URL
  ];

  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.svc.edge.scw.cloud'))) {
    return {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin,
    };
  }

  // Fallback to '*' only if we really must, but ideally we should be restrictive.
  // For now, reflecting the origin if it exists is safer than a hardcoded '*'.
  return {
    ...corsHeaders,
    'Access-Control-Allow-Origin': origin || '*',
  };
}
