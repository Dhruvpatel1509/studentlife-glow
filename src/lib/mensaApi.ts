export interface MensaMeal {
  title: string;
  description: string;
  priceSmall: string;
  priceMedium: string;
  priceLarge: string;
  imageUrl: string;
  isVegetarian: boolean;
}

const API_BASE_URL = "https://mobile.whz.de/mensa/get_swcz_data.php";

const DAYS_MAP: { [key: string]: string } = {
  Monday: "montag",
  Tuesday: "dienstag",
  Wednesday: "mittwoch",
  Thursday: "donnerstag",
  Friday: "freitag",
};

const getCurrentWeek = (): number => {
  const date = new Date();
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getTodayDayName = (): string => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return DAYS_MAP[today] || "montag";
};

export const fetchMensaSchedule = async (dayId?: string): Promise<MensaMeal[]> => {
  try {
    const day = dayId || getTodayDayName();
    const week = getCurrentWeek();
    const timestamp = Date.now();
    const url = `${API_BASE_URL}?tag=${day}_4&week=${week}&_=${timestamp}`;
    
    const text = await fetchWithFallback(url);
    return parseMensaHTML(text);
  } catch (error) {
    console.error("Error fetching mensa schedule:", error);
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

const parseMensaHTML = (html: string): MensaMeal[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const meals: MensaMeal[] = [];
  
  // Find all meal sections - they are typically separated by headers
  const allText = doc.body.textContent || "";
  const sections = allText.split(/(?=[A-Z][a-z]+ Zwickau)/);
  
  sections.forEach((section) => {
    const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
    
    if (lines.length < 2) return;
    
    const title = lines[0];
    if (!title.includes("Zwickau")) return;
    
    const description = lines[1];
    
    // Find price line (contains €)
    const priceLine = lines.find(l => l.includes("€")) || "";
    const priceMatches = priceLine.match(/(\d+,\d+)\s*€/g) || [];
    
    const priceSmall = priceMatches[0] || "N/A";
    const priceMedium = priceMatches[1] || "N/A";
    const priceLarge = priceMatches[2] || "N/A";
    
    // Check for vegetarian icon
    const isVegetarian = section.toLowerCase().includes("veggie") || 
                        section.toLowerCase().includes("vegetar");
    
    // Extract image URL from HTML
    const imgMatch = html.match(/pics\/essen_id\d+\.png/);
    const imageUrl = imgMatch ? `https://mobile.whz.de/mensa/${imgMatch[0]}` : "";
    
    if (title && description) {
      meals.push({
        title: title.replace(" Zwickau", ""),
        description,
        priceSmall,
        priceMedium,
        priceLarge,
        imageUrl,
        isVegetarian
      });
    }
  });
  
  return meals;
};
