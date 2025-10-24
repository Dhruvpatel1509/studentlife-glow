import { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TimeEntry {
  activity: string;
  hours: number;
  color: string;
}

const TimeTracker = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([
    { activity: "Library", hours: 2, color: "#a855f7" },
    { activity: "Class", hours: 3, color: "#8b5cf6" },
    { activity: "Commute", hours: 1, color: "#c084fc" },
  ]);

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const updateHours = (index: number, newHours: string) => {
    const hours = parseFloat(newHours);
    if (hours >= 0 && !isNaN(hours)) {
      const newEntries = [...entries];
      newEntries[index].hours = hours;
      setEntries(newEntries);
      toast.success("Time updated!");
    }
  };

  const getDonutSegments = () => {
    let currentAngle = -90; // Start from top
    return entries.map((entry) => {
      const percentage = (entry.hours / totalHours) * 100;
      const angle = (percentage / 100) * 360;
      const segment = {
        ...entry,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        percentage: percentage.toFixed(1)
      };
      currentAngle += angle;
      return segment;
    });
  };

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold gradient-text">Time Tracker</h3>
      </div>

      <div className="space-y-3 mb-6">
        {entries.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-primary/10">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-foreground flex-grow">{entry.activity}</span>
            <Input
              type="number"
              value={entry.hours}
              onChange={(e) => updateHours(index, e.target.value)}
              className="glass-card border-primary/20 text-sm w-20 text-center"
              step="0.5"
              min="0"
            />
            <span className="text-sm text-muted-foreground">h</span>
          </div>
        ))}
      </div>

      {/* Donut Chart */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(270 30% 90%)"
              strokeWidth="20"
            />
            {getDonutSegments().map((segment, index) => {
              const startAngle = (segment.startAngle * Math.PI) / 180;
              const endAngle = (segment.endAngle * Math.PI) / 180;
              const x1 = 50 + 40 * Math.cos(startAngle);
              const y1 = 50 + 40 * Math.sin(startAngle);
              const x2 = 50 + 40 * Math.cos(endAngle);
              const y2 = 50 + 40 * Math.sin(endAngle);
              const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  opacity="0.8"
                  className="hover:opacity-100 transition-opacity"
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="hsl(270 60% 98%)" />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-primary">{totalHours}h</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {getDonutSegments().map((segment, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-muted-foreground">
              {segment.activity}: {segment.percentage}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TimeTracker;
