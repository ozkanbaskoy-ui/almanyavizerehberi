import Link from 'next/link';

import { fetchApplications } from '@/lib/admin/applicationsData';
import {
  fetchCrmDocuments,
  formatFileSize,
  getDocumentStatusLabel,
  getDocumentTypeLabel,
} from '@/lib/admin/documentsData';
import { DocumentReviewActions } from '@/components/crm/DocumentReviewActions';
import { DocumentUploadForm } from '@/components/crm/DocumentUploadForm';

export const metadata = {
  title: 'CRM Evrak Kuyruğu',
};

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  requested: 'bg-sky-50 text-sky-700',
  uploaded: 'bg-blue-50 text-blue-700',
  in_review: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  expired: 'bg-slate-100 text-slate-700',
};

export default async function CrmDocumentsPage() {
  const [applications, documents] = await Promise.all([
    fetchApplications(),
    fetchCrmDocuments(),
  ]);
  const waiting = applications.filter(
    (app) =>
      app.status === 'evrak-bekleniyor' || app.status === 'incelemede',
  );
  const applicationById = new Map(applications.map((app) => [app.id, app]));
  const reviewQueue = documents.filter(
    (document) =>
      document.status === 'uploaded' || document.status === 'in_review',
  );
  const approvedCount = documents.filter(
    (document) => document.status === 'approved',
  ).length;
  const rejectedCount = documents.filter(
    (document) => document.status === 'rejected',
  ).length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Evrak Yönetimi
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">
        Evrak Kuyruğu
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
        Dosya bazlı evrakları yükleyin, inceleyin, onaylayın veya eksik/ret
        notu ekleyin. Local testte dosyalar dışarıya gönderilmez.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Toplam Evrak
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {documents.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            İnceleme Kuyruğu
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {reviewQueue.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Onay / Ret
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {approvedCount} / {rejectedCount}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <DocumentUploadForm applications={applications} />

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Evrak Aksiyonu Bekleyen Dosyalar
          </h2>
          <div className="mt-4 space-y-3">
            {waiting.length === 0 ? (
              <p className="text-sm text-slate-500">
                Şu an evrak aksiyonu bekleyen kayıt yok.
              </p>
            ) : (
              waiting.map((app) => {
                const count = documents.filter(
                  (document) => document.applicationId === app.id,
                ).length;

                return (
                  <Link
                    key={app.id}
                    href={`/crm/leads/${app.id}`}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-blue-300 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {app.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {app.visaType} · {app.email}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-700">
                      {count} evrak
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-950">
            Evrak Listesi
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Yüklenen evrakları indirin, durumunu değiştirin ve inceleme notu
            girin.
          </p>
        </div>

        <div className="table-shell border-0 shadow-none">
          <table className="admin-table">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Dosya
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Başvuru
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Tür
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Durum
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Henüz evrak yüklenmedi.
                  </td>
                </tr>
              ) : (
                documents.map((document) => {
                  const app = applicationById.get(document.applicationId);
                  return (
                    <tr key={document.id} className="border-t border-slate-100">
                      <td className="px-3 py-3">
                        <div className="font-semibold text-slate-950">
                          {document.originalFilename}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {formatFileSize(document.sizeBytes)} ·{' '}
                          {new Date(document.createdAt).toLocaleString('tr-TR')} ·{' '}
                          {document.storageProvider}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-700">
                        {app ? (
                          <Link
                            href={`/crm/leads/${app.id}`}
                            className="font-semibold text-brand-base hover:text-brand-light"
                          >
                            {app.fullName}
                          </Link>
                        ) : (
                          document.applicationId
                        )}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-700">
                        {getDocumentTypeLabel(document.documentType)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`status-badge ${
                            STATUS_STYLES[document.status] ??
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {getDocumentStatusLabel(document.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <DocumentReviewActions
                          documentId={document.id}
                          initialStatus={document.status}
                          initialNote={document.note}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
