'use client';

import { useState } from 'react';
import HCaptcha from 'react-hcaptcha';

const VISA_OPTIONS = [
  { value: 'calisma-vizesi', label: 'Çalışma Vizesi' },
  { value: 'mavi-kart-vizesi', label: 'Mavi Kart Vizesi' },
  { value: 'firsat-karti', label: 'Fırsat Kartı' },
  { value: 'mesleki-egitim-vizesi', label: 'Mesleki Eğitim Vizesi' },
  { value: 'aile-birlesimi-vizesi', label: 'Aile Birleşimi Vizesi' },
  { value: 'yuksekogrenim-vizesi', label: 'Yükseköğrenim Vizesi' },
  { value: 'dil-kursu-vizesi', label: 'Dil Kursu Vizesi' },
];

const HCAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? '';

export function BasvuruForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visaType, setVisaType] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          visaType,
          source: 'web-form',
          captchaToken,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { error?: string; ok?: boolean }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error ??
            'Başvuru kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        );
      }

      setSuccess(
        'Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
      );
      setFullName('');
      setEmail('');
      setPhone('');
      setVisaType('');
      setCaptchaToken(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-12 rounded-3xl border border-border-subtle bg-surface-main p-6 shadow-soft md:p-8">
      <h2 className="text-xl font-semibold text-brand-dark md:text-2xl">
        Hızlı Başvuru Formu
      </h2>
      <p className="mt-2 text-sm text-slate-700">
        Takvimden randevu almak istemiyorsanız, aşağıdaki formu doldurarak da
        başvurunuzu iletebilirsiniz. Uzmanlarımız en kısa sürede dönüş yapar.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ad Soyad
          </label>
          <input
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            E-posta
          </label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Telefon
          </label>
          <input
            type="tel"
            required
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vize Türü
          </label>
          <select
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
          >
            <option value="">Seçiniz (opsiyonel)</option>
            {VISA_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {HCAPTCHA_SITE_KEY && (
          <div className="md:col-span-2">
            <HCaptcha
              sitekey={HCAPTCHA_SITE_KEY}
              onVerify={(token: string) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Güvenlik için robot doğrulamasını tamamlayın.
            </p>
          </div>
        )}

        <div className="md:col-span-2 flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-base px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-light disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Gönderiliyor…' : 'Başvuruyu Gönder'}
          </button>
          {success && (
            <p className="text-sm text-emerald-600">{success}</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>
    </section>
  );
}
