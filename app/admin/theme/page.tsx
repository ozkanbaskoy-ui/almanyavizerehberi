'use client';

import { useEffect, useState } from 'react';

import {
  THEME_PRESETS,
  type ThemeCustomColors,
  type ThemeKey,
} from '@/lib/settings/theme-presets';

type ThemeResponse = {
  activeTheme: ThemeKey;
  customColors: ThemeCustomColors;
};

export default function ThemeAdminPage() {
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('default');
  const [colors, setColors] = useState<ThemeCustomColors>({
    heroFrom: '#1E3A8A',
    heroTo: '#0F172A',
    videoBg: '#F8FAFC',
    videoBorder: '#E2E8F0',
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
        const res = await fetch('/api/admin/theme', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Tema ayarları alınamadı');
        }
        const data = (await res.json()) as ThemeResponse;
        if (!cancelled && data.activeTheme) {
          setActiveTheme(data.activeTheme);
          if (data.customColors) {
            setColors(data.customColors);
          }
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
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activeTheme,
          customColors: colors,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ?? 'Tema kaydedilirken bir hata oluştu',
        );
      }

      setSuccess(
        'Tema başarıyla güncellendi. Sayfayı yenileyerek sonucu görebilirsiniz.',
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
        Renk Temaları
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Buradan hazır renk paketleri arasından seçim yapabilir veya aşağıdaki
        renk kodlarını değiştirerek hero ve video alanının renklerini
        istediğiniz gibi ayarlayabilirsiniz.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <fieldset
          className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6"
          disabled={loading || saving}
        >
          <legend className="text-sm font-semibold text-slate-700">
            Tema Seçimi
          </legend>

          {loading ? (
            <p className="text-sm text-slate-500">Yükleniyor…</p>
          ) : (
            <div className="space-y-3">
              {THEME_PRESETS.map((preset) => (
                <label
                  key={preset.key}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-border-subtle bg-surface-soft p-4 hover:border-brand-base"
                  onClick={() => {
                    // Hazır tema seçildiğinde, varsayılan renkleri de uygula
                    setActiveTheme(preset.key);
                    setColors(preset.colors);
                  }}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={preset.key}
                    className="mt-1 h-4 w-4 border-slate-300 text-brand-base focus:ring-brand-base"
                    checked={activeTheme === preset.key}
                    onChange={() => {
                      setActiveTheme(preset.key);
                      setColors(preset.colors);
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-brand-dark">
                        {preset.label}
                      </span>
                      <div className="flex gap-1.5">
                        <span className="h-4 w-8 rounded-full bg-brand-dark/80" />
                        <span className="h-4 w-8 rounded-full bg-brand-base/80" />
                        <span className="h-4 w-8 rounded-full bg-brand-action/80" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {preset.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset
          className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6"
          disabled={loading || saving}
        >
          <legend className="text-sm font-semibold text-slate-700">
            Özel Renkler
          </legend>

          <p className="text-xs text-slate-500">
            İstersen buradaki renk kodlarını değiştirerek kendi paletini
            oluşturabilirsin. Seçtiğin temanın başlangıç değerleri otomatik
            gelir, sen istediğin gibi düzenleyebilirsin.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hero Gradyan Başlangıcı
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-9 w-9 cursor-pointer rounded border border-border-subtle bg-surface-soft"
                  value={colors.heroFrom}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      heroFrom: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-border-subtle bg-surface-soft px-3 py-1.5 text-xs font-mono"
                  value={colors.heroFrom}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      heroFrom: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hero Gradyan Bitişi
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-9 w-9 cursor-pointer rounded border border-border-subtle bg-surface-soft"
                  value={colors.heroTo}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      heroTo: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-border-subtle bg-surface-soft px-3 py-1.5 text-xs font-mono"
                  value={colors.heroTo}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      heroTo: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Video Alanı Arka Planı
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-9 w-9 cursor-pointer rounded border border-border-subtle bg-surface-soft"
                  value={colors.videoBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      videoBg: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-border-subtle bg-surface-soft px-3 py-1.5 text-xs font-mono"
                  value={colors.videoBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      videoBg: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Video Alanı Çerçevesi
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-9 w-9 cursor-pointer rounded border border-border-subtle bg-surface-soft"
                  value={colors.videoBorder}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      videoBorder: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-border-subtle bg-surface-soft px-3 py-1.5 text-xs font-mono"
                  value={colors.videoBorder}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      videoBorder: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
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

