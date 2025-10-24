import AdminNavbar from "@/components/AdminNavbar";
import EventCard from "@/components/EventCard";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  likes: number;
  prosts: number;
  description?: string;
  language?: string;
  registration_info?: string;
}

interface EventRegistration {
  event_name: string;
  user_email: string;
  registered_at: string;
}

const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
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
    description: "",
    language: "",
    registration_info: "",
  });

  const categories = ["Career", "Tech", "Music", "Sports", "Social"];

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
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

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          registered_at,
          events!inner(title),
          profiles!inner(email)
        `)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      
      const formattedData: EventRegistration[] = (data || []).map((reg: any) => ({
        event_name: reg.events.title,
        user_email: reg.profiles.email,
        registered_at: new Date(reg.registered_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      
      setRegistrations(formattedData);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error("Failed to load registrations");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.event_date || 
        !formData.event_time || !formData.image_url || !formData.category) {
      toast.error("Please fill in all required fields");
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
        description: "",
        language: "",
        registration_info: "",
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
      description: event.description || "",
      language: event.language || "",
      registration_info: event.registration_info || "",
    });
    setEditingId(event.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

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
    <div className="min-h-screen admin-theme">
      <AdminNavbar />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/home")}
          className="mb-6 hover:bg-primary/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold gradient-text">
            Event Feed Manager
          </h1>
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
                  description: "",
                  language: "",
                  registration_info: "",
                });
              }
            }}
            className="bg-primary hover:bg-primary/80"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Cancel" : "Add Event"}
          </Button>
        </div>

        {showForm && (
          <Card className="glass-card p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Career Fair 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Main Auditorium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Date *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_time">Time *</Label>
                  <Input
                    id="event_time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    placeholder="e.g., 17:00-19:30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
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
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed event description..."
                  className="w-full min-h-24 px-3 py-2 rounded-md border border-input bg-background text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="e.g., English, Deutsch"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_info">Registration Info</Label>
                <textarea
                  id="registration_info"
                  value={formData.registration_info}
                  onChange={(e) => setFormData({ ...formData, registration_info: e.target.value })}
                  placeholder="Registration requirements, deadlines, etc..."
                  className="w-full min-h-20 px-3 py-2 rounded-md border border-input bg-background text-sm"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/80">
                {editingId ? "Update Event" : "Create Event"}
              </Button>
            </form>
          </Card>
        )}

        {/* Planned Events Section */}
        <section>
          <h2 className="text-2xl font-bold gradient-text mb-6">Planned Events</h2>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground">No events available yet. Create your first event!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <div key={event.id} className="relative group">
                  <EventCard 
                    id={event.id}
                    title={event.title}
                    location={event.location}
                    time={event.event_time}
                    image={event.image_url}
                    category={event.category}
                    initialLikes={event.likes}
                    initialProsts={event.prosts}
                    description={event.description}
                    language={event.language}
                    registrationInfo={event.registration_info}
                    eventDate={new Date(event.event_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      className="bg-white/90 hover:bg-white shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-500/90 hover:bg-red-500 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Event Registrations Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold gradient-text mb-6">Event Registrations</h2>
          {registrations.length === 0 ? (
            <p className="text-center text-muted-foreground">No registrations yet.</p>
          ) : (
            <Card className="glass-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead>Registered At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{reg.event_name}</TableCell>
                      <TableCell>{reg.user_email}</TableCell>
                      <TableCell className="text-muted-foreground">{reg.registered_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminEvents;
