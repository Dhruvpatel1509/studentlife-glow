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

    // Get user's message
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    console.log('User message:', userMessage);
    
    // Fetch database data based on user query
    let databaseContext = '';
    
    try {
      // Check for timetable/schedule keywords (handle variations)
      const isTimetableQuery = userMessage.includes('timetable') || 
                               userMessage.includes('time table') || 
                               userMessage.includes('schedule') || 
                               userMessage.includes('class');
      
      const isEventQuery = userMessage.includes('event');
      const isExamQuery = userMessage.includes('exam');
      const isMensaQuery = userMessage.includes('mensa') || 
                           userMessage.includes('food') || 
                           userMessage.includes('menu');
      const isNewsQuery = userMessage.includes('news');
      const isCultureQuery = userMessage.includes('culture') || 
                             userMessage.includes('german') || 
                             userMessage.includes('behavior') ||
                             userMessage.includes('behaviour') ||
                             userMessage.includes('custom') ||
                             userMessage.includes('social') ||
                             userMessage.includes('interaction');
      
      console.log('Query detection:', { isTimetableQuery, isEventQuery, isExamQuery, isMensaQuery, isNewsQuery, isCultureQuery });
      
      if (isEventQuery) {
        const { data: events } = await supabase
          .from('events')
          .select('title, event_date, event_time, location, category, description')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true })
          .limit(10);
        
        if (events && events.length > 0) {
          databaseContext += '\n\nUPCOMING EVENTS FROM DATABASE:\n';
          events.forEach(e => {
            databaseContext += `- ${e.title}\n  Date: ${e.event_date}\n  Time: ${e.event_time}\n  Location: ${e.location}\n  Category: ${e.category}\n`;
            if (e.description) databaseContext += `  Description: ${e.description}\n`;
          });
        } else {
          databaseContext += '\n\nNo upcoming events found in database.\n';
        }
      }
      
      if (isTimetableQuery) {
        console.log('Fetching timetable data...');
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
        
        const { data: timetable, error: timetableError } = await supabase
          .from('timetable')
          .select('day_time, course, room, instructor')
          .eq('day_name', germanDay)
          .eq('sem_group', '252035')
          .order('day_time', { ascending: true });
        
        console.log('Timetable query result:', { count: timetable?.length, error: timetableError });
        
        if (timetable && timetable.length > 0) {
          databaseContext += `\n\nTIMETABLE FOR ${germanDay} FROM DATABASE:\n`;
          timetable.forEach(t => {
            databaseContext += `- ${t.day_time}: ${t.course}\n  Room: ${t.room}\n  Instructor: ${t.instructor || 'N/A'}\n`;
          });
        } else {
          databaseContext += `\n\nNo timetable found for ${germanDay} in database.\n`;
        }
      }
      
      if (isExamQuery) {
        const { data: exams } = await supabase
          .from('exams')
          .select('course, date, period, space, lecturer')
          .eq('sem_group', '252035')
          .order('date', { ascending: true })
          .limit(10);
        
        if (exams && exams.length > 0) {
          databaseContext += '\n\nUPCOMING EXAMS FROM DATABASE:\n';
          exams.forEach(e => {
            databaseContext += `- ${e.course}\n  Date: ${e.date}\n  Period: ${e.period}\n  Location: ${e.space}\n`;
            if (e.lecturer) databaseContext += `  Lecturer: ${e.lecturer}\n`;
          });
        } else {
          databaseContext += '\n\nNo exams found in database.\n';
        }
      }
      
      if (isMensaQuery) {
        const { data: menu } = await supabase
          .from('mensa_menu')
          .select('meal_station, dish_description, price_s, price_m, price_g, notes')
          .limit(10);
        
        if (menu && menu.length > 0) {
          databaseContext += '\n\nMENSA MENU FROM DATABASE:\n';
          menu.forEach(m => {
            databaseContext += `- ${m.meal_station}: ${m.dish_description}\n  Prices: Small ${m.price_s}, Medium ${m.price_m}, Large ${m.price_g}\n`;
            if (m.notes) databaseContext += `  Notes: ${m.notes}\n`;
          });
        } else {
          databaseContext += '\n\nNo mensa menu found in database.\n';
        }
      }
      
      if (isNewsQuery) {
        const { data: news } = await supabase
          .from('whz_news')
          .select('title, description')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (news && news.length > 0) {
          databaseContext += '\n\nLATEST CAMPUS NEWS FROM DATABASE:\n';
          news.forEach(n => {
            databaseContext += `- ${n.title}\n  ${n.description}\n`;
          });
        } else {
          databaseContext += '\n\nNo news found in database.\n';
        }
      }
      
      if (isCultureQuery) {
        const { data: culture } = await supabase
          .from('german_culture_interactions')
          .select('situation, culture_background, german_behavior, interpretation')
          .limit(20);
        
        if (culture && culture.length > 0) {
          databaseContext += '\n\nGERMAN CULTURE & SOCIAL INTERACTIONS GUIDE FROM DATABASE:\n';
          culture.forEach(c => {
            databaseContext += `- ${c.situation}\n  Relevant for: ${c.culture_background}\n  Explanation: ${c.german_behavior}\n  Understanding: ${c.interpretation}\n`;
          });
        } else {
          databaseContext += '\n\nNo culture information found in database.\n';
        }
      }
    } catch (dbError) {
      console.error('Database fetch error:', dbError);
      databaseContext = '\n\nError fetching data from database.\n';
    }
    
    console.log('Database context length:', databaseContext.length);

    // Call Groq API with database context
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
            content: `You are Pixie, a helpful AI assistant for WHZ students.

CRITICAL INSTRUCTION: You MUST ONLY use information from the DATABASE CONTEXT provided below. DO NOT make up or hallucinate any information. If the database context is empty or doesn't contain the requested information, say that you don't have that information available.

${databaseContext}

FORMATTING RULES - FOLLOW EXACTLY:
1. DO NOT use asterisks or any markdown formatting
2. Put TWO newlines (blank line) between the header and first item
3. Put TWO newlines (blank line) between each item
4. Start each item with • followed by a space
5. For details within an item, use ONE newline before each detail line with 2 spaces indent
6. Keep descriptions concise
7. Use emojis for visual appeal

Example format:

Upcoming Events 📅

Here are the events I found:


• Event Title
  📍 Location Name
  📅 Date | ⏰ Time
  Brief description in one line


• Another Event  
  📍 Location Name
  📅 Date | ⏰ Time
  Brief description in one line


Always be friendly and concise.`
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

    // Return the AI response (which now contains only database data)
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
