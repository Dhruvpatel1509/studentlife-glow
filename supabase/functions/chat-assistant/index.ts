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

    // Call Groq API with tool calling
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
You have access to:
- Events database (workshops, career fairs, seminars)
- Timetable/schedule (classes and lectures)
- Exam schedule
- Mensa menu
- Campus news
- Transport schedules

Be concise, friendly, and helpful. Use emojis occasionally to be engaging. Always provide actionable information.
When users ask about data, use the appropriate tool to fetch real information rather than making it up.`
          },
          ...messages
        ],
        tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 1024
      }),
    });

    let data = await response.json();
    console.log('Groq response:', JSON.stringify(data, null, 2));

    // Handle tool calls
    if (data.choices[0].message.tool_calls) {
      const toolCalls = data.choices[0].message.tool_calls;
      const toolResults = [];

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments || '{}');
        
        console.log(`Executing tool: ${functionName} with args:`, args);
        
        let result;
        
        try {
          switch (functionName) {
            case 'get_events': {
              let query = supabase.from('events').select('*');
              
              if (args.upcoming_only) {
                const today = new Date().toISOString().split('T')[0];
                query = query.gte('event_date', today);
              }
              
              if (args.category) {
                query = query.ilike('category', `%${args.category}%`);
              }
              
              query = query.order('event_date', { ascending: true }).limit(10);
              
              const { data: events, error } = await query;
              if (error) throw error;
              result = events;
              break;
            }
            
            case 'get_timetable': {
              const day = args.day || 'Montag';
              const { data: timetable, error } = await supabase
                .from('timetable')
                .select('*')
                .eq('day_name', day)
                .eq('sem_group', '252035')
                .order('day_time', { ascending: true });
              
              if (error) throw error;
              result = timetable;
              break;
            }
            
            case 'get_exams': {
              const { data: exams, error } = await supabase
                .from('exams')
                .select('*')
                .eq('sem_group', '252035')
                .order('date', { ascending: true });
              
              if (error) throw error;
              result = exams;
              break;
            }
            
            case 'get_mensa_menu': {
              const { data: menu, error } = await supabase
                .from('mensa_menu')
                .select('*')
                .limit(20);
              
              if (error) throw error;
              result = menu;
              break;
            }
            
            case 'get_news': {
              const { data: news, error } = await supabase
                .from('whz_news')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
              
              if (error) throw error;
              result = news;
              break;
            }
            
            case 'get_transport': {
              // For VMS, we'll return a message that it needs to be fetched from the frontend
              result = { message: "Transport schedules are available on the main dashboard. They update in real-time from VMS." };
              break;
            }
            
            case 'register_for_event': {
              // This would require user authentication
              result = { message: "To register for events, please use the Events page where you can sign in and register." };
              break;
            }
            
            default:
              result = { error: "Unknown function" };
          }
        } catch (error) {
          console.error(`Error executing ${functionName}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result = { error: errorMessage };
        }
        
        toolResults.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          name: functionName,
          content: JSON.stringify(result)
        });
      }

      // Make another call with tool results
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
              content: `You are Pixie, a helpful and friendly AI assistant for WHZ students. Format your responses nicely with emojis and clear structure.`
            },
            ...messages,
            data.choices[0].message,
            ...toolResults
          ],
          temperature: 0.7,
          max_tokens: 1024
        }),
      });

      data = await response.json();
    }

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
