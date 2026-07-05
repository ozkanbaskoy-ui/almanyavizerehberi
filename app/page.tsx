import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import { getAllVisas } from '@/lib/content/visas';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: 'Almanya Vize Rehberi - Profesyonel Danışmanlık',
  description:
    'Almanya vizesi, Almanya çalışma vizesi, Mavi Kart, Fırsat Kartı ve nitelikli göç sonrası işlemler için profesyonel danışmanlık.',
  keywords: [
    'Almanya vize rehberi',
    'Almanya vizesi',
    'Almanya çalışma vizesi',
    'Almanya göç',
    'çalışma vizesi',
    'Mavi Kart',
    'Fırsat Kartı',
  ],
  alternates: {
    canonical: 'https://www.almanyavizerehberi.com/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.almanyavizerehberi.com/',
    title: 'Almanya Vize Rehberi - Profesyonel Danışmanlık',
    description:
      'Almanya vizesi, Almanya çalışma vizesi, Mavi Kart, Fırsat Kartı ve nitelikli göç sonrası işlemler için profesyonel danışmanlık.',
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Almanya Vize Rehberi',
      },
    ],
  },
};
import {
  fetchLatestVideos,
  type YouTubeVideo,
} from '@/lib/thirdparty/youtube';
import { VideoSlider } from '@/components/home/VideoSlider';
import { getHomeSettings } from '@/lib/settings/home';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { HeroParallaxImage } from '@/components/home/HeroParallaxImage';

