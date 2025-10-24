import { useState } from "react";
import { User, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const MySpaceForm = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
    date: "",
    location: "",
    delegatory: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      toast.success("Submitted for approval! 🎉");
      setFormData({
        title: "",
        description: "",
        language: "",
        date: "",
        location: "",
        delegatory: ""
      });
      setShowDialog(false);
    } else {
      toast.error("Please fill in required fields");
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

      <Button 
        onClick={() => setShowDialog(true)}
        className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create New
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-primary/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="gradient-text">Create Event / Study Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-foreground">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-foreground">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="language" className="text-foreground">Language</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-foreground">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-foreground">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="delegatory" className="text-foreground">Delegatory</Label>
              <Input
                id="delegatory"
                value={formData.delegatory}
                onChange={(e) => setFormData({...formData, delegatory: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              Submit for Approval
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MySpaceForm;
