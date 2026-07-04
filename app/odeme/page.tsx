import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteSettings } from '@/lib/settings/site';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { PaymentOptions } from '@/components/odeme/PaymentOptions';
import { FIXED_PAYMENT_OPTIONS } from '@/lib/payments/fixedPayments';

export const metadata: Metadata = {
  title: 'Ödeme',
  description: 'Stripe üzerinden güvenli ödeme sayfası',
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
      <section className="site-hero">
        <div className="mx-auto max-w-[960px] px-4">
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-light/80 font-heading md:text-sm">
              Ödeme
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              Online Ödeme Sayfası
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-sm text-surface-main/80 md:text-base">
              Stripe üzerinden güvenli şekilde ödeme yapabilirsiniz. Aşağıdaki
              seçeneklerden size iletilen ödeme linkini seçip devam edin.
            </p>
          </RevealOnScroll>

          <RevealOnScroll className="mt-10">
            <div className="mb-8 grid gap-5 md:grid-cols-2">
              {FIXED_PAYMENT_OPTIONS.map((option) => (
                <Link
                  key={option.slug}
                  href={`/${option.slug}`}
                  className="rounded-2xl border border-emerald-400/25 bg-slate-900/70 p-6 shadow-xl shadow-black/25 transition hover:border-emerald-300/50 hover:bg-slate-900/90"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Site içi ödeme
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-50">
                    {option.amount.toLocaleString('tr-TR')} EUR
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-slate-300">
                    Bu seçenekle ödeme formu siteden ayrılmadan açılır.
                  </p>
                </Link>
              ))}
            </div>

            {options.length === 0 ? (
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-6 py-8 text-center text-sm text-slate-200 shadow-xl shadow-black/25">
                Henüz aktif bir ödeme linki tanımlanmamış. Lütfen AVR Global
                ekibiyle iletişime geçin.
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
