'use client';

import { useEffect, useState } from 'react';

import type { SiteSettings } from '@/lib/settings/site';

export default function SiteAdminPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
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
        const res = await fetch('/api/admin/site', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Site ayarları alınamadı');
        }
        const data = (await res.json()) as SiteSettings;
        if (!cancelled) {
          setForm(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu',
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ?? 'Site ayarları kaydedilirken bir hata oluştu',
        );
      }

      setSuccess('Site ayarları başarıyla güncellendi.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <main className="mx-auto max-w-[960px] px-4 py-10">
        <p className="text-sm text-slate-500">Yükleniyor…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[960px] px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-dark">
        Site Genel Ayarları
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Buradan site adı, iletişim bilgileri, sosyal medya adresleri ve Calendly
        / YouTube entegrasyon ayarlarını kod yazmadan güncelleyebilirsiniz.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Genel Bilgiler */}
        <section className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            Genel Bilgiler
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Site Adı
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={form.siteName}
                onChange={(e) =>
                  setForm({ ...form, siteName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Kısa Slogan
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={form.tagline}
                onChange={(e) =>
                  setForm({ ...form, tagline: e.target.value })
                }
              />
            </div>
          </div>
        </section>

        {/* İletişim Bilgileri */}
        <section className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            İletişim Bilgileri
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                E-posta
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Telefon
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm({ ...form, contactPhone: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              WhatsApp Numarası (uluslararası format)
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
              value={form.whatsappNumber}
              onChange={(e) =>
                setForm({ ...form, whatsappNumber: e.target.value })
              }
            />
          </div>
        </section>

        {/* Sosyal Medya */}
        <section className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            Sosyal Medya
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Instagram Adresi
              </label>
              <input
                type="url"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm({ ...form, instagramUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                YouTube Kanal Adresi
              </label>
              <input
                type="url"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={form.youtubeUrl}
                onChange={(e) =>
                  setForm({ ...form, youtubeUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                YouTube Kanal ID
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={form.youtubeChannelId}
                onChange={(e) =>
                  setForm({ ...form, youtubeChannelId: e.target.value })
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Örn: UCYNClRqdbdinZphYGiSGg9Q
              </p>
            </div>
          </div>
        </section>

        {/* Entegrasyonlar */}
        <section className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            Entegrasyonlar
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Calendly URL
            </label>
            <input
              type="url"
              className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
              value={form.calendlyUrl}
              onChange={(e) =>
                setForm({ ...form, calendlyUrl: e.target.value })
              }
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Örn: https://calendly.com/almanyavizerehberi/almanya-vize-rehberi
            </p>
          </div>
        </section>

        {/* Bakım Modu */}
        <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            Bakım Modu
          </h2>
          <p className="text-xs text-slate-600">
            Bakım modunu aktif ettiğinizde ziyaretçilere ana içerik yerine
            aşağıdaki mesaj gösterilir. Admin paneli erişimi devam eder.
          </p>

          <div className="flex items-center gap-3">
            <input
              id="maintenanceMode"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              checked={form.maintenanceMode}
              onChange={(e) =>
                setForm({ ...form, maintenanceMode: e.target.checked })
              }
            />
            <label
              htmlFor="maintenanceMode"
              className="text-sm font-semibold text-slate-800"
            >
              Siteyi bakım moduna al
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Bakım Modu Mesajı
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
              rows={3}
              value={form.maintenanceMessage}
              onChange={(e) =>
                setForm({ ...form, maintenanceMessage: e.target.value })
              }
            />
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-base px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-light disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>

          {success && (
            <p className="text-sm text-emerald-600">
              {success}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
