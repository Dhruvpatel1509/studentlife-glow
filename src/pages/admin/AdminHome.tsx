import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminNavbar from "@/components/AdminNavbar";
import TimetableCard from "@/components/TimetableCard";
import CarouselSection from "@/components/CarouselSection";
import GreetingSection from "@/components/GreetingSection";
import CalendarWidget from "@/components/CalendarWidget";
import MySpaceForm from "@/components/MySpaceForm";
import WordOfTheDay from "@/components/WordOfTheDay";
import TimeTracker from "@/components/TimeTracker";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen admin-theme">
      <AdminNavbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/users")}
          className="mb-6 hover:bg-primary/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>

        <h1 className="text-5xl font-bold gradient-text mb-12 text-center">
          Zwickly ADMIN
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <TimetableCard />
            <CarouselSection />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <GreetingSection />
            <CalendarWidget />
            <MySpaceForm />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WordOfTheDay />
            <TimeTracker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
