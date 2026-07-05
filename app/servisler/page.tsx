import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { getServiceBySlug } from '@/lib/content/services';
import { buildMetadata } from '@/lib/seo/metadata';

const SITE_URL = 'https://www.almanyavizerehberi.com';

const serviceSlugs = [
  'oturum-izni-basvurusu-ve-yenilenmesi',
  'yabancilar-dairesi-islemleri',
  'calisma-izni',
  'sigorta-ve-sosyal-guvenlik',
  'vergi-islemleri',
  'barinma-ve-emlak-islemleri',
  'hukuki-danismanlik-ve-haklar',
  'kulturel-ve-sosyal-rehberlik',
] as const;

export const metadata: Metadata = buildMetadata({
  title: 'Göç Sonrası Hizmetler',
  description:
    'Oturum, yabancılar dairesi, çalışma izni, vergi, sigorta ve diğer göç sonrası işlemler için rehber.',
  keywords: [
    'Almanya göç sonrası hizmetler',
    'Oturum izni',
    'Yabancılar dairesi',
    'Çalışma izni',
    'Vergi ve sigorta',
  ],
  path: '/servisler',
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
      name: 'Göç Sonrası Hizmetler',
      item: `${SITE_URL}/servisler`,
    },
  ],
};

export default function ServislerPage() {
  const services = serviceSlugs.map((slug) => getServiceBySlug(slug));

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}/servisler/${item.slug}`,
    })),
  };

  return (
    <main className="public-page bg-surface-main">
      <Script id="servisler-breadcrumb" type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <Script id="servisler-itemlist" type="application/ld+json">
        {JSON.stringify(itemListJsonLd)}
      </Script>

      <section className="site-hero py-12">
        <div className="site-container">
          <RevealOnScroll>
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Göç Sonrası Hizmetler' },
              ]}
            />
            <p className="eyebrow-on-dark mt-3 md:text-sm">
              Operasyon Rehberi
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-surface-main md:text-4xl lg:text-5xl">
              Göç Sonrası Hizmetler
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-surface-main/80 md:text-base">
              Almanya&apos;ya yerleştikten sonra oturum, vergi, sigorta,
              barınma ve resmi kurum işlemlerini düzenli şekilde yönetin.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-surface py-12">
        <div className="site-container">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((item, index) => (
              <RevealOnScroll key={item.slug} delay={index * 0.04}>
                <Link
                  href={`/servisler/${item.slug}`}
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Servis
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
                  Hangi yol size uygun?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  İş ve göç planınızı netleştirmek için ön değerlendirme yapın.
                </p>
              </div>
              <Link href="/uygunluk-testi" className="btn-primary inline-flex">
                Ön Değerlendirme
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
