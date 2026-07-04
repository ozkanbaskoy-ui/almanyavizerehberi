'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  CRM_USER_ROLES,
  CRM_USER_STATUSES,
  type CrmUserRole,
  type CrmUserStatus,
} from '@/lib/admin/crmUserModel';

type CrmUserActionsProps = {
  userId: string;
  initialRole: CrmUserRole;
  initialStatus: CrmUserStatus;
  initialTwoFactorEnabled: boolean;
};

export function CrmUserActions({
  userId,
  initialRole,
  initialStatus,
  initialTwoFactorEnabled,
}: CrmUserActionsProps) {
  const router = useRouter();
  const [role, setRole] = useState<CrmUserRole>(initialRole);
  const [status, setStatus] = useState<CrmUserStatus>(initialStatus);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    initialTwoFactorEnabled,
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          status,
          twoFactorEnabled,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(json.error || 'Kullanıcı güncellenemedi.');
      }

      setMessage('Kaydedildi.');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Kullanıcı güncellenirken hata oluştu.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const confirmed = window.confirm(
      'Bu CRM kullanıcısını silmek istediğinize emin misiniz?',
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(json.error || 'Kullanıcı silinemedi.');
      }

      setMessage('Silindi.');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Kullanıcı silinirken hata oluştu.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-w-[260px] space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as CrmUserRole)}
          className="form-select min-h-9 px-3 py-1 text-xs"
          disabled={busy}
        >
          {CRM_USER_ROLES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as CrmUserStatus)}
          className="form-select min-h-9 px-3 py-1 text-xs"
          disabled={busy}
        >
          {CRM_USER_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <input
          type="checkbox"
          checked={twoFactorEnabled}
          onChange={(event) => setTwoFactorEnabled(event.target.checked)}
          disabled={busy}
          className="h-4 w-4 rounded border-slate-300 text-brand-base"
        />
        2FA aktif
      </label>

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

      {message && <p className="text-xs text-emerald-600">{message}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
