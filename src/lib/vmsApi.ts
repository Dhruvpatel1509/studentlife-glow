export interface VmsEntry {
  departureTime: string;
  arrivalTime: string;
  line: string;
  location: string;
}

const API_URL = "https://mobile.whz.de/vms/get_plan2.php";

export const fetchVmsSchedule = async (): Promise<VmsEntry[]> => {
  try {
    const text = await fetchWithFallback(API_URL);
    return parseVmsData(text);
  } catch (error) {
    console.error("Error fetching VMS schedule:", error);
    throw error;
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

const parseVmsData = (html: string): VmsEntry[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const entries: VmsEntry[] = [];
  
  const bodyText = doc.body.textContent || "";
  const lines = bodyText.split('\n').map(line => line.trim()).filter(line => line);
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Uhr') && lines[i + 1]?.includes('Uhr')) {
      const departureTime = lines[i].replace('Uhr', '').trim();
      const arrivalTime = lines[i + 1].replace('Uhr', '').trim();
      const line = lines[i + 2] || '';
      const location = lines[i + 3] || '';
      
      if (line && location) {
        entries.push({
          departureTime,
          arrivalTime,
          line,
          location,
        });
        i += 3;
      }
    }
  }
  
  return entries;
};
