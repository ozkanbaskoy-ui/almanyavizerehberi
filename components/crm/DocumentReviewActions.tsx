'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  CRM_DOCUMENT_STATUSES,
  type CrmDocumentStatus,
} from '@/lib/admin/documentModel';

type DocumentReviewActionsProps = {
  documentId: string;
  initialStatus: CrmDocumentStatus;
  initialNote: string | null;
};

export function DocumentReviewActions({
  documentId,
  initialStatus,
  initialNote,
}: DocumentReviewActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<CrmDocumentStatus>(initialStatus);
  const [note, setNote] = useState(initialNote || '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/crm/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(json.error || 'Evrak güncellenemedi.');
      }

      setMessage('Kaydedildi.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evrak güncellenemedi.');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const confirmed = window.confirm('Bu evrak kaydını silmek istiyor musunuz?');
    if (!confirmed) return;

    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/crm/documents/${documentId}`, {
        method: 'DELETE',
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(json.error || 'Evrak silinemedi.');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evrak silinemedi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-[180px_minmax(0,1fr)]">
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as CrmDocumentStatus)
          }
          disabled={busy}
          className="form-select min-h-9 px-3 py-1 text-xs"
        >
          {CRM_DOCUMENT_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          disabled={busy}
          className="form-input min-h-9 px-3 py-1 text-xs"
          placeholder="İnceleme notu"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="btn-secondary min-h-9 px-3 py-1 text-xs"
        >
          Kaydet
        </button>
        <a
          href={`/api/crm/documents/${documentId}/download`}
          className="btn-ghost min-h-9 px-3 py-1 text-xs"
        >
          İndir
        </a>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sil
        </button>
      </div>
      {message && <p className="text-xs text-emerald-600">{message}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
