import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import zwicklyLogo from "@/assets/zwickly-logo.png";
import pixieLogo from "@/assets/pixie-logo.png";
import kommpaktLogo from "@/assets/kommpakt-logo.png";

const Users = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  const userTypes = [
    {
      id: "student",
      title: "Zwickly Student",
      description: "Access your campus dashboard",
      logo: zwicklyLogo,
      action: () => navigate("/student-auth"),
      gradient: "from-blue-600 to-purple-600"
    },
    {
      id: "chatbot",
      title: "Pixie",
      description: "Chat with our AI assistant",
      logo: pixieLogo,
      action: () => navigate("/chatbot"),
      gradient: "from-pink-600 to-purple-600"
    },
    {
      id: "admin",
      title: "KommPakt",
      description: "Admin portal access",
      logo: kommpaktLogo,
      action: () => navigate("/admin-auth"),
      gradient: "from-orange-600 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text mb-4">Welcome to Zwickly</h1>
          <p className="text-muted-foreground text-lg">Choose your portal to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => {
            return (
              <Card
                key={type.id}
                onClick={type.action}
                className="glass-card hover-glow cursor-pointer group relative overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in p-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img src={type.logo} alt={type.title} className="w-full h-full object-contain" />
                  </div>
                  
                  <h2 className="text-2xl font-bold gradient-text">{type.title}</h2>
                  <p className="text-muted-foreground">{type.description}</p>
                  
                  <div className="mt-4 px-6 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    Continue →
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Users;
