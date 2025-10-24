export interface TimetableEntry {
  time: string;
  subject: string;
  location: string;
  professor: string;
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
    const day = dayId || getTodayDayInGerman();
    const url = `${API_BASE_URL}?dayId=${day}&semGrp=${SEM_GROUP}&uid=${UID}`;
    
    const response = await fetch(url);
    const html = await response.text();
    
    return parseTimetableHTML(html);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return [];
  }
};

const parseTimetableHTML = (html: string): TimetableEntry[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const entries: TimetableEntry[] = [];
  
  const panels = doc.querySelectorAll(".panel");
  
  panels.forEach((panel) => {
    const heading = panel.querySelector(".panel-heading b")?.textContent || "";
    const timeMatch = heading.match(/(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})\s*Uhr/);
    
    if (!timeMatch) return;
    
    const time = timeMatch[1];
    const rows = panel.querySelectorAll("tr");
    
    let subject = "";
    let location = "";
    let professor = "";
    
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      
      if (cells.length === 2) {
        const label = cells[0].textContent?.trim() || "";
        const value = cells[1].textContent?.trim() || "";
        
        if (label === "Raum") {
          location = value.split(" ")[0]; // Extract room number before "Karte"
        } else if (label === "Dozent") {
          professor = value;
        }
      } else if (cells.length === 1) {
        const text = cells[0].textContent?.trim() || "";
        if (text && !text.startsWith("Raum") && !text.startsWith("Dozent")) {
          subject = text;
        }
      }
    });
    
    if (subject && time) {
      entries.push({ time, subject, location, professor });
    }
  });
  
  return entries;
};
