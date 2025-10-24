import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, UtensilsCrossed, Calendar, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const CarouselSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "🥗 Mensa Menu",
      subtitle: "Delicious meals at student-friendly prices. Fresh ingredients daily with vegetarian and vegan options available.",
      icon: UtensilsCrossed,
      color: "from-green-500/20 to-emerald-500/20",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-primary">Weekly Menu</h4>
          <div className="grid gap-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, i) => (
              <div key={day} className="p-3 rounded-lg bg-muted/20 border border-primary/10">
                <p className="font-semibold text-foreground mb-2">{day}</p>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">Main: Pasta Carbonara - €4.50</p>
                  <p className="text-muted-foreground">Veg: Buddha Bowl - €4.20</p>
                  <p className="text-muted-foreground">Dessert: Apple Strudel - €1.80</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "🎉 Upcoming Events",
      subtitle: "Join exciting campus events, workshops, and networking opportunities. Connect with fellow students and industry professionals.",
      icon: Calendar,
      color: "from-blue-500/20 to-cyan-500/20",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-primary">Next Week's Events</h4>
          <div className="grid gap-3">
            {[
              { name: "Tech Talk: AI in Healthcare", date: "Monday, 6:00 PM", venue: "Hall A" },
              { name: "Career Fair 2025", date: "Wednesday, 10:00 AM", venue: "Main Building" },
              { name: "Sports Day", date: "Friday, 2:00 PM", venue: "Sports Complex" },
            ].map((event, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 border border-primary/10">
                <p className="font-semibold text-foreground mb-1">{event.name}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <p className="text-sm text-muted-foreground">Venue: {event.venue}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "📰 Campus News",
      subtitle: "Stay informed with the latest campus announcements, facility updates, and important notices for the student community.",
      icon: Newspaper,
      color: "from-purple-500/20 to-pink-500/20",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-primary">Recent Announcements</h4>
          <div className="grid gap-3">
            {[
              { title: "New Library Hours", summary: "Extended hours during exam period - now open until 11 PM." },
              { title: "Research Grants Available", summary: "Apply for student research funding. Deadline: March 31." },
              { title: "Cafeteria Renovation", summary: "New seating area opening next week with modern facilities." },
            ].map((news, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 border border-primary/10">
                <p className="font-semibold text-foreground mb-1">{news.title}</p>
                <p className="text-sm text-muted-foreground">{news.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <Card className="glass-card hover-glow p-8 animate-fade-in">
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${slides[currentSlide].color} border border-primary/20`}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        />
        
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CurrentIcon className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold gradient-text">{slides[currentSlide].title}</h3>
              </div>
              <p className="text-foreground/90 text-sm max-w-2xl">{slides[currentSlide].subtitle}</p>
            </div>
          
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="glass-card border-primary/20 hover:border-primary/40"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="glass-card border-primary/20 hover:border-primary/40"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/95 backdrop-blur-xl border-primary/30 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="gradient-text text-xl">{slides[currentSlide].title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[500px] pr-4">
              {slides[currentSlide].content}
            </ScrollArea>
          </DialogContent>
        </Dialog>

          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-primary w-8" : "bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CarouselSection;
