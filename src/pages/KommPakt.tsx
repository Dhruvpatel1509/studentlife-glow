import { useNavigate } from "react-router-dom";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const KommPakt = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/users")}
        className="absolute top-6 left-6 hover:bg-primary/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </Button>
      <Card className="glass-card border-primary/30 p-12 text-center max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-gradient-to-br from-orange-600 to-red-600 shadow-lg">
            <Shield className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold gradient-text mb-4">KommPakt</h1>
        <p className="text-muted-foreground mb-8">Admin Portal</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Lock className="w-5 h-5" />
            <p className="text-sm">Coming Soon</p>
          </div>
          
          <p className="text-xs text-muted-foreground">
            This portal is currently under development. Authentication and admin features will be added soon.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default KommPakt;
