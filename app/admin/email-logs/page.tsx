import Link from 'next/link';
import type { Metadata } from 'next';

import { fetchEmailLogs } from '@/lib/admin/emailLogsData';

export const metadata: Metadata = {
  title: 'E-posta Logları',
};

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  sent: 'bg-emerald-50 text-emerald-700',
  queued: 'bg-sky-50 text-sky-700',
  failed: 'bg-red-50 text-red-700',
};

export default async function AdminEmailLogsPage() {
  const logs = await fetchEmailLogs();

  return (
    <main className="admin-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="admin-page-title">E-posta Logları</h1>
          <p className="admin-page-subtitle">
            Başvuru, yönetici bildirimi, ödeme ve randevu e-postalarının
            gönderim sonucunu izleyin. Supabase bağlı değilse local geliştirme
            logları gösterilir.
          </p>
        </div>
        <Link href="/admin/settings" className="btn-secondary">
          E-posta Şablonları
        </Link>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Log
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {logs?.length ?? 0}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Başarılı
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {logs?.filter((log) => log.status === 'sent').length ?? 0}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Hatalı
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            {logs?.filter((log) => log.status === 'failed').length ?? 0}
          </p>
        </div>
      </section>

      <section className="panel mt-6 overflow-hidden">
        {!logs ? (
          <div className="p-6">
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              E-posta log kaynağı okunamadı.
            </p>
          </div>
        ) : (
          <div className="table-shell border-0 shadow-none">
            <table className="admin-table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Tarih
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Alıcı
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Şablon
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Konu
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Başvuru
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Durum
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Hata
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Henüz e-posta log kaydı yok.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-t border-slate-100">
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                        {new Date(log.createdAt).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-3 py-2 text-sm font-semibold text-slate-800">
                        {log.recipient}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-500">
                        {log.templateId || '-'}
                      </td>
                      <td className="max-w-xs px-3 py-2 text-sm text-slate-700">
                        <span className="line-clamp-2">{log.subject || '-'}</span>
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {log.applicationId ? (
                          <Link
                            href={`/crm/leads/${log.applicationId}`}
                            className="font-semibold text-brand-base hover:text-brand-light"
                          >
                            CRM Aç
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`status-badge ${
                            STATUS_STYLES[log.status] ??
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="max-w-sm px-3 py-2 text-xs text-red-700">
                        {log.errorMessage || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
