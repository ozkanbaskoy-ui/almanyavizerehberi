import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageBySlug } from '@/lib/content/pages';
import { getSiteSettings } from '@/lib/settings/site';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

const page = getPageBySlug('iletisim');
const site = getSiteSettings();

export const metadata: Metadata = {
  title: page.seoTitle || page.title,
  description: page.seoDescription || '',
};

export default function IletisimPage() {
  const emailHref = site.contactEmail
    ? `mailto:${site.contactEmail}`
    : undefined;
  const phoneClean = site.contactPhone.replace(/\s+/g, '');
  const phoneHref = phoneClean ? `tel:${phoneClean}` : undefined;
  const whatsappClean = site.whatsappNumber.replace(/\s+/g, '');
  const whatsappHref = whatsappClean
    ? `https://wa.me/${whatsappClean.replace('+', '')}`
    : undefined;

  return (
    <main className="bg-surface-main">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_#020617_95%)] py-16 text-surface-main">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80">
              İletişim
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
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
      <section className="bg-surface-soft py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Sol kart: Hemen Ulaşın */}
            <RevealOnScroll>
              <div className="h-full rounded-3xl border border-border-subtle bg-surface-main p-6 shadow-soft md:p-8">
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
              </div>
            </RevealOnScroll>

            {/* Sağ kart: Danışmanlık Talebi */}
            <RevealOnScroll delay={0.05}>
              <div className="h-full rounded-3xl border border-border-subtle bg-surface-main p-6 shadow-soft md:p-8">
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
                    className="block rounded-full bg-brand-base px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-light"
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

