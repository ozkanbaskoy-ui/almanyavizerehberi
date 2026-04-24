import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { EmbeddedCheckoutForm } from '@/components/odeme/EmbeddedCheckoutForm';
import {
  FIXED_PAYMENT_OPTIONS,
  getFixedPaymentOption,
} from '@/lib/payments/fixedPayments';

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export function generateStaticParams() {
  return FIXED_PAYMENT_OPTIONS.map((option) => ({ slug: option.slug }));
}

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const option = getFixedPaymentOption(slug);

  return {
    title: option ? option.label : 'Ödeme',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function FixedPaymentPage(props: PageProps) {
  const { slug } = await props.params;
  const option = getFixedPaymentOption(slug);

  if (!option) {
    notFound();
  }

  return (
    <main id="main">
      <section className="bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_42%,_#020617_95%)] py-12 text-surface-main md:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <RevealOnScroll>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light/80 transition hover:text-brand-light"
            >
              AVR Global
            </Link>

            <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              Güvenli Online Ödeme
            </h1>
            <p className="mt-4 text-sm leading-7 text-surface-main/80 md:text-base">
              Ödeme işleminizi bu sayfadan ayrılmadan Stripe altyapısı ile
              güvenli şekilde tamamlayabilirsiniz.
            </p>

            <div className="mt-6 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-5 shadow-xl shadow-black/30">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Ödeme tutarı
              </p>
              <p className="mt-2 font-heading text-4xl font-semibold text-brand-light">
                {option.amount.toLocaleString('tr-TR')} EUR
              </p>
              <p className="mt-3 text-sm text-slate-300">
                {option.description}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-xs leading-6 text-emerald-100">
              Kart bilgileriniz AVR Global sunucularında saklanmaz. Ödeme
              alanları Stripe tarafından güvenli olarak sağlanır.
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="lg:pt-2">
            <EmbeddedCheckoutForm paymentSlug={option.slug} />
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
