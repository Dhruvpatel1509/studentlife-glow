import { useState } from "react";
import { User, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MySpaceForm = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
    event_date: "",
    event_time: "",
    location: "",
    category: "",
    registration_info: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.event_date || 
        !formData.event_time || !formData.location || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to submit an event");
        return;
      }

      const { error } = await supabase
        .from("event_proposals")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          event_date: formData.event_date,
          event_time: formData.event_time,
          location: formData.location,
          category: formData.category,
          language: formData.language || null,
          registration_info: formData.registration_info || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Submitted for approval! 🎉");
      setFormData({
        title: "",
        description: "",
        language: "",
        event_date: "",
        event_time: "",
        location: "",
        category: "",
        registration_info: ""
      });
      setShowDialog(false);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
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
              <Label htmlFor="category" className="text-foreground">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="glass-card border-primary/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event_date" className="text-foreground">Event Date *</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="event_time" className="text-foreground">Event Time *</Label>
              <Input
                id="event_time"
                type="time"
                value={formData.event_time}
                onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-foreground">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
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
              <Label htmlFor="registration_info" className="text-foreground">Registration Info</Label>
              <Textarea
                id="registration_info"
                value={formData.registration_info}
                onChange={(e) => setFormData({...formData, registration_info: e.target.value})}
                className="glass-card border-primary/20 text-foreground"
                placeholder="Add registration instructions or requirements"
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit for Approval"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MySpaceForm;
