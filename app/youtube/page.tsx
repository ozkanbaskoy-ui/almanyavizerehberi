import Link from 'next/link';

import {
  fetchLatestVideos,
  type YouTubeVideo,
} from '@/lib/thirdparty/youtube';
import { YouTubeCoverflowSlider } from '@/components/youtube/YouTubeCoverflowSlider';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { getSiteSettings } from '@/lib/settings/site';

function mapToCoverflowVideos(videos: YouTubeVideo[]) {
  return videos.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
  }));
}

export default async function YouTubePage() {
  const latestVideos = await fetchLatestVideos(12);
  const coverflowVideos = mapToCoverflowVideos(latestVideos);
  const site = getSiteSettings();

  return (
    <main className="bg-surface-main">
      <section className="site-hero">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 font-heading">
              YouTube Kanalımız
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold md:text-4xl">
              Almanya Vize Süreçleri İçin Video Rehberler
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-sm md:text-base text-surface-main/80">
              Almanya&apos;ya göç, çalışma, aile birleşimi ve fırsat kartı gibi
              konularda hazırladığımız video rehberleri kaydırarak inceleyin.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-surface-soft py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll>
            <div className="panel px-4 py-8 md:px-8">
              <YouTubeCoverflowSlider videos={coverflowVideos} />
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="mt-8 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-slate-600">
              Daha fazla video için YouTube kanalımızı ziyaret edebilirsiniz.
            </p>
            {site.youtubeUrl && (
              <Link
                href={site.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-brand-base px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-light"
              >
                Kanala Git
              </Link>
            )}
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}


