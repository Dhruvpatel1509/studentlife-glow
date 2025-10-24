import { Ticket, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const RegisteredEventsCard = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const events = [
    { 
      name: "AI Bootcamp", 
      date: "Today, 5:00 PM",
      summary: "Join us for an intensive session on machine learning fundamentals and practical applications."
    },
    { 
      name: "Hackathon '25", 
      date: "Tomorrow, 9:00 AM",
      summary: "24-hour coding challenge with amazing prizes and networking opportunities."
    },
  ];

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
            className="relative p-3 rounded-lg bg-muted/20 border border-secondary/10 hover:border-secondary/30 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <p className="font-semibold text-foreground mb-1">{event.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{event.date}</span>
            </div>
            
            {hoveredIndex === index && (
              <div className="mt-2 pt-2 border-t border-primary/20">
                <p className="text-xs text-muted-foreground">{event.summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RegisteredEventsCard;
