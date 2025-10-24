export interface ExamEntry {
  course: string;
  space: string;
  lecturer: string;
  date: string;
  period: string;
}

const API_BASE_URL = "https://mobile.whz.de/prplan";
const SEM_GROUP = "252035";

// Fallback exam data
const FALLBACK_EXAMS: ExamEntry[] = [
  {
    course: "WIW64000 Business Information Systems - 252035",
    space: "165 (MHG)",
    lecturer: "Prof.Schumann,C.",
    date: "02.02.2026",
    period: "10:00 a.m. to 11:30 a.m."
  },
  {
    course: "PTI90220 Advanced Computer Graphics_GAB216 - 252035",
    space: "",
    lecturer: "Prof.Hellbach",
    date: "04.02.2026",
    period: "9:00 a.m. to 5:00 p.m."
  },
  {
    course: "PTI90180 Car-to-Car Communication - 252035",
    space: "370 (PKB Building 2)",
    lecturer: "Prof.Grimm,F.",
    date: "11.02.2026",
    period: "9:00 a.m. to 5:00 p.m."
  }
];

export const fetchExamPlan = async (): Promise<ExamEntry[]> => {
  try {
    // Fetch from the correct endpoint
    const url = `${API_BASE_URL}/index.php?listSemGrp=${SEM_GROUP}`;
    
    const text = await fetchWithFallback(url);
    const parsed = parseExamPlanText(text);
    
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

const parseExamPlanText = (text: string): ExamEntry[] => {
  const entries: ExamEntry[] = [];
  
  // Split by double newlines to separate exam entries
  const blocks = text.split(/\n\s*\n/).filter(block => block.trim());
  
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    
    if (lines.length < 5) return; // Need at least 5 lines for complete entry
    
    let course = "";
    let space = "";
    let lecturer = "";
    let date = "";
    let period = "";
    
    // Parse each line by looking for keywords
    lines.forEach(line => {
      if (line.toLowerCase().startsWith('space')) {
        space = line.replace(/^space\s*/i, '').trim();
      } else if (line.toLowerCase().startsWith('lecturer')) {
        lecturer = line.replace(/^lecturer\s*/i, '').trim();
      } else if (line.toLowerCase().startsWith('date')) {
        date = line.replace(/^date\s*/i, '').trim();
      } else if (line.toLowerCase().startsWith('period')) {
        period = line.replace(/^period\s*/i, '').trim();
      } else if (!course && (line.includes('-') || line.match(/^[A-Z]{3}\d+/))) {
        // First line that contains course code or has a dash is likely the course
        course = line;
      }
    });
    
    // Only add if we have at least course and date
    if (course && date) {
      entries.push({ course, space, lecturer, date, period });
    }
  });
  
  return entries;
};
