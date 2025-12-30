'use client';

import { useState } from 'react';

type PaymentOption = {
  id: string;
  label: string;
  amount?: string;
  url?: string; // Eski Payment Link icin opsiyonel fallback
};

type PaymentOptionsProps = {
  options: PaymentOption[];
};

export function PaymentOptions({ options }: PaymentOptionsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!options.length) {
    return null;
  }

  async function handlePay(option: PaymentOption) {
    setError(null);
    setLoadingId(option.id);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId: option.id }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      // Stripe anahtarlari yoksa / hata varsa ve Payment Link tanimliysa fallback
      if (option.url) {
        window.open(option.url, '_blank', 'noopener,noreferrer');
        return;
      }

      setError(
        data.error ||
          'Odeme baslatilirken bir hata olustu. Lutfen daha sonra tekrar deneyin.',
      );
    } catch (err) {
      if (option.url) {
        window.open(option.url, '_blank', 'noopener,noreferrer');
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Odeme baslatilirken bir hata olustu.',
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-2xl border border-red-500/60 bg-red-900/40 px-4 py-2 text-xs text-red-100">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {options.map((opt, index) => (
          <div
            key={opt.id || opt.label + index}
            className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-xl shadow-black/40"
          >
            <h2 className="text-lg font-semibold text-slate-50">
              {opt.label}
            </h2>
            {opt.amount && (
              <p className="mt-1 text-sm font-medium text-brand-light">
                {opt.amount}
              </p>
            )}
            <p className="mt-3 text-xs text-slate-300">
              Bu secenek Stripe uzerinden guvenli odeme icin hazirlanmistir.
              Odeme tutari ve detaylari AVR Global tarafindan Stripe panelinde
              tanimlanir.
            </p>
            <button
              type="button"
              onClick={() => handlePay(opt)}
              disabled={loadingId === opt.id}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-50 shadow-lg shadow-emerald-900/60 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-500 font-ui"
            >
              {loadingId === opt.id
                ? 'Yonlendiriliyor...'
                : 'Stripe ile Odeme Yap'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