// Hizmet kartları için kullanılan görseller artık projeye dahil statik dosyalardan geliyor.
// Eski sitedeki 2b.almanyavizerehberi.com alan adı Vercel'de kaldırıldığı için
// home services bölümündeki görseller production'da görünmüyordu.
const VISA_CARD_ORDER = [
  {
    slug: 'calisma-vizesi',
    image: '/assets/img/hizmet/1.webp',
  },
  {
    slug: 'mavi-kart-vizesi',
    image: '/assets/img/hizmet/2.webp',
  },
  {
    slug: 'firsat-karti',
    image: '/assets/img/hizmet/3.webp',
  },
  {
    slug: 'mesleki-egitim-vizesi',
    image: '/assets/img/hizmet/5.webp',
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

const SERVICE_SHORTCUTS = [
  { href: '/almanya-vizesi', label: 'Almanya vizesi' },
  { href: '/almanya-goc', label: 'Almanya göç' },
  { href: '/hizmetler/calisma-vizesi', label: 'Almanya çalışma vizesi' },
  { href: '/hizmetler/mavi-kart-vizesi', label: 'Mavi Kart' },
  { href: '/hizmetler/firsat-karti', label: 'Fırsat Kartı' },
] as const;

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

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Almanya Vize Rehberi',
    description:
      'Almanya vizesi, Almanya çalışma vizesi, Mavi Kart, Fırsat Kartı ve nitelikli göç sonrası işlemler için profesyonel rehberlik.',
    url: 'https://www.almanyavizerehberi.com',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Almanya Vize Rehberi',
      url: 'https://www.almanyavizerehberi.com',
    },
    about: {
      '@type': 'Organization',
      name: 'Almanya Vize Rehberi',
      url: 'https://www.almanyavizerehberi.com',
    },
  };

  return (
    <main id="main" className="public-page bg-surface-main">
      <Script
        id="home-webpage-jsonld"
        type="application/ld+json"
      >
        {JSON.stringify(webPageJsonLd)}
      </Script>
      <div className="home-flow">
        {/* HERO */}
        <section id="home-hero" className="home-flow-section text-surface-main">
          <div className="mx-auto grid min-h-[auto] max-w-[1200px] items-center gap-4 px-4 pb-10 pt-4 md:min-h-[500px] md:grid-cols-[1fr_0.92fr] md:gap-14 md:pt-16 md:pb-20">
            <RevealOnScroll className="order-2 max-w-[620px] md:order-1">
              <h1 className="font-heading text-[2.18rem] font-semibold leading-[1.04] tracking-normal md:text-5xl lg:text-[4rem]">
                {homeSettings.hero.title}
              </h1>
              <p className="mt-3 max-w-[560px] text-base leading-7 text-surface-main/85 md:mt-5 md:text-lg">
                {homeSettings.hero.body}
              </p>
              <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-8 md:gap-4">
                <Link
                  href="/basvuru"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-base to-brand-light px-7 py-3 text-sm font-ui font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-dark/25 transition hover:from-brand-light hover:to-brand-base"
                >
                  {homeSettings.hero.primaryCtaText}
                </Link>
                <Link
                  href="/uygunluk-testi"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-ui font-semibold uppercase tracking-wide text-brand-dark shadow-lg shadow-brand-dark/20 transition hover:bg-surface-soft hover:shadow-brand-dark/25"
                >
                  Vize Uygunluk Testi
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="order-1 md:order-2" delay={0.15}>
              <HeroParallaxImage />
            </RevealOnScroll>
          </div>
        </section>

        <div className="home-section-divider" aria-hidden="true" />

        {/* VİDEO REHBERLER */}
        <section id="home-videos" className="home-flow-section py-20">
          <div className="mx-auto max-w-[1200px] px-4">
            <RevealOnScroll className="text-center">
              <h2 className="text-3xl font-semibold text-surface-main md:text-4xl">
                {homeSettings.videos.title}
              </h2>
              <p className="mt-3 mx-auto max-w-2xl text-base text-surface-main/80 md:text-lg">
                {homeSettings.videos.body}
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="mt-6 md:mt-10">
              <div className="home-panel home-video-panel">
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

        <div className="home-section-divider" aria-hidden="true" />

        {/* HİZMETLERİMİZ - ÖNE ÇIKANLAR */}
        <section
          id="home-services"
          className="home-flow-section home-services-band pt-10 pb-6 md:pt-20 md:pb-10"
        >
          <div className="relative mx-auto max-w-[1200px] px-4">
            <RevealOnScroll className="text-center">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] text-brand-base md:text-sm">
                {homeSettings.services.kicker}
              </p>
              <h2 className="mt-4 font-heading text-3xl font-semibold text-brand-dark md:text-4xl">
                {homeSettings.services.title}
              </h2>
              <p className="mt-4 mx-auto max-w-2xl text-base text-slate-700 md:text-lg">
                {homeSettings.services.body}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {SERVICE_SHORTCUTS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-brand-base hover:text-brand-base"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="mt-6 md:mt-10">
              <div className="home-panel">
                <RevealOnScroll>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-border-subtle bg-surface-main p-5 shadow-soft">
                      <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                        Kapsamımız
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700 md:text-base">
                        <li>Almanya çalışma vizesi</li>
                        <li>Almanya Mavi Kart</li>
                        <li>Almanya Fırsat Kartı</li>
                        <li>Göç sonrası işlemler ve yönlendirme</li>
                        <li>Uygunluk testi ve başvuru ön değerlendirme</li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-border-subtle bg-surface-main p-5 shadow-soft">
                      <p className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                        Kapsam Dışı
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700 md:text-base">
                        <li>Aile birleşimi başvuruları</li>
                        <li>Öğrenci ve dil kursu vizeleri</li>
                        <li>Turistik başvurular</li>
                        <li>Kariyer dışı genel yönlendirmeler</li>
                      </ul>
                    </div>
                  </div>
                </RevealOnScroll>

                <div className="mt-8">
                  <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {featuredVisas.map((visa, index) => (
                      <RevealOnScroll key={visa.slug} delay={0.05 * index}>
                        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-main shadow-soft transition hover:border-brand-base/40 hover:shadow-md">
                          <div className="relative h-44 w-full overflow-hidden">
                            <Image
                              src={visa.image}
                              alt={visa.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="font-heading text-lg font-semibold text-brand-dark md:text-xl">
                              {visa.title}
                            </h3>
                            <p className="mt-2 line-clamp-4 text-[15px] leading-relaxed text-slate-800 md:text-base">
                              {visa.seoDescription}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                              <Link
                                href="/uygunluk-testi"
                                className="text-xs font-ui font-semibold text-brand-base hover:text-brand-light"
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
                      href="/hizmetler"
                      className="inline-flex items-center justify-center rounded-full border border-border-subtle bg-surface-main px-7 py-2.5 text-xs font-ui font-semibold uppercase tracking-wide text-brand-dark shadow-sm hover:border-brand-base hover:text-brand-base hover:shadow-md"
                    >
                      Tüm Vize Hizmetlerini Gör
                    </Link>
                  </RevealOnScroll>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </div>
    </main>
  );
}
