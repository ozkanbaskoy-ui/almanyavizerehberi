import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RevealOnScroll } from '@/components/common/RevealOnScroll';
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

export const metadata: Metadata = {
  title: 'Ödeme Sonucu',
  robots: {
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return FIXED_PAYMENT_OPTIONS.map((option) => ({ slug: option.slug }));
}

export default async function PaymentResultPage(props: PageProps) {
  const { slug } = await props.params;
  const option = getFixedPaymentOption(slug);

  if (!option) {
    notFound();
  }

  return (
    <main id="main">
      <section className="min-h-[70vh] bg-[radial-gradient(circle_at_top,_var(--color-hero-from)_0,_var(--color-hero-to)_42%,_#020617_95%)] py-16 text-surface-main">
        <div className="mx-auto max-w-2xl px-4">
          <RevealOnScroll>
            <div className="rounded-3xl border border-emerald-400/30 bg-slate-950/75 p-6 text-center shadow-2xl shadow-black/50 md:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-300">
                ✓
              </div>
              <h1 className="mt-5 font-heading text-2xl font-semibold md:text-3xl">
                Ödeme işlemi tamamlandı
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {option.amount.toLocaleString('tr-TR')} EUR tutarındaki ödeme
                işleminiz Stripe tarafından işleme alındı. Gerekli kontroller
                sonrası ekibimiz sizinle iletişime geçecektir.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-base px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-red-950/40 transition hover:bg-red-700"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
