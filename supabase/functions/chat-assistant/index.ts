import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Define all available tools
    const tools = [
      {
        type: "function",
        function: {
          name: "get_events",
          description: "Get all events or upcoming events from the database. Use this when user asks about events, workshops, career fairs, etc.",
          parameters: {
            type: "object",
            properties: {
              upcoming_only: { type: "boolean", description: "Whether to filter only upcoming events" },
              category: { type: "string", description: "Filter by category like 'Workshop', 'Career', etc." }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_timetable",
          description: "Get timetable/schedule for a specific day. Use this when user asks about classes, schedule, or lectures.",
          parameters: {
            type: "object",
            properties: {
              day: { type: "string", description: "Day name in German (Montag, Dienstag, Mittwoch, Donnerstag, Freitag)" }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_exams",
          description: "Get exam schedule. Use this when user asks about exams, tests, or examination dates.",
          parameters: { type: "object", properties: {} }
        }
      },
      {
        type: "function",
        function: {
          name: "get_mensa_menu",
          description: "Get mensa/cafeteria menu. Use this when user asks about food, meals, mensa, or cafeteria.",
          parameters: { type: "object", properties: {} }
        }
      },
      {
        type: "function",
        function: {
          name: "get_news",
          description: "Get WHZ campus news. Use this when user asks about news, announcements, or what's happening on campus.",
          parameters: { type: "object", properties: {} }
        }
      },
      {
        type: "function",
        function: {
          name: "get_transport",
          description: "Get VMS transport schedule. Use this when user asks about buses, trains, or transportation.",
          parameters: { type: "object", properties: {} }
        }
      },
      {
        type: "function",
        function: {
          name: "register_for_event",
          description: "Register user for an event. Use this when user wants to register or sign up for an event.",
          parameters: {
            type: "object",
            properties: {
              event_id: { type: "string", description: "UUID of the event to register for" }
            },
            required: ["event_id"]
          }
        }
      }
    ];

    // Call Groq API - start without tools to ensure basic functionality
    let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are Pixie, a helpful and friendly AI assistant for WHZ (Westsächsische Hochschule Zwickau) students. 

You can help with:
- Events and workshops information
- Timetable and class schedules
- Exam dates
- Mensa (cafeteria) menu
- Campus news
- Transportation

Be concise, friendly, and helpful. Use emojis occasionally to be engaging.

When users ask about specific data like events, timetable, exams, or mensa menu, let them know that information is available in the system and provide general guidance. For the most up-to-date information, users can check the main dashboard.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024
      }),
    });

    let data = await response.json();
    console.log('Groq response:', JSON.stringify(data, null, 2));

    // Check for errors first
    if (data.error) {
      console.error('Groq API error:', data.error);
      return new Response(JSON.stringify({ 
        message: "Sorry, I encountered an issue processing your request. Please try again or rephrase your question." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if choices exists
    if (!data.choices || !data.choices[0]) {
      console.error('No choices in response:', data);
      return new Response(JSON.stringify({ 
        message: "Sorry, I couldn't generate a response. Please try again." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return the response directly (tools removed for stability)
    return new Response(JSON.stringify({ 
      message: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
