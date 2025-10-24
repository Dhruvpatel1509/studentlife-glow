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
  
  // Find all meal divs with class "thumbnail"
  const thumbnails = doc.querySelectorAll('.thumbnail');
  
  thumbnails.forEach((thumbnail) => {
    // Extract title (in bold div)
    const titleDiv = thumbnail.querySelector('div[style*="font-weight:bold"]');
    const title = titleDiv?.textContent?.trim().replace(" Zwickau", "") || "";
    
    // Extract description (in the 120px height div)
    const descDiv = thumbnail.querySelector('div[style*="height:120px"]');
    const description = descDiv?.textContent?.trim() || "";
    
    // Extract prices
    const priceDiv = thumbnail.querySelector('div[style*="text-align:center"]');
    const priceText = priceDiv?.textContent || "";
    const priceMatches = priceText.match(/(\d+,\d+)\s*€/g) || [];
    
    const priceSmall = priceMatches[0] || "N/A";
    const priceMedium = priceMatches[1] || "N/A";
    const priceLarge = priceMatches[2] || "N/A";
    
    // Extract image URL
    const img = thumbnail.querySelector('img[src*="pics/essen_id"]');
    const imgSrc = img?.getAttribute('src') || "";
    const imageUrl = imgSrc ? `https://mobile.whz.de/mensa/${imgSrc}` : "";
    
    // Check for vegetarian
    const allText = thumbnail.textContent?.toLowerCase() || "";
    const isVegetarian = allText.includes('veg') || 
                        thumbnail.querySelector('img[alt*="Veggie"]') !== null;
    
    if (title && description) {
      meals.push({
        title,
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
