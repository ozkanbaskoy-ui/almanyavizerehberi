import { fetchApplications } from '@/lib/admin/applicationsData';

export const metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboardPage() {
  const apps = await fetchApplications();

  const total = apps.length;
  const completed = apps.filter((a) => a.status === 'tamamlandi').length;
  const pending = apps.filter(
    (a) => a.status === 'yeni' || a.status === 'incelemede',
  ).length;
  const waitingPayment = apps.filter(
    (a) => a.paymentStatus === 'bekliyor',
  ).length;

  const byStatus: Record<string, number> = {};
  for (const app of apps) {
    byStatus[app.status] = (byStatus[app.status] ?? 0) + 1;
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Genel Bakış
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Başvuru trafiğini ve temel metrikleri tek ekranda görün. Supabase
        yapılandırıldıysa bu kutulardaki sayılar gerçek veritabanı
        kayıtlarından gelir; aksi durumda örnek (mock) veriler kullanılır.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Toplam Başvuru
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {total}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Aktif / İncelemede
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {pending}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tamamlanan
          </p>
          <p className="mt-3 text-2xl font-semibold text-emerald-600">
            {completed}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ödeme Bekleyen
          </p>
          <p className="mt-3 text-2xl font-semibold text-amber-600">
            {waitingPayment}
          </p>
        </div>
      </section>

      {/* Durum dağılımı mini grafik */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          Başvuru Durum Dağılımı
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Bu grafik, başvuruların durumlara göre kabaca dağılımını gösterir.
        </p>
        <div className="mt-4 flex items-end gap-3">
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="flex flex-1 flex-col items-center">
              <div className="flex h-24 w-full items-end rounded-md bg-slate-50">
                <div
                  className="w-full rounded-md bg-brand-base"
                  style={{
                    height:
                      total > 0
                        ? `${Math.max(8, (count / total) * 100)}%`
                        : '0%',
                  }}
                />
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-800">
                {count}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
