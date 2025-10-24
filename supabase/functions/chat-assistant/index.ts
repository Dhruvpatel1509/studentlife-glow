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

    // Call Groq API with simplified tool calling
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
            content: `You are Pixie, a helpful AI assistant for WHZ students. You have access to real-time database information.

When users ask about:
- Events: Tell them about upcoming events, workshops, and seminars
- Timetable: Show their class schedule
- Exams: Display exam dates and times
- Mensa menu: Show today's cafeteria menu
- News: Share latest campus news

Always be friendly, concise, and use emojis. Provide specific information when available.`
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

    // Check if we need to fetch database info based on user query
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let enrichedResponse = data.choices[0].message.content;
    
    // Detect what data user is asking for and fetch it
    try {
      if (userMessage.includes('event')) {
        const { data: events } = await supabase
          .from('events')
          .select('title, event_date, event_time, location, category')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true })
          .limit(5);
        
        if (events && events.length > 0) {
          enrichedResponse += '\n\n📅 **Upcoming Events:**\n';
          events.forEach(e => {
            enrichedResponse += `• ${e.title} - ${e.event_date} at ${e.event_time} (${e.location})\n`;
          });
        }
      }
      
      if (userMessage.includes('timetable') || userMessage.includes('schedule') || userMessage.includes('class')) {
        const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const dayMap: { [key: string]: string } = {
          'Monday': 'Montag',
          'Tuesday': 'Dienstag', 
          'Wednesday': 'Mittwoch',
          'Thursday': 'Donnerstag',
          'Friday': 'Freitag'
        };
        const germanDay = dayMap[today] || 'Montag';
        
        const { data: timetable } = await supabase
          .from('timetable')
          .select('day_time, course, room, instructor')
          .eq('day_name', germanDay)
          .eq('sem_group', '252035')
          .order('day_time', { ascending: true });
        
        if (timetable && timetable.length > 0) {
          enrichedResponse += `\n\n📚 **Today's Schedule (${germanDay}):**\n`;
          timetable.forEach(t => {
            enrichedResponse += `• ${t.day_time}: ${t.course} in ${t.room}\n`;
          });
        }
      }
      
      if (userMessage.includes('exam')) {
        const { data: exams } = await supabase
          .from('exams')
          .select('course, date, period, space')
          .eq('sem_group', '252035')
          .order('date', { ascending: true })
          .limit(5);
        
        if (exams && exams.length > 0) {
          enrichedResponse += '\n\n📝 **Upcoming Exams:**\n';
          exams.forEach(e => {
            enrichedResponse += `• ${e.course}\n  Date: ${e.date}, ${e.period}\n  Location: ${e.space}\n`;
          });
        }
      }
      
      if (userMessage.includes('mensa') || userMessage.includes('food') || userMessage.includes('menu')) {
        const { data: menu } = await supabase
          .from('mensa_menu')
          .select('meal_station, dish_description, price_s, price_m, price_g')
          .limit(5);
        
        if (menu && menu.length > 0) {
          enrichedResponse += '\n\n🍽️ **Today\'s Mensa Menu:**\n';
          menu.forEach(m => {
            enrichedResponse += `• ${m.meal_station}: ${m.dish_description}\n  Prices: Small ${m.price_s}, Medium ${m.price_m}, Large ${m.price_g}\n`;
          });
        }
      }
      
      if (userMessage.includes('news')) {
        const { data: news } = await supabase
          .from('whz_news')
          .select('title, description')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (news && news.length > 0) {
          enrichedResponse += '\n\n📰 **Latest Campus News:**\n';
          news.forEach(n => {
            enrichedResponse += `• ${n.title}\n  ${n.description}\n`;
          });
        }
      }
    } catch (dbError) {
      console.error('Database fetch error:', dbError);
      // Continue with original response if database fetch fails
    }

    // Return the response with database data
    return new Response(JSON.stringify({ 
      message: enrichedResponse
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
