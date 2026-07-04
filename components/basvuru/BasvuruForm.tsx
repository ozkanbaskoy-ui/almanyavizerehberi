'use client';

import { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const VISA_OPTIONS = [
  { value: 'calisma-vizesi', label: 'Çalışma Vizesi' },
  { value: 'mavi-kart-vizesi', label: 'Mavi Kart Vizesi' },
  { value: 'firsat-karti', label: 'Fırsat Kartı' },
  { value: 'mesleki-egitim-vizesi', label: 'Mesleki Eğitim Vizesi' },
  { value: 'aile-birlesimi-vizesi', label: 'Aile Birleşimi Vizesi' },
  { value: 'yuksekogrenim-vizesi', label: 'Yükseköğrenim Vizesi' },
  { value: 'dil-kursu-vizesi', label: 'Dil Kursu Vizesi' },
];

const CONTACT_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Telefon' },
  { value: 'email', label: 'E-posta' },
];

const URGENCY_OPTIONS = [
  { value: 'hemen', label: 'Hemen başlamak istiyorum' },
  { value: '1-3-ay', label: '1-3 ay içinde planlıyorum' },
  { value: '3-6-ay', label: '3-6 ay içinde planlıyorum' },
  { value: 'arastirma', label: 'Şimdilik araştırıyorum' },
];

const EDUCATION_OPTIONS = [
  { value: '', label: 'Seçiniz' },
  { value: 'high-school', label: 'Lise' },
  { value: 'vocational', label: 'Mesleki eğitim' },
  { value: 'associate', label: 'Ön lisans' },
  { value: 'bachelor', label: 'Lisans' },
  { value: 'master', label: 'Yüksek lisans' },
  { value: 'phd', label: 'Doktora' },
];

const HCAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? '';

type BasvuruFormProps = {
  title?: string;
  description?: string;
  source?: string;
  defaultVisaType?: string;
  defaultMessage?: string;
  submitLabel?: string;
  fitResult?: {
    routeTitle: string;
    score: number;
    temperature: string;
  };
  onSuccess?: (applicationId?: string) => void;
};

export function BasvuruForm({
  title = 'Vize süreciniz için sizi arayalım',
  description = 'Bilgilerinizi bırakın; uygun vize türü, eksik belgeler ve ilk adımlar için ekibimiz sizinle iletişime geçsin.',
  source = 'lead-form',
  defaultVisaType = '',
  defaultMessage = '',
  submitLabel = 'Ön Değerlendirme İste',
  fitResult,
  onSuccess,
}: BasvuruFormProps = {}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [visaType, setVisaType] = useState<string>(defaultVisaType);
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [urgency, setUrgency] = useState('');
  const [contactPreference, setContactPreference] = useState('whatsapp');
  const [message, setMessage] = useState(defaultMessage);
  const [consent, setConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!consent) {
      setError(
        'Başvurunuzu göndermek için KVKK aydınlatma metnini kabul etmeniz gerekir.',
      );
      setLoading(false);
      return;
    }

    if (!visaType) {
      setError('Lütfen vize türünü seçin.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            age,
            visaType,
            profession,
            education,
            urgency,
            contactPreference,
            message,
          source,
          captchaToken,
          fitResult,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { error?: string; ok?: boolean; id?: string }
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
      onSuccess?.(data.id);
      setFullName('');
      setEmail('');
      setPhone('');
      setAge('');
      setVisaType(defaultVisaType);
      setProfession('');
      setEducation('');
      setUrgency('');
      setContactPreference('whatsapp');
      setMessage(defaultMessage);
      setConsent(false);
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
    <section className="panel p-5 md:p-7">
      <div className="mx-auto max-w-xl text-center">
        <p className="inline-flex rounded-full border border-brand-base/15 bg-brand-base/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-base">
          Ön Değerlendirme Formu
        </p>
        <h2 className="mt-3 font-heading text-2xl font-semibold text-brand-dark md:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">
            Adınız Soyadınız
          </label>
          <input
            type="text"
            required
            className="form-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">
            E-posta Adresiniz
          </label>
          <input
            type="email"
            required
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">
            Telefon / WhatsApp Numaranız
          </label>
          <input
            type="tel"
            required
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">
            Yaşınız
          </label>
          <input
            type="number"
            min={16}
            max={80}
            required
            className="form-input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Örn. 32"
          />
        </div>
        <div className="form-field">
          <label className="form-label">
            İlgilendiğiniz Vize Türü
          </label>
          <select
            required
            className="form-select"
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
          >
            <option value="">Seçiniz</option>
            {VISA_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">
            Meslek veya bölümünüz
          </label>
          <input
            type="text"
            required
            className="form-input"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="Örn. hemşirelik, yazılım mühendisliği, elektrik"
          />
        </div>
        <div className="form-field">
          <label className="form-label">
            En son eğitim durumunuz
          </label>
          <select
            required
            className="form-select"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          >
            {EDUCATION_OPTIONS.map((option) => (
              <option key={option.value || 'education-default'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">
            Planladığınız Başlangıç Zamanı
          </label>
          <select
            required
            className="form-select"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
          >
            <option value="">Seçiniz</option>
            {URGENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">
            Size Nasıl Ulaşalım?
          </label>
          <select
            className="form-select"
            value={contactPreference}
            onChange={(e) => setContactPreference(e.target.value)}
          >
            {CONTACT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field md:col-span-2">
          <label className="form-label">
            Kısaca Durumunuz
          </label>
          <textarea
            rows={4}
            className="form-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Durumunuzu kısaca anlatabilirsiniz."
          />
        </div>

        <label className="flex items-start gap-2 text-xs leading-5 text-slate-600 md:col-span-2">
          <input
            type="checkbox"
            className="form-check"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            Kişisel verilerimin başvuru değerlendirmesi ve iletişim amacıyla
            işlenmesini kabul ediyorum. KVKK metnini okudum.
          </span>
        </label>

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

        <div className="flex flex-col gap-3 pt-2 md:col-span-2 md:flex-row md:items-center">
          <button
            type="submit"
            className="btn-primary font-ui"
            disabled={loading}
          >
            {loading ? 'Gönderiliyor...' : submitLabel}
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
