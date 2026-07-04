import type { Metadata } from 'next';

import { SystemTestEmailButton } from '@/components/admin/SystemTestEmailButton';
import { getRecipientEmails } from '@/lib/notifications/recipientEmails';
import { getSiteSettings } from '@/lib/settings/site';

export const metadata: Metadata = {
  title: 'Sistem Sağlığı',
};

type Check = {
  label: string;
  state: 'ready' | 'local' | 'optional' | 'attention';
  status: string;
  detail: string;
};

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}

export default function AdminSystemPage() {
  const site = getSiteSettings();
  const leadRecipients = getRecipientEmails(undefined, [
    process.env.LEAD_NOTIFY_EMAIL,
  ]);
  const supabaseReady =
    hasEnv('NEXT_PUBLIC_SUPABASE_URL') &&
    hasEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') &&
    hasEnv('SUPABASE_SERVICE_ROLE_KEY');
  const smtpReady =
    hasEnv('SMTP_HOST') &&
    hasEnv('SMTP_PORT') &&
    hasEnv('SMTP_USER') &&
    hasEnv('SMTP_PASS');

  const checks: Check[] = [
    {
      label: 'CRM veri modu',
      state: supabaseReady ? 'ready' : 'local',
      status: supabaseReady ? 'Supabase hazır' : 'Local mod',
      detail: supabaseReady
        ? 'CRM kayıtları Supabase üzerinde kalıcı olarak tutulabilir.'
        : 'Supabase anahtarları yokken admin/CRM local geliştirme deposuyla çalışır.',
    },
    {
      label: 'Admin şifresi',
      state: hasEnv('ADMIN_PASSWORD') ? 'ready' : 'attention',
      status: hasEnv('ADMIN_PASSWORD') ? 'Hazır' : 'Eksik',
      detail: 'Admin paneli giriş koruması için kullanılır.',
    },
    {
      label: 'SMTP gönderimi',
      state: smtpReady ? 'ready' : 'attention',
      status: smtpReady ? 'Hazır' : 'Eksik',
      detail: 'Başvuru, OTP ve test e-postaları için Hostinger SMTP ayarları.',
    },
    {
      label: 'Lead bildirim adresi',
      state: leadRecipients.length > 0
        ? 'ready'
        : 'attention',
      status: leadRecipients.length > 0
        ? 'Hazır'
        : 'Eksik',
      detail: 'Yeni başvuruda yöneticilere e-posta gitmesi için kullanılır.',
    },
    {
      label: 'Stripe checkout',
      state:
        hasEnv('STRIPE_SECRET_KEY') &&
        hasEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
          ? 'ready'
          : 'attention',
      status:
        hasEnv('STRIPE_SECRET_KEY') &&
        hasEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
          ? 'Hazır'
          : 'Eksik',
      detail: 'Normal ödeme sayfası ve checkout oluşturma akışı için gerekli.',
    },
    {
      label: 'Stripe webhook',
      state: hasEnv('STRIPE_WEBHOOK_SECRET') ? 'ready' : 'optional',
      status: hasEnv('STRIPE_WEBHOOK_SECRET') ? 'Hazır' : 'Opsiyonel',
      detail:
        'Ödeme sayfası çalışır. Admin finans panelinde otomatik ödeme geçmişi istenirse eklenir.',
    },
    {
      label: 'Google Calendar',
      state: site.calendlyUrl ? 'ready' : 'attention',
      status: site.calendlyUrl ? 'Hazır' : 'Eksik',
      detail:
        'Başvuru sayfasındaki randevu alma bölümü Google Calendar randevu linkini kullanır.',
    },
    {
      label: 'hCaptcha secret',
      state: hasEnv('HCAPTCHA_SECRET_KEY') ? 'ready' : 'optional',
      status: hasEnv('HCAPTCHA_SECRET_KEY') ? 'Hazır' : 'Opsiyonel',
      detail: 'Public form spam koruması için önerilir; local test için zorunlu değildir.',
    },
  ];

  const readyCount = checks.filter((check) => check.state === 'ready').length;
  const attentionCount = checks.filter(
    (check) => check.state === 'attention',
  ).length;

  const statusStyles: Record<Check['state'], string> = {
    ready: 'bg-emerald-50 text-emerald-700',
    local: 'bg-blue-50 text-blue-700',
    optional: 'bg-slate-100 text-slate-700',
    attention: 'bg-amber-50 text-amber-700',
  };

  return (
    <main className="admin-page">
      <h1 className="admin-page-title">Sistem Sağlığı</h1>
      <p className="admin-page-subtitle">
        Admin, CRM, ödeme, e-posta ve güvenlik entegrasyonlarının ortam
        değişkeni seviyesindeki durumunu kontrol edin.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Kontrol
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {checks.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Hazır
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {readyCount}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Dikkat
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {attentionCount}
          </p>
        </div>
      </section>

      <section className="panel mt-6 p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Entegrasyon Kontrolleri
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {checks.map((check) => (
            <div
              key={check.label}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{check.label}</p>
                <span
                  className={`status-badge ${statusStyles[check.state]}`}
                >
                  {check.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {check.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel mt-6 p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Canlı Kontrol
        </h2>
        <div className="mt-4">
          <SystemTestEmailButton />
        </div>
      </section>

      <section className="panel mt-6 p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Uygulanacak Veritabanı Dosyası
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          FAZ 2 için hazırlanan kapsamlı Supabase şeması
          `supabase/admin_crm_core.sql` dosyasında. Supabase SQL Editor içinde
          çalıştırıldığında roller, CRM tabloları, audit log ve RLS
          politikaları devreye alınır.
        </p>
      </section>
    </main>
  );
}
