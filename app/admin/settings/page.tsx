'use client';

import { useEffect, useState } from 'react';

import type {
  EmailTemplate,
  EmailTemplatesConfig,
} from '@/lib/settings/emailTemplates';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<EmailTemplatesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/email-templates', {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('E-posta şablonları alınamadı.');
        }
        const data = (await res.json()) as EmailTemplatesConfig;
        if (!cancelled) {
          setConfig(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Bilinmeyen bir hata oluştu.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ??
            'E-posta şablonları kaydedilirken bir hata oluştu.',
        );
      }

      setSuccess('E-posta şablonları başarıyla güncellendi.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Bilinmeyen bir hata oluştu.',
      );
    } finally {
      setSaving(false);
    }
  }

  function updateTemplate(
    id: EmailTemplate['id'],
    field: 'subject' | 'body',
    value: string,
  ) {
    if (!config) return;
    setConfig({
      templates: config.templates.map((t) =>
        t.id === id ? { ...t, [field]: value } : t,
      ),
    });
  }

  if (loading || !config) {
    return (
      <main className="mx-auto max-w-[960px] px-4 py-8">
        <p className="text-sm text-slate-500">Yükleniyor…</p>
      </main>
    );
  }

  const placeholdersHelp: Record<EmailTemplate['id'], string[]> = {
    application_received: [
      '{{fullName}}',
      '{{visaType}}',
      '{{createdAt}}',
    ],
    payment_received: [
      '{{fullName}}',
      '{{amount}}',
      '{{productName}}',
      '{{paidAt}}',
    ],
    appointment_scheduled: [
      '{{fullName}}',
      '{{appointmentDate}}',
      '{{appointmentTime}}',
      '{{channel}}',
    ],
    admin_login_code: ['{{code}}', '{{time}}'],
  };

  return (
    <main className="mx-auto max-w-[960px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Ayarlar &amp; E-posta Şablonları
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Buradan otomatik gönderilecek e-posta şablonlarının konu ve
        içeriklerini kod yazmadan güncelleyebilirsiniz.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 text-sm text-emerald-600">
          {success}
        </p>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        {config.templates.map((tpl) => (
          <section
            key={tpl.id}
            className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-brand-dark">
                  {tpl.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Kullanılabilir değişkenler:{' '}
                  {placeholdersHelp[tpl.id].join(', ')}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-mono text-slate-600">
                id: {tpl.id}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Konu (Subject)
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={tpl.subject}
                onChange={(e) =>
                  updateTemplate(tpl.id, 'subject', e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Gövde (Body)
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm font-mono"
                rows={8}
                value={tpl.body}
                onChange={(e) =>
                  updateTemplate(tpl.id, 'body', e.target.value)
                }
              />
            </div>
          </section>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-base px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-light disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Kaydediliyor…' : 'Şablonları Kaydet'}
          </button>
        </div>
      </form>
    </main>
  );
}

