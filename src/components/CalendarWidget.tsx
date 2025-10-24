import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date().getDate();
  const isCurrentMonth = 
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  // Dummy events for specific dates
  const eventDates = [5, 9, 15, 20, 25];
  const eventDetails: Record<number, string> = {
    5: "Hackathon '25",
    9: "Workshop",
    15: "AI Bootcamp",
    20: "Career Fair",
    25: "Sports Day"
  };

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold gradient-text">Calendar</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="h-10 w-10 hover:bg-primary/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-10 w-10 hover:bg-primary/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-base font-bold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 relative">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasEvent = eventDates.includes(day);
          const isToday = isCurrentMonth && day === today;

          return (
            <div
              key={day}
              className="relative"
              onMouseEnter={() => hasEvent && setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <div
                className={`aspect-square flex flex-col items-center justify-center text-base rounded-lg cursor-pointer transition-all duration-200 ${
                  isToday
                    ? "bg-primary text-primary-foreground font-bold shadow-lg scale-105"
                    : "hover:bg-muted/20 text-foreground hover:scale-105"
                }`}
              >
                <span className="mb-0.5">{day}</span>
                {hasEvent && (
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </div>
              
              {hoveredDate === day && hasEvent && (
                <div className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-card border border-primary/30 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium">
                  {eventDetails[day]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarWidget;
