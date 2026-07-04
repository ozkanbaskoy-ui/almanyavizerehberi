import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { getVisaBySlug } from '@/lib/content/visas';
import { buildMetadata } from '@/lib/seo/metadata';

const SITE_URL = 'https://www.almanyavizerehberi.com';

const coreVisaSlugs = [
  'calisma-vizesi',
  'mavi-kart-vizesi',
  'firsat-karti',
] as const;

export const metadata: Metadata = buildMetadata({
  title: 'Almanya Vize Hizmetleri',
  description:
    'Almanya çalışma vizesi, Mavi Kart ve Fırsat Kartı için odaklı rehber ve başvuru desteği.',
  path: '/hizmetler',
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
      name: 'Almanya Vize Hizmetleri',
      item: `${SITE_URL}/hizmetler`,
    },
  ],
};

export default function HizmetlerPage() {
  const visas = coreVisaSlugs.map((slug) => getVisaBySlug(slug));

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: visas.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}/hizmetler/${item.slug}`,
    })),
  };

  return (
    <main className="bg-surface-main">
      <Script id="hizmetler-breadcrumb" type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <Script id="hizmetler-itemlist" type="application/ld+json">
        {JSON.stringify(itemListJsonLd)}
      </Script>

      <section className="site-hero py-12">
        <div className="site-container">
          <RevealOnScroll>
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Almanya Vize Hizmetleri' },
              ]}
            />
            <p className="eyebrow-on-dark mt-3 md:text-sm">
              Vize Odak Alanı
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-surface-main md:text-4xl lg:text-5xl">
              Almanya Vize Hizmetleri
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-surface-main/80 md:text-base">
              Çalışma vizesi, Mavi Kart ve Fırsat Kartı için ihtiyaç duyduğunuz
              ana başvuru yollarını tek sayfada görün.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <div className="grid gap-4 md:grid-cols-3">
            {visas.map((item, index) => (
              <RevealOnScroll key={item.slug} delay={index * 0.05}>
                <Link
                  href={`/hizmetler/${item.slug}`}
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vize
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h2>
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
            <div className="panel flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Almanya Göç Rehberi ile devam edin
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Göç sonrası adımlar ve genel yol haritası için ana rehbere
                  geçin.
                </p>
              </div>
              <Link href="/almanya-goc" className="btn-secondary inline-flex">
                Göç Rehberi
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
