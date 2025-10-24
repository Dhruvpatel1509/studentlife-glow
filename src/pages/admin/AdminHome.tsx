import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Calendar, Mail, MousePointerClick, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminHome = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    emailsSent: 0,
    emailsOpened: 0,
    emailsClicked: 0,
    emailsBounced: 0,
    ctr: 0,
    uniqueOpens: 0,
    eventAttendance: 0,
  });
  const [eventTrends, setEventTrends] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

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
      const { count: registrationsCount } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true });

      // Fetch email campaigns
      const { data: campaigns } = await supabase
        .from("email_campaigns")
        .select("sent_count");

      const totalSent = campaigns?.reduce((sum, c) => sum + c.sent_count, 0) || 0;

      // Fetch email analytics
      const { data: emailAnalytics } = await supabase
        .from("email_analytics")
        .select("*");

      const opened = emailAnalytics?.filter(e => e.opened_at).length || 0;
      const clicked = emailAnalytics?.filter(e => e.clicked_at).length || 0;
      const bounced = emailAnalytics?.filter(e => e.bounced).length || 0;
      const uniqueOpens = new Set(emailAnalytics?.filter(e => e.opened_at).map(e => e.user_id)).size;
      const ctr = opened > 0 ? ((clicked / opened) * 100).toFixed(1) : 0;

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
          prosts: 0
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
        }
      });

      setAnalytics({
        totalUsers: usersCount || 0,
        totalEvents: eventsCount || 0,
        totalRegistrations: registrationsCount || 0,
        emailsSent: totalSent,
        emailsOpened: opened,
        emailsClicked: clicked,
        emailsBounced: bounced,
        ctr: Number(ctr),
        uniqueOpens,
        eventAttendance: attendanceCount || 0,
      });

      setEventTrends(monthlyData);
      setCategoryData(categoryChartData);
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

  const emailStats = [
    {
      title: "Emails Sent",
      value: analytics.emailsSent.toLocaleString(),
      icon: Mail,
      color: "text-blue-500",
    },
    {
      title: "Emails Opened",
      value: analytics.emailsOpened.toLocaleString(),
      icon: Eye,
      color: "text-green-500",
    },
    {
      title: "Unique Opens (Reached)",
      value: analytics.uniqueOpens.toLocaleString(),
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "CTR (Click Rate)",
      value: `${analytics.ctr}%`,
      icon: MousePointerClick,
      color: "text-orange-500",
    },
    {
      title: "Emails Clicked",
      value: analytics.emailsClicked.toLocaleString(),
      icon: MousePointerClick,
      color: "text-cyan-500",
    },
    {
      title: "Emails Bounced",
      value: analytics.emailsBounced.toLocaleString(),
      icon: AlertCircle,
      color: "text-red-500",
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

        {/* Email Campaign Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Email Campaign Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emailStats.map((stat, index) => {
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
          {/* Event Trends */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Event Trends</CardTitle>
              <CardDescription>Monthly events, registrations, and prosts (last 6 months)</CardDescription>
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
                  <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="registrations" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="prosts" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
