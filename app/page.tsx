import Image from 'next/image';
import Link from 'next/link';

import { getAllVisas } from '@/lib/content/visas';
import {
  fetchLatestVideos,
  type YouTubeVideo,
} from '@/lib/thirdparty/youtube';
import { VideoSlider } from '@/components/home/VideoSlider';
import { getHomeSettings } from '@/lib/settings/home';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

const HERO_IMAGE =
  'https://2b.almanyavizerehberi.com/dist/img/slider/slider.webp';

const VISA_CARD_ORDER = [
  {
    slug: 'calisma-vizesi',
    image: 'https://2b.almanyavizerehberi.com/dist/img/hizmet/1.webp',
  },
  {
    slug: 'mavi-kart-vizesi',
    image: 'https://2b.almanyavizerehberi.com/dist/img/hizmet/2.webp',
  },
  {
    slug: 'firsat-karti',
    image: 'https://2b.almanyavizerehberi.com/dist/img/hizmet/3.webp',
  },
  {
    slug: 'mesleki-egitim-vizesi',
    image: 'https://2b.almanyavizerehberi.com/dist/img/hizmet/5.webp',
  },
];

// Ana sayfa için fallback video listesi (YouTube feed'i hata verirse kullanılır)
const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'VIDEO_ID_1',
    title: 'Almanya Çalışma Vizesi Süreci',
    url: 'https://www.youtube.com/watch?v=VIDEO_ID_1',
    publishedAt: '',
    description:
      'Almanya çalışma vizesi başvuru adımları, gerekli belgeler ve dikkat edilmesi gereken noktalar.',
  },
  {
    id: 'VIDEO_ID_2',
    title: 'Aile Birleşimi Vizesi Rehberi',
    url: 'https://www.youtube.com/watch?v=VIDEO_ID_2',
    publishedAt: '',
    description:
      "Aile birleşimi vizesi ile Almanya'ya yerleşirken bilmeniz gereken temel kurallar ve pratik ipuçları.",
  },
];

export default async function HomePage() {
  const visas = getAllVisas();
  const homeSettings = getHomeSettings();
  const latestVideos = await fetchLatestVideos(8);
  const videos: YouTubeVideo[] =
    latestVideos.length > 0 ? latestVideos : FALLBACK_VIDEOS;

  const featuredVisas = VISA_CARD_ORDER.map((item) => {
    const v = visas.find((visa) => visa.slug === item.slug);
    if (!v) return null;
    return { ...v, image: item.image };
  }).filter(Boolean) as (ReturnType<typeof getAllVisas>[number] & {
    image: string;
  })[];

  return (
    <main id="main" className="bg-surface-main">
      {/* HERO */}
      <section
        id="home-hero"
        className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_50%,_#020617_95%)] text-surface-main"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 pt-14 pb-12 md:flex-row md:items-center">
          <RevealOnScroll className="order-2 md:order-1 md:w-1/2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-light/80">
              {homeSettings.hero.kicker}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              {homeSettings.hero.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-surface-main/85">
              {homeSettings.hero.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/basvuru.php"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-base to-brand-light px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-dark/40 transition hover:from-brand-light hover:to-brand-base"
              >
                {homeSettings.hero.primaryCtaText}
              </Link>
              <Link
                href="#home-services"
                className="inline-flex items-center justify-center rounded-full border border-surface-main/20 bg-white/5 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-surface-main backdrop-blur-sm transition hover:bg-white/10"
              >
                {homeSettings.hero.secondaryCtaText}
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="order-1 md:order-2 md:w-1/2" delay={0.15}>
            <div className="relative h-72 w-full overflow-hidden rounded-[2.5rem] border border-surface-main/10 bg-surface-main/5 shadow-2xl shadow-black/40">
              <Image
                src={HERO_IMAGE}
                alt="Almanya Vize Rehberi"
                fill
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-dark/70 via-transparent to-brand-light/30" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* VİDEO REHBERLER */}
      <section
        id="home-videos"
        className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-to)_0,_var(--color-hero-from)_40%,_var(--color-video-bg)_100%)] py-20"
      >
        <div className="mx-auto max-w-[1200px] px-4">
          {/* Bölüm başlığı – koyu mavi zemin üzerinde beyaz metin */}
          <RevealOnScroll className="text-center">
            <h2 className="text-3xl font-semibold text-surface-main md:text-4xl">
              {homeSettings.videos.title}
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-base text-surface-main/80 md:text-lg">
              {homeSettings.videos.body}
            </p>
          </RevealOnScroll>

          {/* Slider kartı – beyaz panel */}
          <RevealOnScroll className="mt-10">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-border-subtle/70 bg-surface-main px-4 py-10 shadow-[0_26px_80px_rgba(15,23,42,0.5)] md:px-10">
              <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-brand-base/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-brand-light/10 blur-3xl" />
              <div className="relative">
                <VideoSlider
                  videos={videos.map((v) => ({
                    id: v.id,
                    title: v.title,
                    description: v.description,
                  }))}
                />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* HİZMETLERİMİZ - ÖNE ÇIKANLAR */}
      <section
        id="home-services"
        className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_var(--color-video-bg)_100%)] pt-20 pb-10"
      >
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-brand-base/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-brand-light/25 blur-3xl" />
        <div className="relative mx-auto max-w-[1200px] px-4">
          {/* Bölüm başlığı – hero gibi lacivert zemin üzerinde beyaz metin */}
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-surface-main/70 md:text-sm">
              {homeSettings.services.kicker}
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-surface-main md:text-4xl">
              {homeSettings.services.title}
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-base text-surface-main/80 md:text-lg">
              {homeSettings.services.body}
            </p>
          </RevealOnScroll>

          {/* Kartlar – beyaz panel içinde */}
          <RevealOnScroll className="mt-10">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-border-subtle/70 bg-surface-main px-4 py-10 shadow-[0_26px_80px_rgba(15,23,42,0.5)] md:px-10">
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-light/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-base/10 blur-3xl" />
              <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {featuredVisas.map((visa, index) => (
                  <RevealOnScroll key={visa.slug} delay={0.05 * index}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface-main shadow-[0_18px_60px_rgba(15,23,42,0.18)] transition hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.3)]">
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={visa.image}
                          alt={visa.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-semibold text-brand-dark md:text-xl">
                          {visa.title}
                        </h3>
                        <p className="mt-2 line-clamp-4 text-[15px] leading-relaxed text-slate-800 md:text-base">
                          {visa.seoDescription}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <Link
                            href={`/hizmetler/${visa.slug}`}
                            className="text-xs font-semibold text-brand-base hover:text-brand-light"
                          >
                            Detayları Gör
                          </Link>
                          <span className="text-xs text-slate-500">
                            Vize • Almanya
                          </span>
                        </div>
                      </div>
                    </article>
                  </RevealOnScroll>
                ))}
              </div>

              <RevealOnScroll className="relative mt-10 text-center">
                <Link
                  href="/hizmetler.php?l=1"
                  className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-surface-main px-7 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand-dark shadow-sm hover:border-brand-base hover:text-brand-base hover:shadow-md"
                >
                  Tüm Vize Hizmetlerini Gör
                </Link>
              </RevealOnScroll>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
