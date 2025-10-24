export interface ExamEntry {
  date: string;
  time: string;
  course: string;
  room: string;
  examiner: string;
  type: string;
}

const API_BASE_URL = "https://mobile.whz.de/prplan";
const SEM_GROUP = "252035";

export const fetchExamPlan = async (): Promise<ExamEntry[]> => {
  try {
    // Try to fetch exam plan data
    const url = `${API_BASE_URL}/index.php?listSemGrp=${SEM_GROUP}`;
    
    const text = await fetchWithFallback(url);
    return parseExamPlanHTML(text);
  } catch (error) {
    console.error("Error fetching exam plan:", error);
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

const parseExamPlanHTML = (html: string): ExamEntry[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const entries: ExamEntry[] = [];
  
  // Look for exam entries in the HTML structure
  const panels = doc.querySelectorAll(".panel, .list-group-item");
  
  panels.forEach((panel) => {
    const heading = panel.querySelector(".panel-heading, h3")?.textContent?.trim() || "";
    
    // Extract date and time patterns
    const dateMatch = heading.match(/(\d{1,2}\.\d{1,2}\.\d{4})/);
    const timeMatch = heading.match(/(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/);
    
    const date = dateMatch ? dateMatch[1] : "";
    const time = timeMatch ? timeMatch[1] : "";
    
    let course = "";
    let room = "";
    let examiner = "";
    let type = "";
    
    const rows = panel.querySelectorAll("tr");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      
      if (cells.length === 2) {
        const key = cells[0].textContent?.trim() || "";
        const value = cells[1].textContent?.trim() || "";
        
        if (key.includes("Fach") || key.includes("Modul")) {
          course = value;
        } else if (key.includes("Raum")) {
          room = value.split("Karte")[0].trim();
        } else if (key.includes("Prüfer") || key.includes("Dozent")) {
          examiner = value;
        } else if (key.includes("Art") || key.includes("Typ")) {
          type = value;
        }
      }
    });
    
    if (date || course) {
      entries.push({ date, time, course, room, examiner, type });
    }
  });
  
  return entries.filter(e => e.course); // Only return entries with course names
};
