import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { getAllBlogPosts } from '@/lib/content/blog';
import { getServiceBySlug } from '@/lib/content/services';
import { getVisaBySlug } from '@/lib/content/visas';
import { buildMetadata } from '@/lib/seo/metadata';

const SITE_URL = 'https://www.almanyavizerehberi.com';

const coreVisaSlugs = [
  'calisma-vizesi',
  'mavi-kart-vizesi',
  'firsat-karti',
] as const;

const coreServiceSlugs = [
  'oturum-izni-basvurusu-ve-yenilenmesi',
  'yabancilar-dairesi-islemleri',
  'calisma-izni',
] as const;

const quickLinks = [
  { href: '/almanya-vizesi', label: 'Almanya Vizesi Rehberi' },
  { href: '/hizmetler', label: 'Vize Hizmetleri' },
  { href: '/servisler', label: 'Göç Sonrası Hizmetler' },
  { href: '/uygunluk-testi', label: 'Uygunluk Testi' },
  { href: '/sss', label: 'S.S.S.' },
];

const LAST_UPDATED = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

export const metadata: Metadata = buildMetadata({
  title: 'Almanya Göç Rehberi',
  description:
    'Almanya vizesi, Almanya çalışma vizesi, Mavi Kart, Fırsat Kartı ve göç sonrası işlemler için tek ve güncel rehber.',
  keywords: [
    'Almanya vizesi',
    'Almanya göç',
    'Almanya çalışma vizesi',
    'çalışma vizesi',
    'Mavi Kart',
    'Fırsat Kartı',
    'Almanya yerleşim rehberi',
  ],
  path: '/almanya-goc',
});

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Ana Sayfa',
      item: `${SITE_URL}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Almanya Göç Rehberi',
      item: `${SITE_URL}/almanya-goc`,
    },
  ],
};

export default function AlmanyaGocPage() {
  const blogPosts = getAllBlogPosts().slice(0, 3);

  const visaCards = coreVisaSlugs.map((slug) => getVisaBySlug(slug));
  const serviceCards = coreServiceSlugs.map((slug) => getServiceBySlug(slug));

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      ...visaCards.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: `${SITE_URL}/hizmetler/${item.slug}`,
      })),
      ...serviceCards.map((item, index) => ({
        '@type': 'ListItem',
        position: visaCards.length + index + 1,
        name: item.title,
        url: `${SITE_URL}/servisler/${item.slug}`,
      })),
    ],
  };

  return (
    <main className="public-page bg-surface-main">
      <Script
        id="almanya-goc-breadcrumb"
        type="application/ld+json"
      >
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <Script id="almanya-goc-itemlist" type="application/ld+json">
        {JSON.stringify(itemListJsonLd)}
      </Script>

      <section className="site-hero py-12">
        <div className="site-container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <RevealOnScroll>
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Almanya Göç Rehberi' },
              ]}
            />
            <p className="eyebrow-on-dark mt-3 md:text-sm">
              Ana Rehber
            </p>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-surface-main md:text-4xl lg:text-5xl">
              Almanya Göç Rehberi
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-surface-main/80 md:text-base">
              Almanya vizesi, çalışma vizesi, Mavi Kart, Fırsat Kartı ve
              yerleşim sürecinde ihtiyaç duyduğunuz resmi adımları tek
              yerden takip edin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/15"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-surface-main/80">
                Son güncelleme: {LAST_UPDATED}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-surface-main/80">
                Resmi kaynaklarla desteklenir
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="overflow-hidden rounded-[10px] border border-white/10 bg-slate-900/50 shadow-2xl shadow-slate-950/30">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/assets/img/hizmet/1.webp"
                  alt="Almanya Göç Rehberi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid gap-px bg-white/10 md:grid-cols-3">
                {[
                  'Çalışma vizesi',
                  'Mavi Kart',
                  'Fırsat Kartı',
                ].map((label) => (
                  <div
                    key={label}
                    className="bg-slate-950/80 px-4 py-3 text-sm font-semibold text-slate-100"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Ana Vize Yolları
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              İş teklifi, nitelikli göç ve puan bazlı başvuru için en önemli
              üç başvuru hattı.
            </p>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {visaCards.map((item, index) => (
              <RevealOnScroll key={item.slug} delay={index * 0.05}>
                <Link
                  href={`/hizmetler/${item.slug}`}
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vize
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.seoDescription}
                  </p>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Göç Sonrası Süreç
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Almanya&apos;ya yerleştikten sonra gereken resmi adımlar için
              pratik rehberler.
            </p>
          </RevealOnScroll>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {serviceCards.map((item, index) => (
              <RevealOnScroll key={item.slug} delay={index * 0.05}>
                <Link
                  href={`/servisler/${item.slug}`}
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Servis
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.seoDescription}
                  </p>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-slate-950">
              Son Rehberler
            </h2>
          </RevealOnScroll>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {blogPosts.map((post, index) => (
              <RevealOnScroll key={post.slug} delay={index * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Blog
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {post.seoDescription}
                  </p>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <RevealOnScroll>
            <div className="panel flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Uygunluk kontrolüyle başlayın
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Hangi yolun size uygun olduğunu hızlıca görün.
                </p>
              </div>
              <Link
                href="/uygunluk-testi"
                className="btn-primary inline-flex self-start md:self-auto"
              >
                Ön Değerlendirme
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
