import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  location: string;
  event_date: string;
  event_time: string;
  image_url: string;
  category: string;
  likes: number;
  prosts: number;
}

const TrendingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(4);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h3 className="text-2xl font-bold gradient-text mb-6">Upcoming Events</h3>
        <p className="text-center text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold gradient-text mb-6">Upcoming Events</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground col-span-2">No upcoming events yet.</p>
        ) : (
          events.map((event) => (
            <EventCard 
              key={event.id}
              id={event.id}
              title={event.title}
              location={event.location}
              time={event.event_time}
              image={event.image_url}
              category={event.category}
              initialLikes={event.likes}
              initialProsts={event.prosts}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TrendingEvents;
