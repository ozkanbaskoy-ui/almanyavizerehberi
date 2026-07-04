'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ApplicationRecord } from '@/lib/admin/applicationsData';
import {
  CRM_TASK_PRIORITIES,
  CRM_TASK_STATUSES,
  type CrmTaskPriority,
  type CrmTaskStatus,
} from '@/lib/admin/taskModel';

type TaskFormProps = {
  applications: ApplicationRecord[];
  defaultApplicationId?: string;
};

export function TaskForm({ applications, defaultApplicationId }: TaskFormProps) {
  const router = useRouter();
  const [applicationId, setApplicationId] = useState(
    defaultApplicationId || applications[0]?.id || '',
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<CrmTaskStatus>('open');
  const [priority, setPriority] = useState<CrmTaskPriority>('normal');
  const [dueAt, setDueAt] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!applicationId || !title.trim()) {
      setError('Başvuru ve görev başlığı zorunludur.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/crm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          title,
          description,
          status,
          priority,
          dueAt: dueAt ? new Date(dueAt).toISOString() : null,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        storage?: string;
      };

      if (!res.ok) {
        throw new Error(json.error || 'Görev oluşturulamadı.');
      }

      setMessage(
        json.storage === 'local'
          ? 'Görev lokal geliştirme deposuna kaydedildi.'
          : 'Görev oluşturuldu.',
      );
      setTitle('');
      setDescription('');
      setDueAt('');
      setStatus('open');
      setPriority('normal');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Görev oluşturulamadı.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Yeni Görev
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Danışman, evrak, ödeme veya randevu takibi için görev oluşturun.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">Başvuru / Dosya</label>
          {defaultApplicationId ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
              {applications.find((app) => app.id === applicationId)?.fullName ||
                applicationId}
            </div>
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
        </div>

        <div className="form-field">
          <label className="form-label">Başlık</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="form-input"
            placeholder="Örn. Eksik diploma evrakını iste"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="form-field">
          <label className="form-label">Durum</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as CrmTaskStatus)}
            className="form-select"
          >
            {CRM_TASK_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Öncelik</label>
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as CrmTaskPriority)
            }
            className="form-select"
          >
            {CRM_TASK_PRIORITIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Bitiş</label>
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Açıklama</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="form-textarea"
          placeholder="Görev notu..."
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
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? 'Kaydediliyor...' : 'Görev Oluştur'}
        </button>
      </div>
    </form>
  );
}
