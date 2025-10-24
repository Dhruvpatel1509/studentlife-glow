import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/admin/home");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/admin/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (isSignUp && !adminCode) {
      toast.error("Admin verification code is required");
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/home`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Assign admin role with verification code
          const { error: roleError } = await supabase.rpc('assign_user_role', {
            _user_id: data.user.id,
            _role: 'admin',
            _admin_code: adminCode
          });

          if (roleError) {
            // If role assignment fails, show specific error
            if (roleError.message.includes('Invalid admin verification code')) {
              toast.error("Invalid admin verification code");
            } else {
              throw roleError;
            }
            return;
          }

          toast.success("Admin account created! Please check your email to verify.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Signed in successfully!");
        navigate("/admin/home");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/users")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to User Selection
        </Button>

        <Card className="glass-card hover-glow p-8 animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="p-6 rounded-full bg-gradient-to-br from-orange-600 to-red-600 shadow-lg mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h1>
            <p className="text-muted-foreground">KommPakt Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminCode">Admin Verification Code</Label>
                  <Input
                    id="adminCode"
                    type="text"
                    placeholder="Enter admin code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact your administrator for the verification code
                  </p>
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
