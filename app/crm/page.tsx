import Link from 'next/link';

import { fetchApplications } from '@/lib/admin/applicationsData';

export const metadata = {
  title: 'CRM Genel Bakış',
};

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  yeni: 'Yeni Lead',
  incelemede: 'İncelemede',
  'evrak-bekleniyor': 'Evrak Bekleniyor',
  'odeme-bekleniyor': 'Ödeme Bekleniyor',
  tamamlandi: 'Tamamlandı',
  reddedildi: 'Reddedildi',
};

const PIPELINE = [
  'yeni',
  'incelemede',
  'evrak-bekleniyor',
  'odeme-bekleniyor',
  'tamamlandi',
  'reddedildi',
];

export default async function CrmDashboardPage() {
  const applications = await fetchApplications();
  const today = new Date().toDateString();
  const todaysLeads = applications.filter(
    (app) => new Date(app.createdAt).toDateString() === today,
  ).length;
  const waitingDocuments = applications.filter(
    (app) => app.status === 'evrak-bekleniyor',
  ).length;
  const waitingPayment = applications.filter(
    (app) => app.paymentStatus === 'bekliyor',
  ).length;
  const recent = applications.slice(0, 6);

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
            CRM Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">
            Lead ve dosya operasyonu
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700 md:text-base">
            Web başvuruları, ödeme bekleyen dosyalar, evrak takibi ve sonraki
            görüşmeler için ayrı CRM çalışma alanı.
          </p>
        </div>
        <Link href="/crm/leads" className="btn-primary">
          Lead Havuzunu Aç
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Toplam Lead', value: applications.length },
          { label: 'Bugün Gelen', value: todaysLeads },
          { label: 'Evrak Bekleyen', value: waitingDocuments },
          { label: 'Ödeme Bekleyen', value: waitingPayment },
        ].map((item) => (
          <div key={item.label} className="panel p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Pipeline Durumu
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Lead kayıtlarının operasyon aşamalarına göre dağılımı.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {PIPELINE.map((status) => {
              const count = applications.filter(
                (app) => app.status === status,
              ).length;
              const percent =
                applications.length > 0
                  ? Math.round((count / applications.length) * 100)
                  : 0;

              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="text-slate-500">
                      {count} kayıt
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Son Leadler
          </h2>
          <div className="mt-4 space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-slate-500">
                Henüz lead kaydı yok.
              </p>
            ) : (
              recent.map((app) => (
                <Link
                  key={app.id}
                  href={`/crm/leads/${app.id}`}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">
                      {app.fullName}
                    </p>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                      {STATUS_LABELS[app.status] ?? app.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {app.email} · {app.visaType}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
