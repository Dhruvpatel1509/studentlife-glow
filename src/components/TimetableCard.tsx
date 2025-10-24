import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchTimetable, TimetableEntry, WEEKDAYS, getTodayDayInGerman } from "@/lib/timetableApi";

const TimetableCard = () => {
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(getTodayDayInGerman());
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(
    WEEKDAYS.indexOf(getTodayDayInGerman())
  );

  useEffect(() => {
    const loadTimetable = async () => {
      setLoading(true);
      const data = await fetchTimetable(selectedDay);
      setSchedule(data);
      setLoading(false);
    };

    loadTimetable();
  }, [selectedDay]);

  const handlePreviousDay = () => {
    const newIndex = currentDayIndex > 0 ? currentDayIndex - 1 : WEEKDAYS.length - 1;
    setCurrentDayIndex(newIndex);
    setSelectedDay(WEEKDAYS[newIndex]);
  };

  const handleNextDay = () => {
    const newIndex = currentDayIndex < WEEKDAYS.length - 1 ? currentDayIndex + 1 : 0;
    setCurrentDayIndex(newIndex);
    setSelectedDay(WEEKDAYS[newIndex]);
  };

  const isToday = selectedDay === getTodayDayInGerman();

  const getDayAbbreviation = (day: string): string => {
    const abbreviations: { [key: string]: string } = {
      Montag: "Mo",
      Dienstag: "Di",
      Mittwoch: "Mi",
      Donnerstag: "Do",
      Freitag: "Fr"
    };
    return abbreviations[day] || day.substring(0, 2);
  };

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold gradient-text">Timetable</h3>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousDay}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-primary min-w-[2rem] text-center">
            {getDayAbbreviation(selectedDay)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextDay}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading schedule...</div>
      ) : schedule.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">No classes scheduled for {selectedDay}</div>
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
