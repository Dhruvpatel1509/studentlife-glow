import { BookOpen, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

const KnowledgeCentreCard = () => {
  const links = [
    { name: "Moodle", url: "https://moodle.org", icon: "📚" },
    { name: "OPAL", url: "https://bildungsportal.sachsen.de/opal/shiblogin?7", icon: "🎓" },
    { name: "WHZ Library", url: "https://www.whz.de/english/university/central-institutions/library/", icon: "📖" },
    { name: "Outlook Email", url: "https://mail.fh-zwickau.de/owa/#path=/mail", icon: "📧" },
    { name: "Slack", url: "https://slack.com/", icon: "💬" },
    { name: "Deutsche Bahn", url: "https://www.bahn.de", icon: "🚄" },
  ];

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold gradient-text">Knowledge Centre</h3>
      </div>
      
      <div className="space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{link.icon}</span>
              <span className="font-medium text-foreground">{link.name}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </Card>
  );
};

export default KnowledgeCentreCard;
