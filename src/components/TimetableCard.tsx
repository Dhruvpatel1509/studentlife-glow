import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

const TimetableCard = () => {
  const schedule = [
    { time: "09:00 AM", subject: "AI & ML", location: "Room PKB 103" },
    { time: "11:00 AM", subject: "DBMS (LAB)", location: "Room CAD2" },
    { time: "02:00 PM", subject: "Project Meet", location: "Library Hall" },
    { time: "04:00 PM", subject: "Cloud Computing", location: "Room PKB 201" },
  ];

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold gradient-text">Today's Timetable</h3>
      </div>
      
      <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar">
        {schedule.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 text-sm text-primary mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{item.time}</span>
            </div>
            <p className="font-semibold text-foreground mb-1">{item.subject}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TimetableCard;
