import { Train, RefreshCw, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchVmsSchedule, VmsEntry } from "@/lib/vmsApi";
import { useToast } from "@/hooks/use-toast";

const TransportScheduleCard = () => {
  const [schedule, setSchedule] = useState<VmsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const loadSchedule = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchVmsSchedule();
      setSchedule(data);
      setError(false);
    } catch (error) {
      console.error("Failed to load transport schedule:", error);
      setError(true);
      toast({
        title: "Connection Error",
        description: "Unable to load transport schedule. Click refresh to try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Train className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold gradient-text">Transport Schedule</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={loadSchedule}
          disabled={loading}
          className="h-8 w-8"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading schedule...</div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-3">Unable to load transport data</p>
          <Button onClick={loadSchedule} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      ) : schedule.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">No transport data available</div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">{item.departureTime}</span>
                  <span className="text-muted-foreground text-sm">→</span>
                  <span className="font-semibold text-foreground">{item.arrivalTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary mb-1">
                <Train className="w-3 h-3" />
                <span className="font-medium">{item.line}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TransportScheduleCard;
