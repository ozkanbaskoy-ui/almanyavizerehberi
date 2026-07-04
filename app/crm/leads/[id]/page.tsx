import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ApplicationActions } from '@/components/admin/ApplicationActions';
import { DocumentReviewActions } from '@/components/crm/DocumentReviewActions';
import { DocumentUploadForm } from '@/components/crm/DocumentUploadForm';
import { TaskActions } from '@/components/crm/TaskActions';
import { TaskForm } from '@/components/crm/TaskForm';
import {
  fetchApplicationById,
  fetchApplicationEvents,
} from '@/lib/admin/applicationsData';
import {
  fetchCrmDocuments,
  formatFileSize,
  getDocumentStatusLabel,
  getDocumentTypeLabel,
} from '@/lib/admin/documentsData';
import {
  fetchCrmTasks,
  getTaskPriorityLabel,
  getTaskStatusLabel,
} from '@/lib/admin/tasksData';
import { createWhatsAppHref } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_LABELS: Record<string, string> = {
  yeni: 'Yeni',
  incelemede: 'İncelemede',
  'evrak-bekleniyor': 'Evrak Bekleniyor',
  'odeme-bekleniyor': 'Ödeme Bekleniyor',
  tamamlandi: 'Tamamlandı',
  reddedildi: 'Reddedildi',
};

const PAYMENT_LABELS: Record<string, string> = {
  bekliyor: 'Bekliyor',
  odendi: 'Ödendi',
  'iade-edildi': 'İade Edildi',
};

const DOCUMENT_CHECKLIST = [
  { type: 'passport', label: 'Pasaport' },
  { type: 'photo', label: 'Biyometrik Fotoğraf' },
  { type: 'diploma', label: 'Diploma / Sertifika' },
  { type: 'cv', label: 'CV' },
  { type: 'contract', label: 'İş Sözleşmesi / Kabul Yazısı' },
  { type: 'finance', label: 'Finansal Kanıt' },
];

const NEXT_STEP_BY_STATUS: Record<string, string> = {
  yeni: 'İlk temas kurulacak ve uygun vize rotası teyit edilecek.',
  incelemede: 'Dosya danışmanı evrak listesini netleştirecek.',
  'evrak-bekleniyor': 'Eksik evraklar müşteriden talep edilecek.',
  'odeme-bekleniyor': 'Ödeme ve randevu bilgisi takip edilecek.',
  tamamlandi: 'Dosya kapanış notu ve memnuniyet takibi yapılacak.',
  reddedildi: 'Ret nedeni, itiraz veya yeni başvuru ihtimali değerlendirilecek.',
};

function getDocumentStatus(appStatus: string, index: number) {
  if (appStatus === 'tamamlandi') return 'Onaylandı';
  if (appStatus === 'reddedildi') return 'Arşiv';
  if (appStatus === 'evrak-bekleniyor') return index < 2 ? 'Geldi' : 'Bekleniyor';
  if (appStatus === 'incelemede') return index === 0 ? 'İsteniyor' : 'Planlandı';
  return 'Planlandı';
}

const DOCUMENT_STATUS_STYLES: Record<string, string> = {
  requested: 'bg-sky-50 text-sky-700',
  uploaded: 'bg-blue-50 text-blue-700',
  in_review: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  expired: 'bg-slate-100 text-slate-700',
};

