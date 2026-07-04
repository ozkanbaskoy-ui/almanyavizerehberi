'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import {
  CRM_DOCUMENT_STATUSES,
  CRM_DOCUMENT_TYPES,
  type CrmDocumentStatus,
} from '@/lib/admin/documentModel';
import type { ApplicationRecord } from '@/lib/admin/applicationsData';

type DocumentUploadFormProps = {
  applications: ApplicationRecord[];
  defaultApplicationId?: string;
};

export function DocumentUploadForm({
  applications,
  defaultApplicationId,
}: DocumentUploadFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [applicationId, setApplicationId] = useState(
    defaultApplicationId || applications[0]?.id || '',
  );
  const [documentType, setDocumentType] = useState('passport');
  const [status, setStatus] = useState<CrmDocumentStatus>('uploaded');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!applicationId || !documentType || !file) {
      setError('Başvuru, evrak türü ve dosya seçimi zorunludur.');
      return;
    }

    const formData = new FormData();
    formData.set('applicationId', applicationId);
    formData.set('documentType', documentType);
    formData.set('status', status);
    formData.set('note', note);
    formData.set('file', file);

    setSubmitting(true);
    try {
      const res = await fetch('/api/crm/documents', {
        method: 'POST',
        body: formData,
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        storage?: string;
      };

      if (!res.ok) {
        throw new Error(json.error || 'Evrak yüklenemedi.');
      }

      setMessage(
        json.storage === 'local'
          ? 'Evrak lokal geliştirme deposuna kaydedildi.'
          : 'Evrak kaydedildi.',
      );
      setNote('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evrak yüklenemedi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Evrak Yükle
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Local testte dosyalar sadece proje içindeki `.local-crm/uploads`
          klasörüne kaydedilir.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">Başvuru / Dosya</label>
          {defaultApplicationId ? (
            <input type="hidden" name="applicationId" value={applicationId} />
          ) : (
            <select
              value={applicationId}
              onChange={(event) => setApplicationId(event.target.value)}
              className="form-select"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.fullName} - {app.visaType}
                </option>
              ))}
            </select>
          )}
          {defaultApplicationId && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
              {applications.find((app) => app.id === applicationId)?.fullName ||
                applicationId}
            </div>
          )}
        </div>

        <div className="form-field">
          <label className="form-label">Evrak Türü</label>
          <select
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
            className="form-select"
          >
            {CRM_DOCUMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">Durum</label>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as CrmDocumentStatus)
            }
            className="form-select"
          >
            {CRM_DOCUMENT_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">Dosya</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.docx"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Not</label>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          className="form-textarea"
          placeholder="Eksik sayfa, kalite, çeviri ihtiyacı veya özel açıklama..."
        />
      </div>

      {message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Yükleniyor...' : 'Evrak Yükle'}
        </button>
      </div>
    </form>
  );
}
