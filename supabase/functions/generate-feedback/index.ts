
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
    const { content, type } = await req.json();
    console.log('Processing journal entry:', { content, type });

    // Generate AI responses based on the content
    const feedback = {
      therapistFeedback: `As a therapist, I notice you're expressing ${type}. Let's explore these feelings together.`,
      coachFeedback: `From a coaching perspective, I see opportunities for growth in how you handle this ${type}.`,
      expertFeedback: `Your ${type} shows common patterns that we can work with using evidence-based strategies.`,
      philosopherFeedback: `This ${type} raises interesting questions about human experience and meaning.`,
      priestFeedback: `In times of ${type}, finding spiritual meaning can provide comfort and guidance.`
    };

    console.log('Generated feedback:', feedback);

    return new Response(
      JSON.stringify(feedback),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in generate-feedback function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
