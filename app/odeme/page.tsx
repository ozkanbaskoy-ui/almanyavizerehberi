import type { Metadata } from 'next';

import { getSiteSettings } from '@/lib/settings/site';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { PaymentOptions } from '@/components/odeme/PaymentOptions';

export const metadata: Metadata = {
  title: 'Odeme',
  description: 'Stripe uzerinden guvenli odeme sayfasi',
};

export default function OdemePage() {
  const site = getSiteSettings();

  const options = [
    {
      id: 'payment1',
      label: site.payment1Label,
      amount: site.payment1Amount,
      url: site.payment1Url,
    },
    {
      id: 'payment2',
      label: site.payment2Label,
      amount: site.payment2Amount,
      url: site.payment2Url,
    },
  ].filter((opt) => opt.label && (opt.url || opt.amount));

  return (
    <main id="main">
      <section className="bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_40%,_#020617_95%)] py-16 text-surface-main">
        <div className="mx-auto max-w-[960px] px-4">
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 font-heading md:text-sm">
              Odeme
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              Online Odeme Sayfasi
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-sm text-surface-main/80 md:text-base">
              Stripe uzerinden guvenli sekilde odeme yapabilirsiniz. Asagidaki
              seceneklerden size iletilen odeme linkini secip devam edin.
            </p>
          </RevealOnScroll>

          <RevealOnScroll className="mt-10">
            {options.length === 0 ? (
              <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 px-6 py-8 text-center text-sm text-slate-200 shadow-xl shadow-black/40">
                Henuz aktif bir odeme linki tanimlanmamis. Lutfen AVR Global
                ekibiyle iletisime gecin.
              </div>
            ) : (
              <PaymentOptions options={options} />
            )}
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
