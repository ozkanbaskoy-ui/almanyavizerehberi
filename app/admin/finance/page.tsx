import {
  fetchPaymentStats,
  fetchRecentPayments,
} from '@/lib/admin/paymentsData';
import { fetchUpcomingAppointments } from '@/lib/admin/appointmentsData';
import { getSiteSettings } from '@/lib/settings/site';

export const metadata = {
  title: 'Finans & Randevu',
};

export default async function AdminFinancePage() {
  const site = getSiteSettings();
  const [paymentStats, recentPayments, upcomingAppointments] =
    await Promise.all([
      fetchPaymentStats(),
      fetchRecentPayments(),
      fetchUpcomingAppointments(),
    ]);

  const stripeConfigured = paymentStats !== null;
  const calendarSyncConfigured = upcomingAppointments !== null;
  const googleCalendarReady = Boolean(site.calendlyUrl);

  return (
    <main className="admin-page">
      <h1 className="admin-page-title">
        Finans &amp; Randevu
      </h1>
      <p className="admin-page-subtitle">
        Stripe üzerinden gelen ödemeleri ve Google Calendar randevu akışını tek
        ekranda takip edin. Normal ödeme sayfası aktif kalır; bu paneldeki
        geçmiş listeler kalıcı veritabanı bağlantısı varsa otomatik dolar.
      </p>

      {/* Ödeme istatistikleri */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Toplam Ciro (Stripe)
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {stripeConfigured
              ? `${(paymentStats!.totalRevenue / 100).toFixed(2)} €`
              : '-'}
          </p>
          {!stripeConfigured && (
            <p className="mt-2 text-xs text-slate-500">
              Stripe checkout anahtarları ödeme sayfası için kullanılır. Bu
              kartta otomatik ödeme geçmişi için webhook ve kalıcı ödeme tablosu
              gerekir.
            </p>
          )}
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Son 30 Gün Cirosu
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {stripeConfigured
              ? `${(paymentStats!.last30DaysRevenue / 100).toFixed(2)} €`
              : '-'}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ödeme Sayısı
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {stripeConfigured ? paymentStats!.paymentsCount : '-'}
          </p>
        </div>
      </section>

      {/* Son ödemeler tablosu */}
      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="panel p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Son Stripe Ödemeleri
            </h2>
            {!stripeConfigured && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                Pasif
              </span>
            )}
          </div>
          {stripeConfigured && recentPayments && recentPayments.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-2 py-1 text-left font-semibold text-slate-700">
                      Tarih
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-slate-700">
                      Müşteri
                    </th>
                    <th className="px-2 py-1 text-right font-semibold text-slate-700">
                      Tutar
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-slate-700">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-2 py-1 text-slate-700">
                        {new Date(p.createdAt).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-2 py-1 text-slate-700">
                        {p.customerEmail ?? '-'}
                      </td>
                      <td className="px-2 py-1 text-right text-slate-900">
                        {(p.amount / 100).toFixed(2)}{' '}
                        {p.currency.toUpperCase()}
                      </td>
                      <td className="px-2 py-1 text-slate-700">
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-500">
              Henüz kaydedilmiş bir Stripe ödemesi bulunamadı. Ödeme sayfası
              normal çalışmaya devam eder; admin finans geçmişini otomatik
              doldurmak için Stripe panelinde webhook adresini{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                /api/stripe/webhook
              </code>{' '}
              olarak tanımladıktan ve Supabase&apos;te{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                supabase/payments.sql
              </code>{' '}
              scriptini çalıştırdıktan sonra bu tablo otomatik dolar.
            </p>
          )}
        </div>

        {/* Yaklaşan randevular */}
        <div className="panel p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Google Calendar Randevuları
            </h2>
            {!googleCalendarReady && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                Pasif
              </span>
            )}
          </div>
          {calendarSyncConfigured &&
          upcomingAppointments &&
          upcomingAppointments.length > 0 ? (
            <ul className="mt-4 space-y-2 text-xs">
              {upcomingAppointments.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <p className="font-semibold text-slate-900">
                    {a.inviteeName ?? 'Bilinmeyen davetli'}
                  </p>
                  <p className="text-slate-600">
                    {new Date(a.scheduledAt).toLocaleString('tr-TR')}
                  </p>
                  <p className="text-slate-500">
                    {a.eventType ?? 'Randevu'} •{' '}
                    {a.inviteeEmail ?? 'E-posta yok'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 space-y-3 text-xs text-slate-500">
              <p>
                Google Calendar randevu linki başvuru sayfasında aktif. Google
                Calendar kendi ekranında randevuları yönetir; CRM içinde liste
                tutulması istenirse randevular Supabase tablosuna ayrıca
                senkronlanır.
              </p>
              {googleCalendarReady && (
                <a
                  href={site.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary inline-flex text-xs"
                >
                  Google Calendar Randevu Sayfasını Aç
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
