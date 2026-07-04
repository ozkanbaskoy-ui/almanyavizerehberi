import Link from 'next/link';
import type { Metadata } from 'next';

import { fetchAuditLogs } from '@/lib/admin/auditData';

export const metadata: Metadata = {
  title: 'Audit Log',
};

const SEVERITY_STYLES: Record<string, string> = {
  info: 'bg-sky-50 text-sky-700',
  warning: 'bg-amber-50 text-amber-700',
  critical: 'bg-red-50 text-red-700',
};

export default async function AdminAuditLogsPage() {
  const logs = await fetchAuditLogs();

  return (
    <main className="admin-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="admin-page-title">Audit Log</h1>
          <p className="admin-page-subtitle">
            Admin ve CRM tarafındaki kritik değişiklikleri, başvuru olaylarını
            ve sistem kayıtlarını izleyin. Supabase `audit_logs` tablosu yoksa
            mevcut başvuru zaman tünelleri yedek kayıt olarak gösterilir.
          </p>
        </div>
        <Link href="/crm/leads" className="btn-secondary">
          Lead Kayıtları
        </Link>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Gösterilen Kayıt
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {logs.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Kritik
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            {logs.filter((log) => log.severity === 'critical').length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Uyarı
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {logs.filter((log) => log.severity === 'warning').length}
          </p>
        </div>
      </section>

      <section className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-xs text-slate-500">
          Son {logs.length} işlem listeleniyor.
        </div>
        <div className="table-shell border-0 shadow-none">
          <table className="admin-table">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Tarih
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Aktör
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Modül
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Kayıt
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Mesaj
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Seviye
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Henüz audit kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-t border-slate-100">
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-3 py-2 text-sm font-semibold text-slate-800">
                      {log.actorName}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-mono text-[11px] text-slate-500">
                        {log.module}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">
                        {log.action}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-700">
                      {log.entityId ? (
                        <Link
                          href={`/crm/leads/${log.entityId}`}
                          className="font-semibold text-brand-base hover:text-brand-light"
                        >
                          {log.entityLabel || log.entityId}
                        </Link>
                      ) : (
                        log.entityLabel || '-'
                      )}
                    </td>
                    <td className="max-w-lg px-3 py-2 text-sm text-slate-700">
                      <span className="line-clamp-3 whitespace-pre-line">
                        {log.message}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`status-badge ${
                          SEVERITY_STYLES[log.severity] ??
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
