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

  // Primary strategy: iterate headings and pick nearby image and summary
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3')) as HTMLElement[];

  for (const h of headings) {
    const title = (h.textContent || '').trim();
    if (!title) continue;

    // Find summary: next non-empty paragraph that isn't "weiterlesen"
    let summary = '';
    let el: Element | null = h.nextElementSibling;
    while (el) {
      if (el.tagName === 'P') {
        const text = (el.textContent || '').trim();
        if (text && text.toLowerCase() !== 'weiterlesen') {
          summary = text;
          break;
        }
      }
      el = el.nextElementSibling;
    }

    // Find an image close to the heading (previous or next siblings)
    let imgUrl = '';
    // look backwards up to 3 siblings
    let prev: Element | null = h.previousElementSibling;
    let steps = 0;
    while (prev && steps < 3 && !imgUrl) {
      const img = prev.querySelector('img[src*="newsbilder"]') as HTMLImageElement | null;
      if (img?.src) imgUrl = img.src;
      prev = prev.previousElementSibling;
      steps++;
    }
    // look forwards if not found
    let next: Element | null = h.nextElementSibling;
    steps = 0;
    while (next && steps < 3 && !imgUrl) {
      const img = next.querySelector('img[src*="newsbilder"]') as HTMLImageElement | null;
      if (img?.src) imgUrl = img.src;
      next = next.nextElementSibling;
      steps++;
    }

    if (title && summary) {
      const id = imgUrl.match(/newsbilder\/(\d+)_/)?.[1] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24);
      news.push({
        id,
        title,
        summary,
        imageUrl: imgUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'
      });
    }

    if (news.length >= 2) break;
  }

  // Fallback regex strategy if nothing was found
  if (news.length === 0) {
    const titleMatches = Array.from(html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi)).slice(0, 2);
    const imgMatches = Array.from(html.matchAll(/newsbilder\/(\d+)[^"']+\.(?:jpg|png)/gi));

    for (let i = 0; i < titleMatches.length; i++) {
      const rawTitle = titleMatches[i][1].replace(/<[^>]+>/g, '').trim();
      const imgRel = imgMatches[i]?.[0] || '';
      news.push({
        id: (imgRel.match(/(\d+)/)?.[1]) || `${i}`,
        title: rawTitle,
        summary: 'Read more on WHZ News portal',
        imageUrl: imgRel ? `https://mobile.whz.de/news/${imgRel.startsWith('newsbilder') ? '' : ''}${imgRel}` : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'
      });
    }
  }

  return news.slice(0, 2);
};
