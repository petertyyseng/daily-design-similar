
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type } = await req.json();
    console.log('Processing journal entry:', { content, type });

    // Generate AI responses in Traditional Chinese
    const feedback = {
      therapistFeedback: `作為一位治療師，我注意到你在表達${type}。讓我們一起探討這些感受。`,
      coachFeedback: `從教練的角度來看，我看到你在處理${type}時有成長的機會。`,
      expertFeedback: `你的${type}展現出一些我們可以用實證策略處理的常見模式。`,
      philosopherFeedback: `這個${type}引發了關於人類經驗和意義的有趣問題。`,
      priestFeedback: `在${type}的時刻，尋找精神上的意義能帶來安慰和指引。`
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
