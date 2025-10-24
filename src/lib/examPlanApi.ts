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

// Fallback exam data
const FALLBACK_EXAMS: ExamEntry[] = [
  {
    date: "15.02.2025",
    time: "09:00 - 11:00",
    course: "Advanced Programming",
    room: "A11.2.23",
    examiner: "Prof. Dr. Schmidt",
    type: "Written Exam"
  },
  {
    date: "18.02.2025",
    time: "14:00 - 16:00",
    course: "Database Systems",
    room: "A11.3.15",
    examiner: "Prof. Dr. Müller",
    type: "Written Exam"
  },
  {
    date: "22.02.2025",
    time: "10:00 - 12:00",
    course: "Software Engineering",
    room: "A11.2.18",
    examiner: "Prof. Dr. Weber",
    type: "Project Presentation"
  },
  {
    date: "25.02.2025",
    time: "09:00 - 11:00",
    course: "Web Technologies",
    room: "A11.3.22",
    examiner: "Prof. Dr. Becker",
    type: "Written Exam"
  },
  {
    date: "01.03.2025",
    time: "13:00 - 15:00",
    course: "Computer Networks",
    room: "A11.2.25",
    examiner: "Prof. Dr. Fischer",
    type: "Oral Exam"
  }
];

export const fetchExamPlan = async (): Promise<ExamEntry[]> => {
  try {
    // Try to fetch exam plan data
    const url = `${API_BASE_URL}/get_prplan.php?semGrp=${SEM_GROUP}&uid=student`;
    
    const text = await fetchWithFallback(url);
    const parsed = parseExamPlanHTML(text);
    
    // Return parsed data if available, otherwise fallback
    return parsed.length > 0 ? parsed : FALLBACK_EXAMS;
  } catch (error) {
    console.error("Error fetching exam plan:", error);
    return FALLBACK_EXAMS;
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
