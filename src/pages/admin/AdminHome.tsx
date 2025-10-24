import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Calendar, CheckCircle, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AdminHome = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    eventAttendance: 0,
  });
  const [eventTrends, setEventTrends] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingProposals, setPendingProposals] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
    fetchPendingProposals();
  }, []);

  const fetchPendingProposals = async () => {
    try {
      const { data, error } = await supabase
        .from("event_proposals")
        .select("*, profiles(email)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingProposals(data || []);
    } catch (error) {
      console.error("Error fetching pending proposals:", error);
    }
  };

  const handleApprove = async (proposal: any) => {
    try {
      // Insert into events table
      const { error: eventError } = await supabase
        .from("events")
        .insert({
          title: proposal.title,
          description: proposal.description,
          event_date: proposal.event_date,
          event_time: proposal.event_time,
          location: proposal.location,
          category: proposal.category,
          image_url: proposal.image_url || '/placeholder.svg',
          registration_info: proposal.registration_info,
          language: proposal.language,
          created_by: proposal.user_id,
          likes: 0,
          prosts: 0
        });

      if (eventError) throw eventError;

      // Update proposal status
      const { error: updateError } = await supabase
        .from("event_proposals")
        .update({ status: 'approved' })
        .eq("id", proposal.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Event proposal approved and added to events!",
      });

      fetchPendingProposals();
      fetchAnalytics();
    } catch (error) {
      console.error("Error approving proposal:", error);
      toast({
        title: "Error",
        description: "Failed to approve proposal",
        variant: "destructive",
      });
    }
  };

  const handleDecline = async (proposalId: string) => {
    try {
      const { error } = await supabase
        .from("event_proposals")
        .update({ status: 'declined' })
        .eq("id", proposalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event proposal declined",
      });

      fetchPendingProposals();
    } catch (error) {
      console.error("Error declining proposal:", error);
      toast({
        title: "Error",
        description: "Failed to decline proposal",
        variant: "destructive",
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Fetch total users (from profiles)
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total events
      const { data: events, count: eventsCount } = await supabase
        .from("events")
        .select("*", { count: "exact" });

      // Fetch total registrations
      const { data: registrations, count: registrationsCount } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact" });

      // Fetch event attendance
      const { count: attendanceCount } = await supabase
        .from("event_attendance")
        .select("*", { count: "exact", head: true });

      // Process event categories for pie chart
      const categoryCounts: any = {};
      events?.forEach(event => {
        categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
      });

      const categoryChartData = Object.entries(categoryCounts).map(([name, value], index) => ({
        name,
        value,
        color: ["#3b82f6", "#f97316", "#06b6d4", "#8b5cf6", "#10b981"][index % 5]
      }));

      // Process monthly event trends (last 6 months)
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          month: date.toLocaleDateString("en-US", { month: "short" }),
          events: 0,
          registrations: 0,
          prosts: 0,
          likes: 0
        };
      });

      events?.forEach(event => {
        const eventDate = new Date(event.created_at);
        const monthIndex = monthlyData.findIndex(m => {
          const d = new Date();
          d.setMonth(d.getMonth() - (5 - monthlyData.indexOf(m)));
          return eventDate.getMonth() === d.getMonth() && eventDate.getFullYear() === d.getFullYear();
        });
        if (monthIndex >= 0) {
          monthlyData[monthIndex].events++;
          monthlyData[monthIndex].prosts += event.prosts || 0;
          monthlyData[monthIndex].likes += event.likes || 0;
        }
      });

      // Process registrations for monthly data
      registrations?.forEach(registration => {
        const regDate = new Date(registration.registered_at);
        const monthIndex = monthlyData.findIndex(m => {
          const d = new Date();
          d.setMonth(d.getMonth() - (5 - monthlyData.indexOf(m)));
          return regDate.getMonth() === d.getMonth() && regDate.getFullYear() === d.getFullYear();
        });
        if (monthIndex >= 0) {
          monthlyData[monthIndex].registrations++;
        }
      });

      setAnalytics({
        totalUsers: usersCount || 0,
        totalEvents: eventsCount || 0,
        totalRegistrations: registrationsCount || 0,
        eventAttendance: attendanceCount || 0,
      });

      setEventTrends(monthlyData);
      setCategoryData(categoryChartData);

      // Process user growth (last 6 months)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("created_at");

      const userGrowthData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          month: date.toLocaleDateString("en-US", { month: "short" }),
          users: 0
        };
      });

      profiles?.forEach(profile => {
        const profileDate = new Date(profile.created_at);
        const monthIndex = userGrowthData.findIndex(m => {
          const d = new Date();
          d.setMonth(d.getMonth() - (5 - userGrowthData.indexOf(m)));
          return profileDate.getMonth() === d.getMonth() && profileDate.getFullYear() === d.getFullYear();
        });
        if (monthIndex >= 0) {
          userGrowthData[monthIndex].users++;
        }
      });

      setUserGrowth(userGrowthData);

      // Process top events by engagement (likes + prosts)
      const topEventsData = events
        ?.map(event => ({
          name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
          engagement: (event.likes || 0) + (event.prosts || 0),
          likes: event.likes || 0,
          prosts: event.prosts || 0
        }))
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5) || [];

      setTopEvents(topEventsData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Events",
      value: analytics.totalEvents.toLocaleString(),
      icon: Calendar,
      color: "text-orange-500",
    },
    {
      title: "Event Registrations",
      value: analytics.totalRegistrations.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Event Attendance",
      value: analytics.eventAttendance.toLocaleString(),
      icon: TrendingUp,
      color: "text-cyan-500",
    },
  ];


  if (loading) {
    return (
      <div className="min-h-screen admin-theme">
        <AdminNavbar />
        <div className="container mx-auto px-6 pt-24 pb-12 flex items-center justify-center">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-theme">
      <AdminNavbar />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-5xl font-bold gradient-text mb-12 text-center">
          Analytics Dashboard
        </h1>

        {/* General Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">General Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="glass-card hover-glow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>


        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events & Registrations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Events & Registrations</CardTitle>
              <CardDescription>Monthly events and registrations (last 6 months)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2} name="Events" />
                  <Line type="monotone" dataKey="registrations" stroke="#f97316" strokeWidth={2} name="Registrations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Likes & Prosts */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Monthly likes and prosts (last 6 months)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="likes" stroke="#10b981" strokeWidth={2} name="Likes" />
                  <Line type="monotone" dataKey="prosts" stroke="#06b6d4" strokeWidth={2} name="Prosts" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid - Category and Registrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          {categoryData.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Events by Category</CardTitle>
                <CardDescription>Distribution across different event types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Registration Trends */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Monthly Registrations</CardTitle>
              <CardDescription>Event registration trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="registrations" fill="#f97316" name="Registrations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations (last 6 months)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="users" fill="#8b5cf6" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Events by Engagement */}
          {topEvents.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Events</CardTitle>
                <CardDescription>Most engaged events (likes + prosts)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topEvents} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" width={150} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="likes" stackId="a" fill="#10b981" name="Likes" />
                    <Bar dataKey="prosts" stackId="a" fill="#06b6d4" name="Prosts" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pending Event Proposals Section */}
        {pendingProposals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
              Pending Event Proposals
              <Badge variant="secondary">{pendingProposals.length}</Badge>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {pendingProposals.map((proposal) => (
                <Card key={proposal.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{proposal.title}</CardTitle>
                        <CardDescription className="text-sm">
                          Submitted by: {proposal.profiles?.email || 'Unknown User'}
                        </CardDescription>
                        <CardDescription className="text-xs mt-1">
                          {new Date(proposal.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(proposal)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDecline(proposal.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Description:</strong> {proposal.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <p><strong>Category:</strong> {proposal.category}</p>
                        <p><strong>Location:</strong> {proposal.location}</p>
                        <p><strong>Date:</strong> {new Date(proposal.event_date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {proposal.event_time}</p>
                        {proposal.language && <p><strong>Language:</strong> {proposal.language}</p>}
                      </div>
                      {proposal.registration_info && (
                        <p><strong>Registration Info:</strong> {proposal.registration_info}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminHome;
