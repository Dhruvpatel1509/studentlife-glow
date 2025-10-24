import Navbar from "@/components/Navbar";
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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <h2 className="text-3xl font-bold text-center gradient-text mb-8">
          ZNICKLY HOME
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

export default Index;
