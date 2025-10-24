import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Trash2, Plus, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  location: string;
  event_date: string;
  event_time: string;
  image_url: string;
  category: string;
}

const EventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    event_date: "",
    event_time: "",
    image_url: "",
    category: "",
  });

  const categories = ["Career", "Tech", "Music", "Sports", "Social"];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.event_date || 
        !formData.event_time || !formData.image_url || !formData.category) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success("Event updated successfully!");
      } else {
        const { error } = await supabase
          .from('events')
          .insert([formData]);

        if (error) throw error;
        toast.success("Event created successfully!");
      }

      setFormData({
        title: "",
        location: "",
        event_date: "",
        event_time: "",
        image_url: "",
        category: "",
      });
      setShowForm(false);
      setEditingId(null);
      fetchEvents();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(error.message || "Failed to save event");
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      location: event.location,
      event_date: event.event_date,
      event_time: event.event_time,
      image_url: event.image_url,
      category: event.category,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.message || "Failed to delete event");
    }
  };

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold gradient-text">Event Feed Manager</h3>
        </div>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingId(null);
              setFormData({
                title: "",
                location: "",
                event_date: "",
                event_time: "",
                image_url: "",
                category: "",
              });
            }
          }}
          size="sm"
          className="bg-primary hover:bg-primary/80"
        >
          <Plus className="w-4 h-4 mr-1" />
          {showForm ? "Cancel" : "Add Event"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Career Fair 2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Main Auditorium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Date</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_time">Time</Label>
              <Input
                id="event_time"
                value={formData.event_time}
                onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                placeholder="e.g., 17:00-19:30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/80">
            {editingId ? "Update Event" : "Create Event"}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-muted-foreground">No events yet. Create your first event!</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {event.location} • {event.event_date} • {event.event_time}
                </p>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {event.category}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(event)}
                  className="text-primary hover:text-primary hover:bg-primary/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default EventManager;
