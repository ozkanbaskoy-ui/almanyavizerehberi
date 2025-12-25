import Link from 'next/link';

import { fetchApplications } from '@/lib/admin/applicationsData';

export const metadata = {
  title: 'Başvurular (CRM)',
};

export default async function AdminApplicationsPage() {
  const apps = await fetchApplications();

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Başvurular (CRM)
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Supabase yapılandırıldıysa formlardan gelen gerçek başvurular burada
        listelenir. Aksi durumda örnek (mock) veriler gösterilir.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                Başvuru ID
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                İsim
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                Vize Türü
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                Durum
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                Ödeme
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                Kaynak
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-700">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr
                key={app.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-3 py-2 font-mono text-xs text-slate-700">
                  {app.id}
                </td>
                <td className="px-3 py-2 text-slate-900">
                  {app.fullName}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {app.visaType}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {app.status}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {app.paymentStatus}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {app.source}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="text-xs font-semibold text-brand-base hover:text-brand-light"
                  >
                    Detay / CRM
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

