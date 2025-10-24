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

export const DAYS_MAP: { [key: string]: string } = {
  Sunday: "Sonntag",
  Monday: "Montag",
  Tuesday: "Dienstag",
  Wednesday: "Mittwoch",
  Thursday: "Donnerstag",
  Friday: "Freitag",
  Saturday: "Samstag",
};

export const WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

export const getTodayDayInGerman = (): string => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return DAYS_MAP[today] || "Montag";
};

export const fetchTimetable = async (dayId?: string): Promise<TimetableEntry[]> => {
  try {
    const day = dayId || getTodayDayInGerman();
    const url = `${API_BASE_URL}?dayId=${day}&semGrp=${SEM_GROUP}&uid=${UID}`;
    
    const text = await fetchWithFallback(url);
    return parseTimetableText(text);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return [];
  }
};

const fetchWithFallback = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.text();
    throw new Error(`Status ${res.status}`);
  } catch (e) {
    const proxies = [
      (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    ];
    for (const p of proxies) {
      try {
        const res = await fetch(p(url));
        if (res.ok) return await res.text();
      } catch {}
    }
    throw e;
  }
};

const parseTimetableText = (text: string): TimetableEntry[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const entries: TimetableEntry[] = [];
  
  const panels = doc.querySelectorAll(".panel");
  
  panels.forEach((panel) => {
    const heading = panel.querySelector(".panel-heading")?.textContent?.trim() || "";
    const timeMatch = heading.match(/(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/);
    const dayTime = timeMatch ? timeMatch[1] : "";
    
    let course = "";
    let room = "";
    let instructor = "";
    let cycle = "";
    
    const rows = panel.querySelectorAll("tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      
      if (cells.length === 1) {
        const text = cells[0].textContent?.trim() || "";
        if (text && !text.startsWith("Raum") && !text.startsWith("Dozent") && !text.startsWith("Zyklus")) {
          course = text;
        }
      } else if (cells.length === 2) {
        const key = cells[0].textContent?.trim() || "";
        const value = cells[1].textContent?.trim() || "";
        
        if (key === "Raum") {
          room = value.split("Karte")[0].trim();
        } else if (key === "Dozent") {
          instructor = value;
        } else if (key === "Zyklus") {
          cycle = value.replace(/\s*Zyklus\s*/g, "").trim();
        }
      }
    });
    
    if (dayTime && course) {
      entries.push({ dayTime, course, room, instructor, cycle });
    }
  });
  
  return entries;
};
