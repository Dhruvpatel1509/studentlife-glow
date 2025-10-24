import { Wallet, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const WalletCard = () => {
  const [balance, setBalance] = useState(47.50);
  
  const recentTransactions = [
    { type: "expense", name: "Mensa Lunch", amount: 5.20, date: "Today" },
    { type: "expense", name: "Library Print", amount: 2.30, date: "Yesterday" },
    { type: "income", name: "Top Up", amount: 50.00, date: "2 days ago" },
  ];

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
        <p className="text-4xl font-bold text-foreground mb-3">€{balance.toFixed(2)}</p>
        <Button 
          onClick={handleTopUp}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Top Up
        </Button>
      </div>

      {/* Recent Transactions */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Recent Transactions</h4>
        <div className="space-y-2">
          {recentTransactions.map((transaction, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full ${
                  transaction.type === "expense" 
                    ? "bg-destructive/20" 
                    : "bg-primary/20"
                }`}>
                  {transaction.type === "expense" ? (
                    <ArrowUpRight className="w-3 h-3 text-destructive" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${
                transaction.type === "expense" 
                  ? "text-destructive" 
                  : "text-primary"
              }`}>
                {transaction.type === "expense" ? "-" : "+"}€{transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WalletCard;
