'use client';

import { useCallback } from 'react';
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
  const fetchClientSecret = useCallback(async () => {
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
        data.error || 'Odeme formu baslatilirken bir hata olustu.',
      );
    }

    return data.clientSecret;
  }, [paymentSlug]);

  if (!publishableKey || !stripePromise) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        Stripe public anahtari eksik. Vercel ortam degiskenlerine
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY eklenmelidir.
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <div className="overflow-hidden rounded-3xl bg-white p-1 shadow-2xl shadow-black/40">
        <EmbeddedCheckout />
      </div>
    </EmbeddedCheckoutProvider>
  );
}
