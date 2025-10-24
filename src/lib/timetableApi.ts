export interface TimetableEntry {
  dayTime: string;
  course: string;
  room: string;
  instructor: string;
  cycle: string;
}

const API_BASE_URL = "https://mobile.whz.de/stplan/get_stplan.php";
const SEM_GROUP = "252035";
const UID = "sagar";

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
    // Using Freitag (Friday) as it has data in the API
    const day = dayId || "Freitag";
    const url = `${API_BASE_URL}?dayId=${day}&semGrp=${SEM_GROUP}&uid=${UID}`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    return parseTimetableText(text);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return [];
  }
};

const parseTimetableText = (text: string): TimetableEntry[] => {
  // Split the raw response by blank lines (each block = one class entry)
  const blocks = text.trim().split(/\n\s*\n/);

  // Convert each block into an object (course details)
  const parsed = blocks.map((block) => {
    const lines = block.split("\n").map((l) => l.trim());
    return {
      dayTime: lines[0] || "",
      course: lines[1] || "",
      room: (lines[2] || "").replace("Raum", "").trim(),
      instructor: (lines[3] || "").replace("Dozent", "").trim(),
      cycle: (lines[4] || "").replace("Zyklus", "").trim(),
    };
  });

  return parsed;
};
