import { useState } from "react";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { Beer, Briefcase, Music, Code, Users, Trophy } from "lucide-react";

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Events", icon: Users },
    { id: "social", name: "Big Beer Cup", icon: Beer },
    { id: "career", name: "Career Scholar", icon: Briefcase },
    { id: "music", name: "Music Fest", icon: Music },
    { id: "tech", name: "Tech & Coding", icon: Code },
    { id: "sports", name: "Sports Arena", icon: Trophy },
  ];

  const allEvents = [
    {
      title: "Career Fair 2025",
      location: "Main Auditorium",
      time: "17:00-19:30",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      category: "career",
      trending: true
    },
    {
      title: "Oktoberfest Night",
      location: "Campus Garden",
      time: "19:00-23:00",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      category: "social",
      trending: true
    },
    {
      title: "Tech Meetup",
      location: "Innovation Lab",
      time: "18:00-20:00",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
      category: "tech",
      trending: true
    },
    {
      title: "Music Festival",
      location: "Campus Ground",
      time: "16:00-22:00",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
      category: "music",
      trending: true
    },
    {
      title: "Football Tournament",
      location: "Sports Field",
      time: "15:00-18:00",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
      category: "sports",
      trending: false
    },
    {
      title: "Coding Workshop",
      location: "Computer Lab 3",
      time: "14:00-17:00",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      category: "tech",
      trending: false
    },
    {
      title: "Job Interview Prep",
      location: "Career Center",
      time: "10:00-12:00",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
      category: "career",
      trending: false
    },
    {
      title: "Beer Pong Championship",
      location: "Student Union",
      time: "20:00-23:00",
      image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=800&q=80",
      category: "social",
      trending: false
    },
  ];

  const trendingEvents = allEvents.filter(event => event.trending);
  const filteredEvents = selectedCategory === "all" 
    ? allEvents 
    : allEvents.filter(event => event.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-center gradient-text mb-8">
          Campus Events
        </h1>

        {/* Trending Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold gradient-text mb-6">🔥 Trending Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </section>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "glass-card hover:bg-primary/20 text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* All Events */}
        <section>
          <h2 className="text-2xl font-bold gradient-text mb-6">
            {selectedCategory === "all" ? "All Events" : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Events;
