export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
}

const API_BASE_URL = "https://mobile.whz.de/news/index.php";

export const fetchCampusNews = async (): Promise<NewsItem[]> => {
  try {
    const text = await fetchWithFallback(API_BASE_URL);
    return parseNewsHTML(text);
  } catch (error) {
    console.error("Error fetching campus news:", error);
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

const parseNewsHTML = (html: string): NewsItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const news: NewsItem[] = [];
  
  // Find all image links - each news item starts with an image
  const images = doc.querySelectorAll('a img[src*="newsbilder"]');
  
  images.forEach((img) => {
    const imageUrl = img.getAttribute('src') || '';
    const imageId = imageUrl.match(/newsbilder\/(\d+)_/)?.[1] || '';
    
    // Get the next sibling elements for title and summary
    let currentElement = img.closest('a')?.nextElementSibling;
    let title = '';
    let summary = '';
    
    // Find the h3 (title)
    while (currentElement && !title) {
      if (currentElement.tagName === 'H3') {
        title = currentElement.textContent?.trim() || '';
        break;
      }
      currentElement = currentElement.nextElementSibling;
    }
    
    // Find the paragraph (summary) after the h3
    if (currentElement) {
      currentElement = currentElement.nextElementSibling;
      while (currentElement && !summary) {
        if (currentElement.tagName === 'P') {
          const text = currentElement.textContent?.trim() || '';
          if (text && text !== 'weiterlesen') {
            summary = text;
            break;
          }
        }
        currentElement = currentElement.nextElementSibling;
      }
    }
    
    if (imageId && title && summary) {
      news.push({
        id: imageId,
        title,
        summary,
        imageUrl: imageUrl.startsWith('http') ? imageUrl : `https://mobile.whz.de${imageUrl}`
      });
    }
  });
  
  // Return only first 2 news items
  return news.slice(0, 2);
};
