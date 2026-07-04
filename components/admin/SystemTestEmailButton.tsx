'use client';

import { useState } from 'react';

export function SystemTestEmailButton() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sendTestEmail() {
    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/system/test-email', {
        method: 'POST',
      });
      const json = (await response.json().catch(() => ({}))) as {
        error?: string;
        recipient?: string;
        recipients?: string[];
      };

      if (!response.ok) {
        throw new Error(json.error || 'Test e-postası gönderilemedi.');
      }

      setMessage(
        json.recipients?.length
          ? `Test e-postası gönderildi: ${json.recipients.join(', ')}`
          : json.recipient
            ? `Test e-postası gönderildi: ${json.recipient}`
            : 'Test e-postası gönderildi.',
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Test e-postası gönderilemedi.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold text-slate-950">
            SMTP Test Gönderimi
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Lead bildirim adresine güvenli bir test e-postası gönderir.
          </p>
        </div>
        <button
          type="button"
          onClick={sendTestEmail}
          disabled={busy}
          className="btn-primary"
        >
          {busy ? 'Gönderiliyor...' : 'Test E-postası Gönder'}
        </button>
      </div>

      {message && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
