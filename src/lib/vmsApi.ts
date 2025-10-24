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
  // Try multiple CORS proxies in sequence
  const proxies = [
    (u: string) => u, // Direct fetch first
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  ];
  
  for (const proxyFn of proxies) {
    try {
      const proxyUrl = proxyFn(url);
      const res = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        },
      });
      
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 0) {
          return text;
        }
      }
    } catch (error) {
      // Continue to next proxy
      console.log(`Proxy attempt failed, trying next...`);
    }
  }
  
  throw new Error('All proxy attempts failed');
};

const parseVmsData = (html: string): VmsEntry[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const entries: VmsEntry[] = [];
  
  // Try to extract text content
  const bodyText = doc.body.textContent || "";
  const lines = bodyText.split('\n').map(line => line.trim()).filter(line => line);
  
  // Look for time patterns and parse accordingly
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Check if this line contains a time (HH:MM:SS Uhr format)
    if (line.match(/\d{1,2}:\d{2}:\d{2}\s+Uhr/)) {
      const departureTime = line.replace(/\s+Uhr.*/, '').trim();
      
      // Next line should be arrival time
      if (i + 1 < lines.length && lines[i + 1].match(/\d{1,2}:\d{2}:\d{2}\s+Uhr/)) {
        const arrivalTime = lines[i + 1].replace(/\s+Uhr.*/, '').trim();
        
        // Next should be the line name
        let lineName = '';
        let location = '';
        
        if (i + 2 < lines.length) {
          lineName = lines[i + 2];
        }
        
        if (i + 3 < lines.length) {
          location = lines[i + 3];
        }
        
        if (lineName && location) {
          entries.push({
            departureTime,
            arrivalTime,
            line: lineName,
            location,
          });
        }
        
        i += 4;
        continue;
      }
    }
    i++;
  }
  
  // Fallback: If no entries found, return some sample data to show the structure works
  if (entries.length === 0) {
    console.warn("No transport data could be parsed from API response");
  }
  
  return entries;
};
