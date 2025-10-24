import { Flame } from "lucide-react";
import EventCard from "./EventCard";

const TrendingEvents = () => {
  const events = [
    {
      title: "Career Fair 2025",
      location: "Main Auditorium",
      time: "17:00-19:30",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      category: "Career"
    },
    {
      title: "Tech Meetup",
      location: "Innovation Lab",
      time: "18:00-20:00",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
      category: "Tech"
    },
    {
      title: "Music Festival",
      location: "Campus Ground",
      time: "16:00-22:00",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
      category: "Music"
    },
    {
      title: "Coding Workshop",
      location: "Computer Lab 3",
      time: "14:00-17:00",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      category: "Tech"
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-6 h-6 text-primary animate-glow" />
        <h3 className="text-2xl font-bold gradient-text">Trending Events</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </div>
  );
};

export default TrendingEvents;
