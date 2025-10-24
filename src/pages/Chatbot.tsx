import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatbotNavbar from "@/components/ChatbotNavbar";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Pixie, your campus assistant! How can I help you today? 🌟",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: "I'm currently a prototype! Soon I'll be able to help you with events, schedules, and campus information. 🎓",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <ChatbotNavbar />
      <div className="container mx-auto px-6 pt-24 pb-12 flex items-center justify-center">
        <Card className="w-full max-w-4xl h-[80vh] glass-card border-primary/30 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-pink-600 to-purple-600">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
                Pixie
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              </h2>
              <p className="text-sm text-muted-foreground">Your AI Campus Assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-fade-in ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.sender === "bot"
                      ? "bg-gradient-to-br from-pink-600 to-purple-600"
                      : "bg-primary"
                  }`}
                >
                  {message.sender === "bot" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-primary-foreground" />
                  )}
                </div>
                
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.sender === "bot"
                      ? "bg-card text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-6 border-t border-primary/20">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="glass-card border-primary/20 text-foreground"
            />
            <Button
              onClick={handleSend}
              className="bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Pixie is currently in prototype mode
          </p>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default Chatbot;
