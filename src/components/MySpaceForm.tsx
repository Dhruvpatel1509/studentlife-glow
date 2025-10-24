import { useState } from "react";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MySpaceForm = () => {
  const [eventName, setEventName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventName.trim()) {
      toast.success("Submitted for approval! 🎉");
      setEventName("");
    } else {
      toast.error("Please enter an event or group name");
    }
  };

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold gradient-text">My Space</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Create Event / Study Group
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Event Name / Group Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="glass-card border-primary/20 focus:border-primary/40 text-foreground placeholder:text-muted-foreground"
        />
        
        <Button 
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          Submit for Approval
        </Button>
      </form>
    </Card>
  );
};

export default MySpaceForm;
