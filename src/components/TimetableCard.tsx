import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { fetchTimetable, TimetableEntry } from "@/lib/timetableApi";

const TimetableCard = () => {
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimetable = async () => {
      setLoading(true);
      const data = await fetchTimetable();
      setSchedule(data);
      setLoading(false);
    };

    loadTimetable();
  }, []);

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold gradient-text">Today's Timetable</h3>
      </div>
      
      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading schedule...</div>
      ) : schedule.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">Unable to load timetable. Please try again later.</div>
      ) : (
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 text-sm text-primary mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{item.dayTime}</span>
              </div>
              <p className="font-semibold text-foreground mb-1">{item.course}</p>
              {item.instructor && (
                <p className="text-sm text-primary mb-1">👨‍🏫 {item.instructor}</p>
              )}
              {item.room && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{item.room}</span>
                </div>
              )}
              {item.cycle && (
                <p className="text-xs text-muted-foreground">🔄 {item.cycle}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TimetableCard;
