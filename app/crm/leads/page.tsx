import Link from 'next/link';

import { fetchApplications } from '@/lib/admin/applicationsData';

export const metadata = {
  title: 'CRM Lead Havuzu',
};

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
  }>;
};

const STATUS_FILTERS = [
  { value: '', label: 'Tüm aşamalar' },
  { value: 'yeni', label: 'Yeni' },
  { value: 'incelemede', label: 'İncelemede' },
  { value: 'evrak-bekleniyor', label: 'Evrak Bekleniyor' },
  { value: 'odeme-bekleniyor', label: 'Ödeme Bekleniyor' },
  { value: 'tamamlandi', label: 'Tamamlandı' },
  { value: 'reddedildi', label: 'Reddedildi' },
];

const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  STATUS_FILTERS.filter((item) => item.value).map((item) => [
    item.value,
    item.label,
  ]),
);

const STATUS_STYLES: Record<string, string> = {
  yeni: 'bg-sky-50 text-sky-700',
  incelemede: 'bg-indigo-50 text-indigo-700',
  'evrak-bekleniyor': 'bg-amber-50 text-amber-700',
  'odeme-bekleniyor': 'bg-orange-50 text-orange-700',
  tamamlandi: 'bg-emerald-50 text-emerald-700',
  reddedildi: 'bg-red-50 text-red-700',
};

const PIPELINE = STATUS_FILTERS.filter((item) => item.value);

export default async function CrmLeadsPage({ searchParams }: PageProps) {
  const applications = await fetchApplications();
  const params = searchParams ? await searchParams : {};
  const q = params.q?.trim().toLowerCase() || '';
  const status = params.status?.trim() || '';

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !q ||
      [app.fullName, app.email, app.phone, app.visaType, app.source, app.id]
        .join(' ')
        .toLowerCase()
        .includes(q);
    const matchesStatus = !status || app.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
            CRM
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Lead Havuzu
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Başvurudan gelen her lead burada operasyon dosyası olarak takip
            edilir. Detay ekranında not, durum ve ödeme güncellemeleri yapılır.
          </p>
        </div>
        <Link href="/admin" className="btn-secondary">
          Admin Paneli
        </Link>
      </div>

      <form
        action="/crm/leads"
        className="panel mt-6 grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_240px_auto]"
      >
        <div className="form-field">
          <label className="form-label">Arama</label>
          <input
            type="search"
            name="q"
            defaultValue={params.q || ''}
            placeholder="İsim, e-posta, telefon, vize türü..."
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Aşama</label>
          <select
            name="status"
            defaultValue={status}
            className="form-select"
          >
            {STATUS_FILTERS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="btn-primary h-11">
            Filtrele
          </button>
          <Link href="/crm/leads" className="btn-ghost h-11">
            Sıfırla
          </Link>
        </div>
      </form>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Pipeline Kanban Özeti
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Frappe CRM yaklaşımına uygun olarak leadler aşama bazında hızlı
              okunur. Tam sürümde bu kolonlar sürükle-bırak çalışacak.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-6">
          {PIPELINE.map((stage) => {
            const items = applications.filter((app) => app.status === stage.value);
            return (
              <div key={stage.value} className="panel min-h-48 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-950">
                    {stage.label}
                  </h3>
                  <span
                    className={`status-badge ${
                      STATUS_STYLES[stage.value] ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {items.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {items.slice(0, 3).map((app) => (
                    <Link
                      key={`${stage.value}-${app.id}`}
                      href={`/crm/leads/${app.id}`}
                      className="block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:border-blue-300"
                    >
                      <span className="block truncate font-semibold text-slate-900">
                        {app.fullName}
                      </span>
                      <span className="mt-1 block truncate text-xs text-slate-500">
                        {app.visaType}
                      </span>
                    </Link>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs font-semibold text-slate-500">
                      +{items.length - 3} kayıt daha
                    </p>
                  )}
                  {items.length === 0 && (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500">
                      Bu aşamada kayıt yok.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-4">
        {filtered.length === 0 ? (
          <div className="panel p-8 text-center text-sm text-slate-500">
            Bu filtrelerle eşleşen lead kaydı bulunamadı.
          </div>
        ) : (
          filtered.map((app) => (
            <Link
              key={app.id}
              href={`/crm/leads/${app.id}`}
              className="panel block p-4 transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_160px_140px] md:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-semibold text-slate-950">
                      {app.fullName}
                    </h2>
                    <span className="font-mono text-[11px] text-slate-400">
                      {app.id}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(app.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>

                <div className="text-sm text-slate-700">
                  <p className="truncate">{app.email}</p>
                  <p className="mt-1 text-xs text-slate-500">{app.phone}</p>
                </div>

                <div>
                  <span
                    className={`status-badge ${
                      STATUS_STYLES[app.status] ??
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {STATUS_LABELS[app.status] ?? app.status}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-700">
                  {app.visaType}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
