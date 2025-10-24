import { useNavigate } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import TimetableCard from "@/components/TimetableCard";
import RegisteredEventsCard from "@/components/RegisteredEventsCard";
import NewsletterCard from "@/components/NewsletterCard";
import KnowledgeCentreCard from "@/components/KnowledgeCentreCard";
import CarouselSection from "@/components/CarouselSection";
import TrendingEvents from "@/components/TrendingEvents";
import GreetingSection from "@/components/GreetingSection";
import CalendarWidget from "@/components/CalendarWidget";
import MySpaceForm from "@/components/MySpaceForm";
import WordOfTheDay from "@/components/WordOfTheDay";
import TimeTracker from "@/components/TimeTracker";
import WalletCard from "@/components/WalletCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen admin-theme">
      <AdminNavbar />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/users")}
          className="mb-6 hover:bg-primary/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>

        <h2 className="text-3xl font-bold text-center gradient-text mb-8">
          Zwickly HOME
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANE */}
          <div className="lg:col-span-3 space-y-6">
          <TimetableCard />
          <RegisteredEventsCard />
          <NewsletterCard />
          <KnowledgeCentreCard />
          </div>

          {/* MIDDLE PANE */}
          <div className="lg:col-span-6 space-y-6">
            <CarouselSection />
            <TrendingEvents />
          </div>

          {/* RIGHT PANE */}
          <div className="lg:col-span-3 space-y-6">
            <GreetingSection />
            <WalletCard />
            <CalendarWidget />
            <MySpaceForm />
            <WordOfTheDay />
            <TimeTracker />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
