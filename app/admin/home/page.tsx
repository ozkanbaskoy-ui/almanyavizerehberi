'use client';

import { useEffect, useState } from 'react';

import type { HomeSettings } from '@/lib/settings/home';

export default function HomeAdminPage() {
  const [form, setForm] = useState<HomeSettings | null>(null);
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
        const res = await fetch('/api/admin/home', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Ana sayfa ayarları alınamadı');
        }
        const data = (await res.json()) as HomeSettings;
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

  function update<K extends keyof HomeSettings>(
    section: K,
    field: keyof HomeSettings[K],
    value: string,
  ) {
    if (!form) return;
    setForm({
      ...form,
      [section]: {
        ...form[section],
        [field]: value,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/home', {
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
          data?.error ?? 'Ana sayfa ayarları kaydedilirken hata oluştu',
        );
      }

      setSuccess('Ana sayfa metinleri başarıyla güncellendi.');
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
        Ana Sayfa Metinleri
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Hero başlığı, açıklama metinleri, hizmetler ve video bloğu
        içeriklerini buradan güncelleyebilirsiniz.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-slate-500">Yükleniyor…</p>
      ) : error ? (
        <p className="mt-8 text-sm text-red-600">{error}</p>
      ) : form ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* Hero */}
          <section className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6">
            <h2 className="text-lg font-semibold text-brand-dark">
              Hero Alanı
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Üst Etiket (Küçük Yazı)
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                  value={form.hero.kicker}
                  onChange={(e) =>
                    update('hero', 'kicker', e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Başlık
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                  value={form.hero.title}
                  onChange={(e) =>
                    update('hero', 'title', e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Açıklama
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                rows={4}
                value={form.hero.body}
                onChange={(e) =>
                  update('hero', 'body', e.target.value)
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Birinci Buton Yazısı
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                  value={form.hero.primaryCtaText}
                  onChange={(e) =>
                    update('hero', 'primaryCtaText', e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  İkinci Buton Yazısı
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                  value={form.hero.secondaryCtaText}
                  onChange={(e) =>
                    update('hero', 'secondaryCtaText', e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Video Bloğu */}
          <section className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6">
            <h2 className="text-lg font-semibold text-brand-dark">
              Video Bloğu
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Başlık
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                value={form.videos.title}
                onChange={(e) =>
                  update('videos', 'title', e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Açıklama
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                rows={4}
                value={form.videos.body}
                onChange={(e) =>
                  update('videos', 'body', e.target.value)
                }
              />
            </div>
          </section>

          {/* Hizmetler Bloğu */}
          <section className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6">
            <h2 className="text-lg font-semibold text-brand-dark">
              Hizmetler Bloğu
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Üst Etiket (HİZMETLERİMİZ vb.)
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                  value={form.services.kicker}
                  onChange={(e) =>
                    update('services', 'kicker', e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Başlık
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                  value={form.services.title}
                  onChange={(e) =>
                    update('services', 'title', e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Açıklama
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                rows={4}
                value={form.services.body}
                onChange={(e) =>
                  update('services', 'body', e.target.value)
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
      ) : null}
    </main>
  );
}

