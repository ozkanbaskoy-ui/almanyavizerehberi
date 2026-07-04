import Link from 'next/link';

import type { Visa } from '@/lib/content/visas';
import { getAllVisas } from '@/lib/content/visas';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

type VisaDetailLayoutProps = {
  visa: Visa;
};

const SITE_URL = 'https://www.almanyavizerehberi.com';

export function VisaDetailLayout({ visa }: VisaDetailLayoutProps) {
  const all = getAllVisas();

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
        name: 'Hizmetlerimiz',
        item: `${SITE_URL}/hizmetler.php?l=1`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: visa.title,
        item:
          visa.canonical ||
          `${SITE_URL}/hizmetler/${visa.slug}`,
      },
    ],
  };

  return (
    <main className="compact-content-page bg-surface-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="site-hero">
        <div className="site-container">
          <RevealOnScroll>
            <p className="eyebrow-on-dark mt-3 font-heading md:text-sm">
              Hizmet Detayı
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {visa.title}
            </h1>
            {visa.seoDescription && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-main/80 md:text-base">
                {visa.seoDescription}
              </p>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* İçerik + sağ menü */}
      <section className="section-surface py-8 md:py-10">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1.2fr)]">
            {/* Sol: detay içeriği */}
            <RevealOnScroll>
              <article className="panel p-6 text-sm leading-relaxed text-slate-800 md:p-8 md:text-base">
                <div
                  className="content-prose"
                  dangerouslySetInnerHTML={{ __html: visa.bodyHtml }}
                />
              </article>
            </RevealOnScroll>

            {/* Sağ: hizmet listesi + CTA */}
            <div className="space-y-6">
              <RevealOnScroll delay={0.05}>
                <aside className="panel p-5">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Hizmetlerimiz
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {all.map((item) => {
                      const active = item.slug === visa.slug;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={`/hizmetler/${item.slug}`}
                            className={[
                              'side-nav-link',
                              active
                                ? 'side-nav-link-active'
                                : 'side-nav-link-idle',
                            ].join(' ')}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </aside>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <aside className="panel p-5">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Detaylı Bilgi ve Başvuru
                  </h2>
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/basvuru"
                      className="btn-primary w-full text-xs"
                    >
                      Başvuru Yapın
                    </Link>
                    <Link
                      href="/uygunluk-testi"
                      className="btn-secondary w-full text-xs"
                    >
                      İletişime Geçin
                    </Link>
                  </div>
                </aside>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


