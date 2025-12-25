import {
  fetchPaymentStats,
  fetchRecentPayments,
} from '@/lib/admin/paymentsData';
import { fetchUpcomingAppointments } from '@/lib/admin/appointmentsData';

export const metadata = {
  title: 'Finans & Randevu',
};

export default async function AdminFinancePage() {
  const [paymentStats, recentPayments, upcomingAppointments] =
    await Promise.all([
      fetchPaymentStats(),
      fetchRecentPayments(),
      fetchUpcomingAppointments(),
    ]);

  const stripeConfigured = paymentStats !== null;
  const calendlyConfigured = upcomingAppointments !== null;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Finans &amp; Randevu
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Stripe üzerinden gelen ödemeleri ve Calendly randevularını tek
        ekranda takip edin. Supabase, Stripe ve Calendly yapılandırılmadıysa
        aşağıdaki kutularda açıklayıcı uyarılar görünecektir.
      </p>

      {/* Ödeme istatistikleri */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
              STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET ve Supabase tablosu
              (supabase/payments.sql) henüz yapılandırılmamış görünüyor.
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Son 30 Gün Cirosu
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {stripeConfigured
              ? `${(paymentStats!.last30DaysRevenue / 100).toFixed(2)} €`
              : '-'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
              Henüz kaydedilmiş bir Stripe ödemesi bulunamadı veya Stripe /
              Supabase entegrasyonu devre dışı. Stripe panelinizde webhook
              adresini{' '}
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
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Yaklaşan Randevular (Calendly)
            </h2>
            {!calendlyConfigured && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                Pasif
              </span>
            )}
          </div>
          {calendlyConfigured &&
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
            <p className="mt-4 text-xs text-slate-500">
              Yaklaşan randevu bulunamadı veya Calendly entegrasyonu henüz
              aktif değil. Calendly panelinizde webhook adresi olarak{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                /api/calendly/webhook
              </code>{' '}
              tanımlayıp{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                supabase/appointments.sql
              </code>{' '}
              scriptini Supabase üzerinde çalıştırdığınızda bu liste otomatik
              dolacak.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

