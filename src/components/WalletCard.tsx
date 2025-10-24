import { Wallet, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const WalletCard = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setBalance(data.wallet_balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = () => {
    toast.success("Redirecting to top-up page...");
  };

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold gradient-text">Student ID Wallet</h3>
      </div>
      
      {/* Balance Display */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
        <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
        <p className="text-4xl font-bold text-foreground mb-3">
          {loading ? "..." : `€${balance.toFixed(2)}`}
        </p>
        <Button 
          onClick={handleTopUp}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Top Up
        </Button>
      </div>
    </Card>
  );
};

export default WalletCard;
