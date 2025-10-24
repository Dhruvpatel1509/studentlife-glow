import { GraduationCap, Clock, MapPin, Calendar, ExternalLink, BookOpen, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchExamPlan, ExamEntry } from "@/lib/examPlanApi";

const ExamPlanCard = () => {
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExamPlan = async () => {
      setLoading(true);
      const data = await fetchExamPlan();
      setExams(data);
      setLoading(false);
    };

    loadExamPlan();
  }, []);

  const openExamPortal = () => {
    window.open('https://mobile.whz.de/prplan/index.php?listSemGrp=252035', '_blank');
  };

  return (
    <Card className="glass-card hover-glow p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold gradient-text">Next 3 Exams</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={openExamPortal}
          className="text-xs"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Portal
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Seminar Group 252035</p>
      
      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading exams...</div>
      ) : exams.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No upcoming exams found</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openExamPortal}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Exam Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {exams.slice(0, 3).map((exam, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="font-semibold text-foreground leading-tight">{exam.course}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                {exam.space && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Space: {exam.space}</span>
                  </div>
                )}
                
                {exam.lecturer && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Lecturer: {exam.lecturer}</span>
                  </div>
                )}
                
                {exam.date && (
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Date: {exam.date}</span>
                  </div>
                )}
                
                {exam.period && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Period: {exam.period}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ExamPlanCard;
