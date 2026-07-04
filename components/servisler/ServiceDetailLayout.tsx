import Link from 'next/link';

import type { ServiceContent } from '@/lib/content/services';
import { getAllServices } from '@/lib/content/services';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { ALLOWED_SERVICE_SLUGS } from '@/lib/marketing/topicCatalog';

type ServiceDetailLayoutProps = {
  service: ServiceContent;
};

const SITE_URL = 'https://www.almanyavizerehberi.com';

export function ServiceDetailLayout({ service }: ServiceDetailLayoutProps) {
  const all = getAllServices().filter((item) =>
    ALLOWED_SERVICE_SLUGS.has(item.slug),
  );

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
            <Breadcrumb
              items={[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Almanya Göç Rehberi', href: '/almanya-goc' },
                { label: 'Göç Sonrası Hizmetler', href: '/servisler' },
                { label: service.title },
              ]}
            />
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

      <section className="section-surface py-8 md:py-10">
        <div className="site-container">
          <RevealOnScroll>
            <h2 className="text-lg font-semibold text-slate-950">
              İlgili Bağlantılar
            </h2>
          </RevealOnScroll>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              {
                href: '/almanya-goc',
                label: 'Almanya Göç Rehberi',
                text: 'Ana yol haritası ve genel plan.',
              },
              {
                href: '/servisler',
                label: 'Tüm Göç Sonrası Hizmetler',
                text: 'Oturum, vergi, sigorta ve resmi işlemler.',
              },
              {
                href: '/uygunluk-testi',
                label: 'Ön Değerlendirme',
                text: 'Hangi hizmet yolunun size uygun olduğunu görün.',
              },
            ].map((item, index) => (
              <RevealOnScroll key={item.href} delay={index * 0.05}>
                <Link
                  href={item.href}
                  className="panel block h-full p-5 transition hover:border-brand-base hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kılavuz
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-950">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


