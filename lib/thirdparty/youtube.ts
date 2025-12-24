export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  description?: string;
};

const CHANNEL_ID = 'UCYNClRqdbdinZphYGiSGg9Q';

// Kanalın RSS feed'inden son videolari çeker.
// Not: Hata durumunda bos dizi döner, bu durumda ana sayfa fallback statik videolari kullanabilir.
export async function fetchLatestVideos(limit = 4): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      {
        next: { revalidate: 3600 }, // 1 saatte bir yeniden getir
      }
    );

    if (!res.ok) {
      return [];
    }

    const xml = await res.text();

    // <entry> bloklarini ayir
    const entries = xml.split('<entry>').slice(1);

    const videos: YouTubeVideo[] = [];

    for (const entry of entries.slice(0, limit)) {
      const getTag = (tag: string) => {
        const match = entry.match(
          new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
        );
        return match ? match[1].trim() : '';
      };

      const id = getTag('yt:videoId');
      const title = getTag('title');
      const publishedAt = getTag('published');

      if (!id) continue;

      videos.push({
        id,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        publishedAt,
      });
    }

    return videos;
  } catch {
    return [];
  }
}

