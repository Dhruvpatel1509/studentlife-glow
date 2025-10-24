import AdminNavbar from "@/components/AdminNavbar";
import EventManager from "@/components/EventManager";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminEvents = () => {
  const navigate = useNavigate();

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

        <h1 className="text-4xl font-bold text-center gradient-text mb-8">
          Event Feed Manager
        </h1>

        <div className="max-w-4xl mx-auto">
          <EventManager />
        </div>
      </main>
    </div>
  );
};

export default AdminEvents;
