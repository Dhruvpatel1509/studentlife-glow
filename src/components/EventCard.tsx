import { useState } from "react";
import { Heart, Wine, FileText, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EventCardProps {
  title: string;
  location: string;
  time: string;
  image: string;
}

const EventCard = ({ title, location, time, image }: EventCardProps) => {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const [prosts, setProsts] = useState(Math.floor(Math.random() * 30) + 5);
  const [isLiked, setIsLiked] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
      toast.info("Like removed");
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
      toast.success("Liked! ❤️");
    }
  };

  const handleProst = () => {
    setShowImageUpload(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate beverage detection
      const hasBeverage = Math.random() > 0.3; // 70% chance of detecting beverage
      
      if (hasBeverage) {
        setProsts(prosts + 1);
        toast.success("🍻 Prost! Beverage detected and counted!");
        setShowImageUpload(false);
      } else {
        toast.error("No beverage detected. Try again with a drink in the image!");
      }
    }
  };

  const handleRegister = () => {
    toast.success("Registered successfully! 🎉");
  };

  return (
    <>
      <Card className="glass-card hover-glow overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 animate-fade-in">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        
        <div className="p-5">
          <h4 className="text-lg font-bold text-foreground mb-3">{title}</h4>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>{time}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`flex-1 ${
                isLiked
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "glass-card border-primary/20"
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-primary" : ""}`} />
              {likes}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleProst}
              className="flex-1 glass-card border-primary/20 hover:border-secondary/40"
            >
              <Wine className="w-4 h-4 mr-1" />
              {prosts}
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleRegister}
              className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              <FileText className="w-4 h-4 mr-1" />
              Register
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <DialogContent className="glass-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="gradient-text">Upload Beverage Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a photo with a bottle or beverage to increase the Prost count! 🍻
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 rounded-lg glass-card border border-primary/20 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
