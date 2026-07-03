import type { Metadata } from 'next';

import { CalendlyConsentGate } from '@/components/basvuru/CalendlyConsentGate';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { getSiteSettings } from '@/lib/settings/site';

export const metadata: Metadata = {
  title: 'Almanya Vize Danışmanlığı Randevu Başvurusu',
  description:
    'Almanya vize ve göç danışmanlığı için online ön görüşme randevunuzu seçin.',
};

export default function BasvuruPage() {
  const site = getSiteSettings();

  return (
    <main id="main">
      <section className="site-hero">
        <div className="site-container">
          <RevealOnScroll className="mx-auto max-w-3xl text-center">
            <p className="eyebrow-on-dark font-heading md:text-sm">
              Online Randevu
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Almanya vize danışmanlığı için randevunuzu seçin
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-surface-main/80 md:text-base">
              Uygun görüşme saatini seçin, danışmanlık ve hizmet şartlarını
              onayladıktan sonra randevu akışını tamamlayın.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-12 md:py-14">
        <div className="site-container">
          <RevealOnScroll className="mx-auto max-w-5xl text-center">
            <div className="panel p-5 text-center md:p-7">
              <div className="text-center">
                <p className="inline-flex rounded-full border border-brand-base/15 bg-brand-base/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-base">
                  Randevu
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-brand-dark md:text-3xl">
                  Ön görüşme için uygun zamanı seçin
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                  Takvimden size uygun görüşme saatini seçebilirsiniz. Randevu
                  almadan önce hizmet şartlarını onaylamanız gerekir.
                </p>
              </div>
              <CalendlyConsentGate url={site.calendlyUrl} />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
