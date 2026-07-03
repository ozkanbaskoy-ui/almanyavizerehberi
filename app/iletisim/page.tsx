import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageBySlug } from '@/lib/content/pages';
import { getSiteSettings } from '@/lib/settings/site';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { SocialLinks } from '@/components/layout/SocialLinks';
import {
  createWhatsAppHref,
  DEFAULT_WHATSAPP_MESSAGE,
} from '@/lib/whatsapp';

function getPage() {
  return getPageBySlug('iletisim');
}

export function generateMetadata(): Metadata {
  const page = getPage();

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || '',
    alternates: {
      canonical: 'https://www.almanyavizerehberi.com/iletisim',
    },
    openGraph: {
      type: 'website',
      title: page.seoTitle || page.title,
      description: page.seoDescription || '',
      url: 'https://www.almanyavizerehberi.com/iletisim',
      images: [
        {
          url: '/og/default-og.webp',
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
  };
}

export default function IletisimPage() {
  const page = getPage();
  const site = getSiteSettings();
  const emailHref = site.contactEmail
    ? `mailto:${site.contactEmail}`
    : undefined;
  const phoneClean = site.contactPhone.replace(/\s+/g, '');
  const phoneHref = phoneClean ? `tel:${phoneClean}` : undefined;
  const whatsappHref = createWhatsAppHref(site.whatsappNumber, {
    message: DEFAULT_WHATSAPP_MESSAGE,
  });

  return (
    <main className="bg-surface-main">
      {/* Hero */}
      <section className="site-hero">
        <div className="site-container">
          <RevealOnScroll className="max-w-3xl">
            <p className="eyebrow-on-dark font-heading">
              İletişim
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Almanya Vize Rehberi ile İletişime Geçin
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-surface-main/80 md:text-base">
              Almanya&apos;ya göç, çalışma, eğitim ve aile birleşimi
              süreçleriniz hakkında tüm sorularınız için bizimle iletişime
              geçebilirsiniz. Uzman ekibimiz size en kısa sürede dönüş
              yapacaktır.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* İletişim kartları */}
      <section className="section-surface">
        <div className="site-container">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Sol kart: Hemen Ulaşın */}
            <RevealOnScroll>
              <div className="interactive-panel h-full p-6 md:p-8">
                <h2 className="text-lg font-semibold text-brand-dark md:text-xl">
                  Hemen Ulaşın
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-800 md:text-base">
                  Size en uygun iletişim kanalını kullanarak ekibimize
                  ulaşabilirsiniz. Mesajlarınızı dikkatle inceleyip en kısa
                  sürede yanıt veriyoruz.
                </p>

                <dl className="mt-6 space-y-4 text-sm text-slate-800 md:text-base">
                  {emailHref && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        E-posta
                      </dt>
                      <dd>
                        <a
                          href={emailHref}
                          className="text-brand-base hover:text-brand-light"
                        >
                          {site.contactEmail}
                        </a>
                      </dd>
                    </div>
                  )}

                  {phoneHref && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Telefon
                      </dt>
                      <dd>
                        <a
                          href={phoneHref}
                          className="text-brand-base hover:text-brand-light"
                        >
                          {site.contactPhone}
                        </a>
                      </dd>
                    </div>
                  )}

                  {whatsappHref && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        WhatsApp
                      </dt>
                      <dd>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-base hover:text-brand-light"
                        >
                          WhatsApp hattımıza yazın
                        </a>
                      </dd>
                    </div>
                  )}

                  {site.instagramUrl && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Instagram
                      </dt>
                      <dd>
                        <a
                          href={site.instagramUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-base hover:text-brand-light"
                        >
                          @almanyavizerehberi
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-7 border-t border-slate-200 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Sosyal Medya
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <SocialLinks
                      instagramUrl={site.instagramUrl}
                      youtubeUrl={site.youtubeUrl}
                      className="flex items-center gap-3"
                      iconClassName="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-base shadow-sm transition hover:border-brand-base hover:bg-brand-base hover:text-white"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    YouTube, X, TikTok ve Instagram hesaplarımızdan güncel
                    içeriklerimizi takip edebilirsiniz.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Sağ kart: Danışmanlık Talebi */}
            <RevealOnScroll delay={0.05}>
              <div className="interactive-panel h-full p-6 md:p-8">
                <h2 className="text-lg font-semibold text-brand-dark md:text-xl">
                  Danışmanlık Talebi
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-800 md:text-base">
                  Vize ve göç danışmanlığı almak için online başvuru formumuzu
                  doldurabilirsiniz. Uzman ekibimiz dosyanızı inceleyip
                  sizinle iletişime geçecektir.
                </p>
                <div className="mt-6">
                  <Link
                    href="/basvuru.php"
                    className="btn-primary w-full"
                  >
                    Başvuru Formuna Git
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </main>
  );
}
