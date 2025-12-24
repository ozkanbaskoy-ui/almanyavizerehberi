'use client';

import { useEffect, useState } from 'react';

import type { TypographySettings } from '@/lib/settings/typography';

export default function TypographyAdminPage() {
  const [form, setForm] = useState<TypographySettings>({
    scale: 'normal',
  });
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
        const res = await fetch('/api/admin/typography', {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Tipografi ayarları alınamadı');
        }
        const data = (await res.json()) as TypographySettings;
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
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/typography', {
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
          data?.error ?? 'Tipografi kaydedilirken bir hata oluştu',
        );
      }

      setSuccess(
        'Tipografi ayarları güncellendi. Ana sayfayı yenileyerek sonucu görebilirsiniz.',
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-[960px] px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-dark">
        Tipografi Ayarları
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Buradan sitenin genel yazı büyüklük seviyesini (body metinler ve
        başlıklar) değiştirebilirsiniz.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <fieldset
          className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6"
          disabled={loading || saving}
        >
          <legend className="text-sm font-semibold text-slate-700">
            Yazı Büyüklüğü
          </legend>

          {loading ? (
            <p className="text-sm text-slate-500">Yükleniyor…</p>
          ) : (
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-surface-soft p-3 hover:border-brand-base">
                <input
                  type="radio"
                  name="scale"
                  value="small"
                  className="h-4 w-4 border-slate-300 text-brand-base focus:ring-brand-base"
                  checked={form.scale === 'small'}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, scale: 'small' }))
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-brand-dark">
                    Küçük
                  </p>
                  <p className="text-xs text-slate-500">
                    Daha kompakt görünüm; mobilde daha fazla içerik aynı
                    ekranda.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-surface-soft p-3 hover:border-brand-base">
                <input
                  type="radio"
                  name="scale"
                  value="normal"
                  className="h-4 w-4 border-slate-300 text-brand-base focus:ring-brand-base"
                  checked={form.scale === 'normal'}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, scale: 'normal' }))
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-brand-dark">
                    Normal
                  </p>
                  <p className="text-xs text-slate-500">
                    Dengeli; şu anki varsayılan boyutlar.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-subtle bg-surface-soft p-3 hover:border-brand-base">
                <input
                  type="radio"
                  name="scale"
                  value="large"
                  className="h-4 w-4 border-slate-300 text-brand-base focus:ring-brand-base"
                  checked={form.scale === 'large'}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, scale: 'large' }))
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-brand-dark">
                    Büyük
                  </p>
                  <p className="text-xs text-slate-500">
                    Başlıklar ve paragraflar daha büyük; okunabilirlik ve
                    vurgu artar.
                  </p>
                </div>
              </label>
            </div>
          )}
        </fieldset>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-base px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-light disabled:opacity-60"
            disabled={loading || saving}
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