export default async function CrmLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const app = await fetchApplicationById(id);
  if (!app) {
    return notFound();
  }

  const [events, documents, tasks] = await Promise.all([
    fetchApplicationEvents(app.id),
    fetchCrmDocuments({ applicationId: app.id }),
    fetchCrmTasks({ applicationId: app.id }),
  ]);
  const cleanedPhone = app.phone.replace(/\s+/g, '');
  const whatsappHref = createWhatsAppHref(app.phone);
  const openTaskCount = tasks.filter(
    (task) => task.status === 'open' || task.status === 'in_progress',
  ).length;
  const pendingDocumentCount = documents.filter(
    (document) =>
      document.status === 'requested' ||
      document.status === 'uploaded' ||
      document.status === 'in_review',
  ).length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <Link
        href="/crm/leads"
        className="text-xs font-semibold text-blue-700 hover:text-blue-900"
      >
        ← Lead havuzuna dön
      </Link>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
            CRM Dosyası
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            {app.fullName}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {app.visaType} · {app.source} · {app.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`tel:${cleanedPhone}`} className="btn-secondary">
            Ara
          </a>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              WhatsApp
            </a>
          )}
          <a href={`mailto:${app.email}`} className="btn-primary">
            E-posta
          </a>
        </div>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Dosya Aşaması
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {STATUS_LABELS[app.status] ?? app.status}
              </p>
            </div>
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ödeme
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {PAYMENT_LABELS[app.paymentStatus] ?? app.paymentStatus}
              </p>
            </div>
            <div className="metric-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Açık Evrak
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {pendingDocumentCount}
              </p>
            </div>
          </section>

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Dosya Bilgileri
            </h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ad Soyad
                </dt>
                <dd className="mt-1 text-slate-900">{app.fullName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Oluşturulma
                </dt>
                <dd className="mt-1 text-slate-900">
                  {new Date(app.createdAt).toLocaleString('tr-TR')}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  E-posta
                </dt>
                <dd className="mt-1 text-slate-900">{app.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Telefon
                </dt>
                <dd className="mt-1 text-slate-900">{app.phone}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Durum
                </dt>
                <dd className="mt-1 text-slate-900">
                  {STATUS_LABELS[app.status] ?? app.status}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ödeme
                </dt>
                <dd className="mt-1 text-slate-900">
                  {PAYMENT_LABELS[app.paymentStatus] ?? app.paymentStatus}
                </dd>
              </div>
            </dl>
          </div>

          <ApplicationActions
            applicationId={app.id}
            initialStatus={app.status}
            initialPaymentStatus={app.paymentStatus}
          />

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Zaman Tüneli
            </h2>
            {events.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                Bu dosya için henüz log kaydı yok.
              </p>
            ) : (
              <ol className="mt-4 space-y-3 text-sm">
                {events.map((event) => (
                  <li key={event.id} className="border-l border-blue-200 pl-3">
                    <p className="text-xs text-slate-500">
                      {new Date(event.createdAt).toLocaleString('tr-TR')} ·{' '}
                      {event.type}
                    </p>
                    <p className="whitespace-pre-line text-slate-800">
                      {event.message}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Dosya Merkezi
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bu alan müşteri evrakları, görevler, randevu ve ödeme adımlarını
              tek dosya bağlamında toplamak için hazırlandı.
            </p>
            <div className="mt-4 space-y-2">
              {DOCUMENT_CHECKLIST.map((item, index) => {
                const uploadedDocument = documents.find(
                  (document) => document.documentType === item.type,
                );

                return (
                  <div
                    key={item.type}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <span className="font-semibold text-slate-800">
                      {item.label}
                    </span>
                    {uploadedDocument ? (
                      <span
                        className={`status-badge ${
                          DOCUMENT_STATUS_STYLES[uploadedDocument.status] ??
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {getDocumentStatusLabel(uploadedDocument.status)}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700">
                        {getDocumentStatus(app.status, index)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <DocumentUploadForm applications={[app]} defaultApplicationId={app.id} />

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Yüklenen Evraklar
            </h2>
            <div className="mt-4 space-y-3">
              {documents.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                  Bu dosyaya henüz evrak yüklenmedi.
                </p>
              ) : (
                documents.map((document) => (
                  <div
                    key={document.id}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-950">
                          {document.originalFilename}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {getDocumentTypeLabel(document.documentType)} ·{' '}
                          {formatFileSize(document.sizeBytes)}
                        </p>
                      </div>
                      <span
                        className={`status-badge ${
                          DOCUMENT_STATUS_STYLES[document.status] ??
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {getDocumentStatusLabel(document.status)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <DocumentReviewActions
                        documentId={document.id}
                        initialStatus={document.status}
                        initialNote={document.note}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Sonraki Adım
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {NEXT_STEP_BY_STATUS[app.status] ?? NEXT_STEP_BY_STATUS.yeni}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              {[
                'Müşteri iletişimini zaman tüneline işle',
                'Evrak durumunu kontrol et',
                'Randevu ve ödeme takibini güncelle',
              ].map((task) => (
                <div
                  key={task}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                >
                  {task}
                </div>
              ))}
            </div>
          </div>

          <TaskForm applications={[app]} defaultApplicationId={app.id} />

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Görevler ({openTaskCount} açık)
            </h2>
            <div className="mt-4 space-y-3">
              {tasks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                  Bu dosya için henüz görev oluşturulmadı.
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3"
                  >
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {getTaskStatusLabel(task.status)} ·{' '}
                      {getTaskPriorityLabel(task.priority)}
                      {task.dueAt
                        ? ` · ${new Date(task.dueAt).toLocaleString('tr-TR')}`
                        : ''}
                    </p>
                    {task.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3">
                      <TaskActions
                        taskId={task.id}
                        initialStatus={task.status}
                        initialPriority={task.priority}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              CRM Kuralları
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p className="rounded-xl bg-slate-50 px-3 py-2">
                Her durum değişikliği audit log'a yazılır.
              </p>
              <p className="rounded-xl bg-slate-50 px-3 py-2">
                Evrak dosyaları private Supabase Storage altında tutulacak.
              </p>
              <p className="rounded-xl bg-slate-50 px-3 py-2">
                Danışmanlar sadece kendilerine atanan dosyaları düzenleyecek.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
