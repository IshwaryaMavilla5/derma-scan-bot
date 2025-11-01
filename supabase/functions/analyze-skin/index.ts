import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    const AUTODERM_API_KEY = Deno.env.get('AUTODERM_API_KEY');
    if (!AUTODERM_API_KEY) {
      throw new Error('AUTODERM_API_KEY not configured');
    }

    console.log('Calling Autoderm.ai API...');

    // Call Autoderm.ai API
    const response = await fetch('https://autoderm.ai/v1/query', {
      method: 'POST',
      headers: {
        'Api-Key': AUTODERM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'autoderm_v2_2',
        language: 'en',
        data: imageBase64,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Autoderm API error:', response.status, errorText);
      throw new Error(`Autoderm API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Autoderm API response received');

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});