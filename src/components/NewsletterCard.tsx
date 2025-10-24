import { Newspaper, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const NewsletterCard = () => {
  const newsletters = [
    {
      title: "Welcome WHZ!",
      snippet: "Start of the winter semester 2025...",
      content: `Welcome to the Winter Semester 2025!

We're excited to welcome all students back to campus. This semester brings exciting new opportunities, workshops, and events.

Key Highlights:
• New AI and Data Science Lab opening
• Guest lecture series with industry leaders
• Enhanced library facilities
• Student wellness programs

Stay tuned for more updates throughout the semester. Make sure to check your emails regularly for important announcements.

Best wishes for a successful semester!
- WHZ Administration`
    },
    {
      title: "Green Energy Conf",
      snippet: "Sustainability initiative launch...",
      content: `Green Energy Conference - Join Us!

The annual Green Energy Conference is scheduled for next month. This year's theme focuses on renewable energy solutions and campus sustainability.

Topics Include:
• Solar panel installation projects
• Energy-efficient building design
• Student-led sustainability initiatives
• Carbon footprint reduction strategies

Register now to secure your spot. Limited seats available!

Date: March 15-17, 2025
Venue: Main Auditorium

Contact: sustainability@whz.de`
    },
  ];

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold gradient-text">Campus Newsletter</h3>
      </div>
      
      <div className="space-y-3">
        {newsletters.map((newsletter, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="p-3 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground mb-1">{newsletter.title}</p>
                    <p className="text-xs text-muted-foreground">{newsletter.snippet}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </DialogTrigger>
            
            <DialogContent className="bg-background/95 backdrop-blur-xl border-primary/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="gradient-text text-xl">{newsletter.title}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="whitespace-pre-line text-foreground">
                  {newsletter.content}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </Card>
  );
};

export default NewsletterCard;
