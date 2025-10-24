import { useState } from "react";
import { BookA, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WordOfTheDay = () => {
  const words = [
    {
      german: "Pferd",
      english: "Horse",
      example: "Das Pferd läuft schnell.",
      translation: "The horse runs fast."
    },
    {
      german: "Schmetterling",
      english: "Butterfly",
      example: "Der Schmetterling ist bunt.",
      translation: "The butterfly is colorful."
    },
    {
      german: "Bibliothek",
      english: "Library",
      example: "Ich lerne in der Bibliothek.",
      translation: "I study in the library."
    },
    {
      german: "Freundschaft",
      english: "Friendship",
      example: "Freundschaft ist wichtig.",
      translation: "Friendship is important."
    },
    {
      german: "Gesundheit",
      english: "Health",
      example: "Gesundheit ist das Wichtigste.",
      translation: "Health is the most important thing."
    },
    {
      german: "Abenteuer",
      english: "Adventure",
      example: "Das Leben ist ein Abenteuer.",
      translation: "Life is an adventure."
    },
    {
      german: "Wissenschaft",
      english: "Science",
      example: "Die Wissenschaft macht Fortschritte.",
      translation: "Science is making progress."
    },
    {
      german: "Geburtstag",
      english: "Birthday",
      example: "Heute ist mein Geburtstag.",
      translation: "Today is my birthday."
    },
    {
      german: "Nachbarschaft",
      english: "Neighborhood",
      example: "Ich mag meine Nachbarschaft.",
      translation: "I like my neighborhood."
    },
    {
      german: "Sonnenschein",
      english: "Sunshine",
      example: "Der Sonnenschein ist wunderbar.",
      translation: "The sunshine is wonderful."
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const word = words[currentIndex];

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookA className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold gradient-text">Word of the Day</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextWord}
          className="h-8 w-8 hover:bg-primary/10"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-2xl font-bold text-primary mb-1">{word.german}</p>
          <p className="text-sm text-muted-foreground">{word.english}</p>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-sm font-medium text-foreground mb-1">Example:</p>
            <p className="text-sm text-muted-foreground italic">{word.example}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground italic">{word.translation}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WordOfTheDay;
