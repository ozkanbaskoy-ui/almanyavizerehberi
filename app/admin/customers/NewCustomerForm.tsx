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

    if (!fullName || !email || !username || !password) {
      setError('Lütfen gerekli alanları doldurun.');
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
          json.error || 'Müşteri oluşturulurken bir hata oluştu.',
        );
      }

      setSuccess(
        json.storage === 'local'
          ? 'Müşteri lokal geliştirme deposuna kaydedildi.'
          : 'Müşteri oluşturuldu.',
      );
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
          : 'Müşteri oluşturulurken bir hata oluştu.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="panel mt-4 space-y-4 p-4"
    >
      <h2 className="text-sm font-semibold text-slate-900">
        Yeni Müşteri Oluştur
      </h2>
      <p className="text-xs text-slate-500">
        Burada oluşturulan müşteri, kendi giriş sayfasından kullanıcı adı /
        şifre ile giriş yapıp kendisine özel Stripe ödeme linkini görür.
      </p>

      {!supabaseConfigured && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Supabase ortam değişkenleri tanımlı değil. Bu ortamda kayıtlar
          lokal geliştirme deposuna yazılır; canlı kullanım için{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{' '}
          ve{' '}
          <code className="rounded bg-amber-100 px-1 py-0.5">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{' '}
          değerleri tanımlanmalıdır.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">
            Ad Soyad
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label">
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label">
            Geçici Şifre
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Örn. Almanya2026!"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Bu şifreyi müşterinizle paylaşmanız gerekir.
          </p>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">
          Stripe Payment Link (opsiyonel)
        </label>
        <input
          type="url"
          value={stripeLink}
          onChange={(e) => setStripeLink(e.target.value)}
          className="form-input"
          placeholder="https://buy.stripe.com/..."
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Stripe panelinizde her müşteri için bir Payment Link oluşturup bu
          alana yapıştırabilirsiniz.
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
          className="btn-primary"
        >
          {submitting ? 'Kaydediliyor...' : 'Müşteri Oluştur'}
        </button>
      </div>
    </form>
  );
}
