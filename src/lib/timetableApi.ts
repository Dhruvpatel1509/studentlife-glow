import { supabase } from "@/integrations/supabase/client";

export interface TimetableEntry {
  dayTime: string;
  course: string;
  room: string;
  instructor: string;
  cycle: string;
}

const DAYS_MAP: { [key: string]: string } = {
  Sunday: "Sonntag",
  Monday: "Montag",
  Tuesday: "Dienstag",
  Wednesday: "Mittwoch",
  Thursday: "Donnerstag",
  Friday: "Freitag",
  Saturday: "Samstag",
};

export const getTodayDayInGerman = (): string => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return DAYS_MAP[today] || "Montag";
};

export const fetchTimetable = async (dayId?: string): Promise<TimetableEntry[]> => {
  try {
    // Get today's day in German if no dayId is provided
    const day = dayId || getTodayDayInGerman();
    
    // Fetch from Supabase database
    const { data, error } = await supabase
      .from('timetable')
      .select('day_time, course, room, instructor, cycle')
      .eq('day_name', day)
      .eq('sem_group', '252035')
      .order('day_time', { ascending: true });

    if (error) {
      console.error("Error fetching timetable from database:", error);
      return [];
    }

    // Map database fields to TimetableEntry interface
    return (data || []).map(item => ({
      dayTime: item.day_time,
      course: item.course,
      room: item.room || "",
      instructor: item.instructor || "",
      cycle: item.cycle || ""
    }));
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return [];
  }
};
