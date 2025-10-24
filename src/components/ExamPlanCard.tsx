import { GraduationCap, Clock, MapPin, Calendar, ExternalLink } from "lucide-react";
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold gradient-text">Exam Schedule</h3>
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
        <div className="space-y-3">
          {exams.slice(0, 5).map((exam, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/20 border border-primary/10 hover:border-primary/30 transition-all duration-300"
            >
              {exam.date && (
                <div className="flex items-center gap-2 text-sm text-primary mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{exam.date}</span>
                  {exam.time && <span className="text-muted-foreground">• {exam.time}</span>}
                </div>
              )}
              <p className="font-semibold text-foreground mb-1">{exam.course}</p>
              {exam.type && (
                <p className="text-sm text-primary mb-1">📝 {exam.type}</p>
              )}
              {exam.examiner && (
                <p className="text-sm text-muted-foreground mb-1">👨‍🏫 {exam.examiner}</p>
              )}
              {exam.room && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{exam.room}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ExamPlanCard;
