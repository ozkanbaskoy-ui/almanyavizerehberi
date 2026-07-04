import Link from 'next/link';

import type { ServiceContent } from '@/lib/content/services';
import { getAllServices } from '@/lib/content/services';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

type ServiceDetailLayoutProps = {
  service: ServiceContent;
};

const SITE_URL = 'https://www.almanyavizerehberi.com';

export function ServiceDetailLayout({ service }: ServiceDetailLayoutProps) {
  const all = getAllServices();

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
        name: 'Göç Sonrası Hizmetlerimiz',
        item: `${SITE_URL}/servisler.php?l=1`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item:
          service.canonical ||
          `${SITE_URL}/servisler/${service.slug}`,
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
              Göç Sonrası Hizmet
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {service.title}
            </h1>
            {service.seoDescription && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-main/80 md:text-base">
                {service.seoDescription}
              </p>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* Icerik + sag menu */}
      <section className="section-surface py-8 md:py-10">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1.2fr)]">
            {/* Sol: detay icerigi */}
            <RevealOnScroll>
              <article className="panel p-6 text-sm leading-relaxed text-slate-800 md:p-8 md:text-base">
                <div
                  className="content-prose"
                  dangerouslySetInnerHTML={{ __html: service.bodyHtml }}
                />
              </article>
            </RevealOnScroll>

            {/* Sag: hizmet listesi + CTA */}
            <div className="space-y-6">
              <RevealOnScroll delay={0.05}>
                <aside className="panel p-5">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Göç Sonrası Hizmetlerimiz
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {all.map((item) => {
                      const active = item.slug === service.slug;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={`/servisler/${item.slug}`}
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


