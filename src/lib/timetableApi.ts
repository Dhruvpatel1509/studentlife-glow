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
      (u: string) => `https://r.jina.ai/http/${u.replace(/^https?:\/\//, "")}`,
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
  // Parse HTML to extract plain text data
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const entries: TimetableEntry[] = [];
  
  // Find all panels (each panel is one class entry)
  const panels = doc.querySelectorAll(".panel");
  
  panels.forEach((panel) => {
    // Extract time from heading (e.g., "Freitag 7:30 - 10:50 Uhr")
    const heading = panel.querySelector(".panel-heading")?.textContent?.trim() || "";
    const timeMatch = heading.match(/(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/);
    const dayTime = timeMatch ? timeMatch[1] : "";
    
    // Extract course, room, instructor, and cycle from table rows
    let course = "";
    let room = "";
    let instructor = "";
    let cycle = "";
    
    const rows = panel.querySelectorAll("tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      
      if (cells.length === 1) {
        // Course name (single cell)
        const text = cells[0].textContent?.trim() || "";
        if (text && !text.startsWith("Raum") && !text.startsWith("Dozent") && !text.startsWith("Zyklus")) {
          course = text;
        }
      } else if (cells.length === 2) {
        // Key-value pairs
        const key = cells[0].textContent?.trim() || "";
        const value = cells[1].textContent?.trim() || "";
        
        if (key === "Raum") {
          room = value.split("Karte")[0].trim(); // Remove "Karte" link text
        } else if (key === "Dozent") {
          instructor = value;
        } else if (key === "Zyklus") {
          cycle = value.replace(/\s*Zyklus\s*/g, "").trim(); // Remove image alt text
        }
      }
    });
    
    if (dayTime && course) {
      entries.push({ dayTime, course, room, instructor, cycle });
    }
  });
  
  return entries;
};
