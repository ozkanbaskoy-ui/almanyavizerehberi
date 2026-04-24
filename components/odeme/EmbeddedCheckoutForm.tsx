'use client';

import { useEffect, useState } from 'react';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type EmbeddedCheckoutFormProps = {
  paymentSlug: string;
};

export function EmbeddedCheckoutForm({
  paymentSlug,
}: EmbeddedCheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function createCheckoutSession() {
      setError(null);
      setClientSecret(null);

      try {
        const response = await fetch('/api/stripe/embedded-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentSlug }),
        });

        const data = (await response.json().catch(() => ({}))) as {
          clientSecret?: string;
          error?: string;
        };

        if (!response.ok || !data.clientSecret) {
          throw new Error(
            data.error || 'Ödeme formu başlatılırken bir hata oluştu.',
          );
        }

        if (active) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Ödeme formu başlatılırken bir hata oluştu.',
          );
        }
      }
    }

    createCheckoutSession();

    return () => {
      active = false;
    };
  }, [paymentSlug]);

  if (!publishableKey || !stripePromise) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        Stripe public anahtarı eksik. Vercel ortam değişkenlerine
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY eklenmelidir.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-400/40 bg-red-500/10 p-5 text-sm leading-7 text-red-100 shadow-xl shadow-black/30">
        <p className="font-semibold">Ödeme formu açılamadı.</p>
        <p className="mt-2">{error}</p>
        <p className="mt-3 text-xs text-red-100/80">
          Lütfen daha sonra tekrar deneyin veya AVR Global ekibiyle iletişime
          geçin.
        </p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-8 text-center text-sm text-slate-200 shadow-xl shadow-black/30">
        Güvenli ödeme formu hazırlanıyor...
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <div className="overflow-hidden rounded-3xl bg-white p-1 shadow-2xl shadow-black/40">
        <EmbeddedCheckout />
      </div>
    </EmbeddedCheckoutProvider>
  );
}
