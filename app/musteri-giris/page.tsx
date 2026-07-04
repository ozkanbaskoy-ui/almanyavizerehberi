'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MusteriGirisPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier || !password) {
      setError('Lütfen kullanıcı adı (veya e-posta) ve şifre girin.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(
          json.error || 'Giriş yapılırken bir hata oluştu.',
        );
      }

      router.push('/musteri-panel');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Giriş yapılırken bir hata oluştu.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950/95 py-16">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/60">
          <h1 className="text-center text-xl font-semibold text-slate-50">
            Müşteri Girişi
          </h1>
          <p className="mt-2 text-center text-xs text-slate-400">
            Admin tarafından size iletilen kullanıcı adı ve şifre ile giriş
            yapın. Giriş sonrasında size tanımlanan Stripe ödeme linkini
            göreceksiniz.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-200">
                Kullanıcı Adı veya E-posta
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-50 shadow-sm focus:border-brand-base focus:outline-none focus:ring-1 focus:ring-brand-base"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-200">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-50 shadow-sm focus:border-brand-base focus:outline-none focus:ring-1 focus:ring-brand-base"
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center rounded-full bg-brand-base px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md shadow-red-900/40 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-500"
            >
              {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-500">
            Şifrenizi bilmiyorsanız veya hatalı olduğunu düşünüyorsanız
            ekibimizle iletişime geçin.
          </p>
        </div>
      </div>
    </main>
  );
}
