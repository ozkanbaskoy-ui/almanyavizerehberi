'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  CRM_TASK_PRIORITIES,
  CRM_TASK_STATUSES,
  type CrmTaskPriority,
  type CrmTaskStatus,
} from '@/lib/admin/taskModel';

type TaskActionsProps = {
  taskId: string;
  initialStatus: CrmTaskStatus;
  initialPriority: CrmTaskPriority;
};

export function TaskActions({
  taskId,
  initialStatus,
  initialPriority,
}: TaskActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<CrmTaskStatus>(initialStatus);
  const [priority, setPriority] = useState<CrmTaskPriority>(initialPriority);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`/api/crm/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) throw new Error(json.error || 'Görev güncellenemedi.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görev güncellenemedi.');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const confirmed = window.confirm('Bu görevi silmek istiyor musunuz?');
    if (!confirmed) return;

    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`/api/crm/tasks/${taskId}`, {
        method: 'DELETE',
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) throw new Error(json.error || 'Görev silinemedi.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görev silinemedi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as CrmTaskStatus)}
          disabled={busy}
          className="form-select min-h-9 px-3 py-1 text-xs"
        >
          {CRM_TASK_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as CrmTaskPriority)
          }
          disabled={busy}
          className="form-select min-h-9 px-3 py-1 text-xs"
        >
          {CRM_TASK_PRIORITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
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
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sil
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
