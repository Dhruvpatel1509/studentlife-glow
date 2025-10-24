import { useState, useEffect } from "react";
import { Heart, Wine, FileText, MapPin, Clock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { detectBeverage } from "@/lib/beverageDetection";
import ProstAnimation from "./ProstAnimation";
import { supabase } from "@/integrations/supabase/client";

interface EventCardProps {
  id?: string;
  title: string;
  location: string;
  time: string;
  image: string;
  category?: string;
  initialLikes?: number;
  initialProsts?: number;
}

const EventCard = ({ id, title, location, time, image, category, initialLikes = 0, initialProsts = 0 }: EventCardProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [prosts, setProsts] = useState(initialProsts);
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    setLikes(initialLikes);
    setProsts(initialProsts);
  }, [initialLikes, initialProsts]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showProstAnimation, setShowProstAnimation] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleLike = async () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    const newIsLiked = !isLiked;
    
    setLikes(newLikes);
    setIsLiked(newIsLiked);
    
    if (id) {
      try {
        const { error } = await supabase
          .from('events')
          .update({ likes: newLikes })
          .eq('id', id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error updating likes:', error);
        setLikes(isLiked ? likes + 1 : likes - 1);
        setIsLiked(isLiked);
      }
    }
    
    toast.success(newIsLiked ? "Liked! ❤️" : "Like removed");
  };

  const handleProst = () => {
    setShowImageUpload(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmitDetection = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first!");
      return;
    }

    setIsDetecting(true);
    try {
      const result = await detectBeverage(selectedImage);
      
      if (result.detected) {
        const newProsts = prosts + result.count;
        setProsts(newProsts);
        
        if (id) {
          try {
            await supabase
              .from('events')
              .update({ prosts: newProsts })
              .eq('id', id);
          } catch (error) {
            console.error('Error updating prosts:', error);
          }
        }
        
        setShowImageUpload(false);
        setShowProstAnimation(true);
        toast.success(`🍻 Prost! ${result.count} beverage(s) detected: ${result.labels.join(", ")}`);
      } else {
        toast.error("No beverage detected. Try again with a drink in the image!");
      }
    } catch (error) {
      console.error('Detection error:', error);
      toast.error("Error detecting beverage. Please try again.");
    } finally {
      setIsDetecting(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedImage(null);
      setPreviewUrl(null);
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
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold text-foreground">{title}</h4>
            {category && (
              <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                {category}
              </span>
            )}
          </div>
          
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
          
          <div className="space-y-2">
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
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleRegister}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
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
              onChange={handleImageSelect}
              className="w-full p-3 rounded-lg glass-card border border-primary/20 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            
            {previewUrl && (
              <div className="relative rounded-lg overflow-hidden border border-primary/20">
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}

            <Button
              onClick={handleSubmitDetection}
              disabled={!selectedImage || isDetecting}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                "Submit & Detect"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ProstAnimation 
        show={showProstAnimation} 
        onComplete={() => setShowProstAnimation(false)} 
      />
    </>
  );
};

export default EventCard;
