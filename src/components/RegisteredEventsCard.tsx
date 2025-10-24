import { Ticket, Calendar, Heart, Wine } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RegisteredEventsCard = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const events = [
    { 
      name: "AI Bootcamp", 
      date: "Today, 5:00 PM",
      summary: "Join us for an intensive session on machine learning fundamentals and practical applications.",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
      likes: 42,
      prosts: 18
    },
    { 
      name: "Hackathon '25", 
      date: "Tomorrow, 9:00 AM",
      summary: "24-hour coding challenge with amazing prizes and networking opportunities.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      likes: 67,
      prosts: 29
    },
  ];

  const [eventLikes, setEventLikes] = useState(events.map(e => ({ likes: e.likes, prosts: e.prosts, isLiked: false })));

  const handleLike = (index: number) => {
    const newEventLikes = [...eventLikes];
    if (newEventLikes[index].isLiked) {
      newEventLikes[index].likes--;
      newEventLikes[index].isLiked = false;
      toast.info("Like removed");
    } else {
      newEventLikes[index].likes++;
      newEventLikes[index].isLiked = true;
      toast.success("Liked! ❤️");
    }
    setEventLikes(newEventLikes);
  };

  const handleProst = (index: number) => {
    const newEventLikes = [...eventLikes];
    newEventLikes[index].prosts++;
    setEventLikes(newEventLikes);
    toast.success("🍻 Prost!");
  };

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Ticket className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold gradient-text">Registered Events</h3>
      </div>
      
      <div className="space-y-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden bg-muted/20 border border-secondary/10 hover:border-secondary/30 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            
            <div className="p-3">
              <p className="font-semibold text-foreground mb-1">{event.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <Calendar className="w-3 h-3" />
                <span>{event.date}</span>
              </div>
              
              {hoveredIndex === index && (
                <div className="mb-2 pb-2 border-b border-primary/20">
                  <p className="text-xs text-muted-foreground">{event.summary}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLike(index)}
                  className={`flex-1 ${
                    eventLikes[index].isLiked
                      ? "bg-primary/20 border-primary/40 text-primary"
                      : "glass-card border-primary/20"
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${eventLikes[index].isLiked ? "fill-primary" : ""}`} />
                  {eventLikes[index].likes}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleProst(index)}
                  className="flex-1 glass-card border-primary/20 hover:border-secondary/40"
                >
                  <Wine className="w-4 h-4 mr-1" />
                  {eventLikes[index].prosts}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RegisteredEventsCard;
