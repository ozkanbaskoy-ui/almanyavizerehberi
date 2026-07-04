import { fetchApplications } from '@/lib/admin/applicationsData';

export const metadata = {
  title: 'CRM Raporlar',
};

export default async function CrmReportsPage() {
  const applications = await fetchApplications();
  const paid = applications.filter(
    (app) => app.paymentStatus === 'odendi',
  ).length;
  const conversion =
    applications.length > 0 ? Math.round((paid / applications.length) * 100) : 0;

  const bySource = applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.source] = (acc[app.source] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1280px]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        CRM Raporlama
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">
        Raporlar
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
        Lead kaynakları, ödeme dönüşümü ve operasyon yoğunluğu için temel CRM
        göstergeleri.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Toplam Lead
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {applications.length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ödenen Dosya
          </p>
          <p className="mt-3 text-3xl font-semibold text-emerald-700">
            {paid}
          </p>
        </div>
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ödeme Dönüşümü
          </p>
          <p className="mt-3 text-3xl font-semibold text-blue-700">
            %{conversion}
          </p>
        </div>
      </section>

      <section className="panel mt-6 p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Kaynak Dağılımı
        </h2>
        <div className="mt-4 space-y-3">
          {Object.keys(bySource).length === 0 ? (
            <p className="text-sm text-slate-500">Henüz kaynak verisi yok.</p>
          ) : (
            Object.entries(bySource).map(([source, count]) => (
              <div key={source}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">
                    {source}
                  </span>
                  <span className="text-slate-500">{count} lead</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${
                        applications.length > 0
                          ? Math.round((count / applications.length) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
