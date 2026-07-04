import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import { getPageBySlug } from '@/lib/content/pages';
import { getSiteSettings } from '@/lib/settings/site';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { buildWhatsAppCommunityLinks } from '@/lib/whatsappCommunity';
import {
  createWhatsAppHref,
  DEFAULT_WHATSAPP_MESSAGE,
} from '@/lib/whatsapp';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo/metadata';

const SITE_URL = 'https://www.almanyavizerehberi.com';
const X_URL = 'https://x.com/VizeRehberi';
const TIKTOK_URL = 'https://www.tiktok.com/@almanyavizerehberi';
const FACEBOOK_URL =
  'https://www.facebook.com/people/Almanya-Vize-Rehberi/61576181364841/';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2.5A9.5 9.5 0 0 0 4.17 17.35L3 21l3.75-1.1A9.5 9.5 0 1 0 12 2.5Zm4.85 13.7c-.2.57-1.16 1.1-1.6 1.16-.42.07-.96.1-1.55-.09-.36-.12-.82-.27-1.42-.52-2.5-1.08-4.12-3.63-4.24-3.8-.12-.17-1.01-1.34-1.01-2.56s.64-1.82.87-2.07c.2-.22.55-.34.89-.34h.64c.2 0 .48-.08.75.58.28.67.96 2.32 1.04 2.48.08.17.13.38.03.59-.1.21-.15.34-.31.52-.15.18-.32.4-.46.53-.15.16-.31.33-.13.65.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.5 1.54.33.16.52.13.72-.08.2-.2.84-.98 1.08-1.31.24-.32.48-.26.8-.15.33.12 2.08.98 2.44 1.16.36.18.6.27.69.42.08.14.08.8-.12 1.37Z"
      />
    </svg>
  );
}

function LinkArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7H17V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getPage() {
  return getPageBySlug('iletisim');
}

export function generateMetadata(): Metadata {
  const page = getPage();

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || '',
    keywords: page.keywords,
    alternates: {
      canonical: `${SITE_URL}/iletisim`,
    },
    openGraph: {
      type: 'website',
      title: page.seoTitle || page.title,
      description: page.seoDescription || '',
      url: `${SITE_URL}/iletisim`,
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE,
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
  const communityLinks = buildWhatsAppCommunityLinks({
    groupUrl: site.whatsappGroupUrl,
    channelUrl: site.whatsappChannelUrl,
  });
  const socialAccounts = [
    {
      label: 'Instagram',
      href: site.instagramUrl,
      meta: '@almanyavizerehberi',
    },
    {
      label: 'X',
      href: X_URL,
      meta: '@VizeRehberi',
    },
    {
      label: 'YouTube',
      href: site.youtubeUrl,
      meta: '@AlmanyaVizeRehberi',
    },
    {
      label: 'TikTok',
      href: TIKTOK_URL,
      meta: '@almanyavizerehberi',
    },
    {
      label: 'Facebook',
      href: FACEBOOK_URL,
      meta: 'Almanya Vize Rehberi',
    },
  ];
  const emailHref = site.contactEmail
    ? `mailto:${site.contactEmail}`
    : undefined;
  const phoneClean = site.contactPhone.replace(/\s+/g, '');
  const phoneHref = phoneClean ? `tel:${phoneClean}` : undefined;
  const whatsappHref = createWhatsAppHref(site.whatsappNumber, {
    message: DEFAULT_WHATSAPP_MESSAGE,
  });
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: page.title,
    description: page.seoDescription,
    url: `${SITE_URL}/iletisim`,
    mainEntity: {
      '@type': 'Organization',
      name: site.siteName,
      url: SITE_URL,
      email: site.contactEmail || undefined,
      telephone: phoneClean,
      sameAs: [
        site.instagramUrl,
        site.youtubeUrl,
        X_URL,
        TIKTOK_URL,
        FACEBOOK_URL,
      ].filter(Boolean),
    },
  };

  return (
    <main className="bg-surface-main">
      <Script id="contact-jsonld" type="application/ld+json">
        {JSON.stringify(contactJsonLd)}
      </Script>
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
                      facebookUrl={FACEBOOK_URL}
                      className="flex items-center gap-3"
                      iconClassName="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-base shadow-sm transition hover:border-brand-base hover:bg-brand-base hover:text-white"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    YouTube, X, TikTok, Facebook ve Instagram hesaplarımızdan
                    güncel içeriklerimizi takip edebilirsiniz.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {socialAccounts.map((account) => (
                      <a
                        key={account.label}
                        href={account.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-brand-base/30 hover:bg-slate-50"
                      >
                        <span className="flex min-w-0 flex-col text-left">
                          <span>{account.label}</span>
                          <span className="truncate text-xs font-normal text-slate-500">
                            {account.meta}
                          </span>
                        </span>
                        <LinkArrowIcon className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ))}
                  </div>
                </div>

                {communityLinks.length > 0 && (
                  <div className="mt-7 border-t border-slate-200 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      WhatsApp Topluluk
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {communityLinks.map((link) => (
                        <a
                          key={`${link.label}-${link.href}`}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`group inline-flex min-h-12 items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                            link.tone === 'emerald'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-300 hover:bg-emerald-100 focus:ring-emerald-500/20'
                              : 'border-sky-200 bg-sky-50 text-sky-950 hover:border-sky-300 hover:bg-sky-100 focus:ring-sky-500/20'
                          }`}
                        >
                          <span className="inline-flex items-center gap-3">
                            <WhatsAppIcon className="h-5 w-5 shrink-0" />
                            <span className="text-left">{link.label}</span>
                          </span>
                          <LinkArrowIcon
                            className={`h-4 w-4 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                              link.tone === 'emerald'
                                ? 'text-emerald-600'
                                : 'text-sky-600'
                            }`}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
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
                  <Link href="/basvuru" className="btn-primary w-full">
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
