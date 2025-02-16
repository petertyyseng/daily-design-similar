
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const roles = [
      {
        role: "Therapist",
        prompt: "As a compassionate therapist, provide supportive feedback and emotional insights about this journal entry:"
      },
      {
        role: "Life Coach",
        prompt: "As a motivational life coach, offer actionable advice and growth opportunities based on this journal entry:"
      },
      {
        role: "Mental Health Expert",
        prompt: "As a mental health expert, provide professional perspective and well-being strategies related to this journal entry:"
      },
      {
        role: "Philosopher",
        prompt: "As a deep-thinking philosopher, provide wisdom and philosophical insights about the meaning and implications of this journal entry:"
      },
      {
        role: "Priest",
        prompt: "As a spiritual advisor and priest, offer guidance and spiritual perspective on this journal entry with compassion and understanding:"
      }
    ];

    const feedbackPromises = roles.map(async (role) => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: role.prompt
            },
            { role: 'user', content }
          ],
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    });

    const [therapistFeedback, coachFeedback, expertFeedback, philosopherFeedback, priestFeedback] = await Promise.all(feedbackPromises);

    return new Response(JSON.stringify({
      therapistFeedback,
      coachFeedback,
      expertFeedback,
      philosopherFeedback,
      priestFeedback
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
