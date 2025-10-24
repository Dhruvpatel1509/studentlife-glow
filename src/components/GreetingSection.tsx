import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const GreetingSection = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="glass-card hover-glow p-6 text-right animate-fade-in">
      <h3 className="text-2xl font-bold gradient-text mb-2">
        {getGreeting()}! 👋
      </h3>
      <p className="text-lg font-semibold text-primary mb-2">{getCurrentTime()}</p>
      <p className="text-sm text-muted-foreground">Ready to conquer your day?</p>
    </Card>
  );
};

export default GreetingSection;
