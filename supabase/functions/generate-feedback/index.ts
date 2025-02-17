
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { pipeline } from "@huggingface/transformers";

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

    // Initialize the text classification pipeline with a suitable model
    const classifier = await pipeline(
      "text-classification",
      "SamLowe/roberta-base-go_emotions",
      { device: "webgpu" }
    );

    // Analyze the emotional content of the journal entry
    const emotions = await classifier(content);

    // Define professional perspectives and their response templates
    const roles = [
      {
        role: "Therapist",
        generateResponse: (emotions: any) => {
          const primaryEmotion = emotions[0].label;
          return `I sense that you're experiencing ${primaryEmotion}. This is a natural response to your situation. Let's explore these feelings together and understand how they're affecting you. Remember that emotions are valuable signals that help us understand ourselves better.`;
        }
      },
      {
        role: "Life Coach",
        generateResponse: (emotions: any) => {
          return `I can see opportunities for growth in your situation. Let's channel your energy into positive action steps. Consider setting small, achievable goals that align with your values and aspirations.`;
        }
      },
      {
        role: "Mental Health Expert",
        generateResponse: (emotions: any) => {
          return `From a mental health perspective, your experience reflects common patterns in human psychology. Here are some evidence-based strategies that might help you navigate this situation: practice mindfulness, maintain routine, and engage in activities that bring you joy.`;
        }
      },
      {
        role: "Philosopher",
        generateResponse: (emotions: any) => {
          return `Your situation raises interesting questions about the human experience. Consider how this moment fits into your broader life narrative and what meaning you can derive from it. Remember that challenges often lead to profound personal growth and understanding.`;
        }
      },
      {
        role: "Priest",
        generateResponse: (emotions: any) => {
          return `In times like these, finding spiritual meaning can provide comfort and guidance. Your experience is part of a larger journey. Consider taking time for reflection and prayer, and remember that you're not alone in this journey.`;
        }
      }
    ];

    // Generate responses from each professional perspective
    const feedback = roles.reduce((acc, role) => {
      acc[`${role.role.toLowerCase()}Feedback`] = role.generateResponse(emotions);
      return acc;
    }, {} as Record<string, string>);

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-feedback function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
