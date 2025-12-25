import type { Metadata } from 'next';

import { getPageBySlug } from '@/lib/content/pages';
import { CalendlyEmbed } from '@/components/basvuru/CalendlyEmbed';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { getSiteSettings } from '@/lib/settings/site';
import { BasvuruForm } from '@/components/basvuru/BasvuruForm';

const page = getPageBySlug('basvuru');
const site = getSiteSettings();

export const metadata: Metadata = {
  title: page.seoTitle || page.title,
  description: page.seoDescription || '',
};

export default function BasvuruPage() {
  return (
    <main id="main">
      <section className="bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_#020617_95%)] py-16 text-surface-main">
        <div className="mx-auto max-w-[1200px] px-4">
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 md:text-sm">
              Online Randevu
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {page.title}
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-sm text-surface-main/80 md:text-base">
              Almanya vize ve göç süreçleriniz için uygun olduğunuz zamanı
              seçin; uzmanlarımız seçtiğiniz saatte çevrim içi olarak sizinle
              olacak.
            </p>
          </RevealOnScroll>

          <RevealOnScroll>
            <CalendlyEmbed url={site.calendlyUrl} />
          </RevealOnScroll>

          <RevealOnScroll className="mt-10">
            <article
              className="prose prose-invert prose-slate/90 mx-auto max-w-3xl text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
            />
          </RevealOnScroll>

          <RevealOnScroll>
            <BasvuruForm />
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}

