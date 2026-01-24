export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const corsHeadersForPOST = {
  ...corsHeaders,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'public, max-age=300',
};
