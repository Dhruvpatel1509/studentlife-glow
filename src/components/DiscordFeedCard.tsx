import { MessageCircle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DiscordFeedCard = () => {
  const messages = [
    { user: "John", message: "Where's the library?", time: "2m ago" },
    { user: "Lisa", message: "VPN setup tips?", time: "15m ago" },
    { user: "Mike", message: "Study group tonight?", time: "1h ago" },
  ];

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold gradient-text">Student Community</h3>
      </div>
      
      <div className="space-y-2 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 rounded-lg bg-muted/10 border border-primary/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{msg.user}</span>
              <span className="text-xs text-muted-foreground">{msg.time}</span>
            </div>
            <p className="text-xs text-muted-foreground">{msg.message}</p>
          </div>
        ))}
      </div>
      
      <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground">
        <ExternalLink className="w-4 h-4 mr-2" />
        Open Community
      </Button>
    </Card>
  );
};

export default DiscordFeedCard;
