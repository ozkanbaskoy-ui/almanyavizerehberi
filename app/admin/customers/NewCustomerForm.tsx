'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  supabaseConfigured: boolean;
};

export function NewCustomerForm({ supabaseConfigured }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stripeLink, setStripeLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!supabaseConfigured) {
      setError('Supabase ayarlari yapilmadan musteri olusturamazsiniz.');
      return;
    }

    if (!fullName || !email || !username || !password) {
      setError('Lutfen gerekli alanlari doldurun.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
          stripePaymentLinkUrl: stripeLink || undefined,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(
          json.error || 'Musteri olusturulurken bir hata olustu.',
        );
      }

      setSuccess('Musteri olusturuldu.');
      setFullName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setStripeLink('');

      // Listeyi tazele
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Musteri olusturulurken bir hata olustu.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-900">
        Yeni Musteri Olustur
      </h2>
      <p className="text-xs text-slate-500">
        Burada olusturulan musteri, kendi giris sayfasindan kullanici adi /
        sifre ile giris yapip kendisine ozel Stripe odeme linkini gorecek.
      </p>

      {!supabaseConfigured && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Supabase ortam degiskenleri tanimli degil. Oncelikle{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{' '}
          ve{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{' '}
          degerlerini .env.local dosyanizda ayarlayin ve{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5">
            supabase/customers.sql
          </code>{' '}
          scriptini Supabase uzerinde calistirin.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Ad Soyad
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-base focus:outline-none focus:ring-1 focus:ring-brand-base"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-base focus:outline-none focus:ring-1 focus:ring-brand-base"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Kullanici Adi
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-base focus:outline-none focus:ring-1 focus:ring-brand-base"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Gecici Sifre
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-base focus:outline-none focus:ring-1 focus:ring-brand-base"
            placeholder="Orn: Almanya2025!"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Bu sifreyi musterinizle paylasmaniz gerekir. Musteri panelinden
            sifre degistirme ozelligi ileride eklenebilir.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700">
          Stripe Payment Link (opsiyonel)
        </label>
        <input
          type="url"
          value={stripeLink}
          onChange={(e) => setStripeLink(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-base focus:outline-none focus:ring-1 focus:ring-brand-base"
          placeholder="https://buy.stripe.com/..."
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Stripe panelinizde her musteri icin bir Payment Link olusturup bu
          alana yapistirabilirsiniz.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-full bg-brand-base px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? 'Kaydediliyor...' : 'Musteri Olustur'}
        </button>
      </div>
    </form>
  );
}

