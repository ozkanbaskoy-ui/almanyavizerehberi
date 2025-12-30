import Link from 'next/link';

import type { ServiceContent } from '@/lib/content/services';
import { getAllServices } from '@/lib/content/services';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { Breadcrumb } from '@/components/common/Breadcrumb';

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
    <main className="bg-surface-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_#020617_95%)] py-12 text-surface-main">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll>
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/index.php' },
                {
                  label: 'Göç Sonrası Hizmetlerimiz',
                  href: '/servisler.php?l=1',
                },
                { label: service.title },
              ]}
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 font-heading md:text-sm">
              Göç Sonrası Hizmet
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {service.title}
            </h1>
            {service.seoDescription && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-surface-main/80 md:text-base">
                {service.seoDescription}
              </p>
            )}
          </RevealOnScroll>
        </div>
      </section>

      {/* Icerik + sag menu */}
      <section className="bg-surface-soft py-12">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1.2fr)]">
            {/* Sol: detay icerigi */}
            <RevealOnScroll>
              <article className="rounded-3xl border border-border-subtle bg-surface-main p-6 text-sm leading-relaxed text-slate-800 shadow-soft md:p-8 md:text-base">
                <div
                  className="prose prose-slate max-w-none prose-h2:text-brand-dark prose-h3:text-brand-dark prose-strong:text-brand-dark"
                  dangerouslySetInnerHTML={{ __html: service.bodyHtml }}
                />
              </article>
            </RevealOnScroll>

            {/* Sag: hizmet listesi + CTA */}
            <div className="space-y-6">
              <RevealOnScroll delay={0.05}>
                <aside className="rounded-3xl border border-border-subtle bg-surface-main p-5 shadow-soft">
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
                              'block rounded-full px-4 py-2 transition',
                              active
                                ? 'bg-brand-base text-white shadow-sm'
                                : 'bg-surface-soft text-slate-800 hover:bg-surface-softer',
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
                <aside className="rounded-3xl border border-border-subtle bg-surface-main p-5 shadow-soft">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Detaylı Bilgi ve Başvuru
                  </h2>
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/basvuru.php"
                      className="block rounded-full bg-brand-base px-4 py-2 text-center text-xs font-ui font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-light"
                    >
                      Başvuru Yapın
                    </Link>
                    <Link
                      href="/iletisim.php"
                      className="block rounded-full border border-border-subtle bg-surface-soft px-4 py-2 text-center text-xs font-ui font-semibold uppercase tracking-wide text-brand-dark transition hover:border-brand-base hover:text-brand-base"
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


