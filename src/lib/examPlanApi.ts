import { supabase } from "@/integrations/supabase/client";

export interface ExamEntry {
  course: string;
  space: string;
  lecturer: string;
  date: string;
  period: string;
}

export const fetchExamPlan = async (): Promise<ExamEntry[]> => {
  try {
    // Fetch from Supabase database
    const { data, error } = await supabase
      .from('exams')
      .select('course, space, lecturer, date, period')
      .eq('sem_group', '252035')
      .order('date', { ascending: true });

    if (error) {
      console.error("Error fetching exams from database:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching exam plan:", error);
    return [];
  }
};
