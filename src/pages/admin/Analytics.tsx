import { ArrowLeft, TrendingUp, Users, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminNavbar from "@/components/AdminNavbar";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const navigate = useNavigate();

  const eventTrends = [
    { month: "Jan", events: 12, registrations: 245, prosts: 156 },
    { month: "Feb", events: 15, registrations: 312, prosts: 234 },
    { month: "Mar", events: 18, registrations: 398, prosts: 289 },
    { month: "Apr", events: 22, registrations: 456, prosts: 378 },
    { month: "May", events: 20, registrations: 521, prosts: 412 },
    { month: "Jun", events: 25, registrations: 634, prosts: 521 },
  ];

  const categoryData = [
    { name: "Career", value: 35, color: "#3b82f6" },
    { name: "Social", value: 28, color: "#f97316" },
    { name: "Sports", value: 22, color: "#06b6d4" },
    { name: "Cultural", value: 15, color: "#8b5cf6" },
  ];

  const userActivity = [
    { day: "Mon", active: 420, new: 45 },
    { day: "Tue", active: 380, new: 32 },
    { day: "Wed", active: 450, new: 56 },
    { day: "Thu", active: 490, new: 67 },
    { day: "Fri", active: 520, new: 78 },
    { day: "Sat", active: 380, new: 42 },
    { day: "Sun", active: 320, new: 28 },
  ];

  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Events",
      value: "142",
      change: "+8.2%",
      icon: Calendar,
      color: "text-orange-500",
    },
    {
      title: "Total Prosts",
      value: "8,234",
      change: "+23.1%",
      icon: TrendingUp,
      color: "text-cyan-500",
    },
    {
      title: "Chat Sessions",
      value: "1,892",
      change: "+15.7%",
      icon: MessageSquare,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen admin-theme">
      <AdminNavbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/home")}
          className="mb-6 hover:bg-primary/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Home
        </Button>

        <h1 className="text-5xl font-bold gradient-text mb-12 text-center">
          Analytics Dashboard
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-xs text-green-500 mt-1">{stat.change} from last month</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Event Trends */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Event Trends</CardTitle>
              <CardDescription>Monthly events, registrations, and prosts</CardDescription>
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
        </div>

        {/* User Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Weekly active users and new registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="active" fill="#f97316" radius={[8, 8, 0, 0]} />
                <Bar dataKey="new" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
