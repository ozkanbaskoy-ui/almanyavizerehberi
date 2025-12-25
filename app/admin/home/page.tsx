'use client';

import { useEffect, useState } from 'react';

import type { HomeSettings, HomeStat } from '@/lib/settings/home';

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
          // stats alanı eksikse güvenli bir varsayılan ile doldur
          const stats: HomeStat[] =
            Array.isArray(data.stats) && data.stats.length > 0
              ? data.stats
              : [
                  { label: 'Mutlu Müşteri', value: 1000, suffix: '+' },
                  { label: 'Uzman Danışman', value: 50, suffix: '+' },
                  { label: 'Vize Onay Oranı', value: 95, suffix: '%' },
                  { label: 'Ülkeden Başvuru', value: 15, suffix: '+' },
                ];
          setForm({ ...data, stats });
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

  function updateStat(
    index: number,
    field: keyof HomeStat,
    value: string,
  ) {
    if (!form) return;
    const stats = form.stats.map((stat, i) => {
      if (i !== index) return stat;
      if (field === 'value') {
        const numeric = Number(value);
        return { ...stat, value: Number.isFinite(numeric) ? numeric : 0 };
      }
      return { ...stat, [field]: value };
    });
    setForm({ ...form, stats });
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
        Hero başlığı, açıklama metinleri, hizmetler ve video bloğu içeriklerini
        ve güven bloğu istatistiklerini buradan güncelleyebilirsiniz.
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

          {/* Güven Bloğu / İstatistikler */}
          <section className="space-y-4 rounded-2xl border border-border-subtle bg-surface-main p-6">
            <h2 className="text-lg font-semibold text-brand-dark">
              Güven Bloğu (İstatistikler)
            </h2>
            <p className="text-xs text-slate-600">
              Ana sayfadaki sayaçları (1000+ Mutlu Müşteri vb.) buradan
              düzenleyebilirsiniz.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {form.stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="space-y-2 rounded-xl border border-border-subtle bg-surface-soft p-3"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    İstatistik #{index + 1}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Etiket
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border border-border-subtle bg-white px-2 py-1.5 text-xs"
                      value={stat.label}
                      onChange={(e) =>
                        updateStat(index, 'label', e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Değer
                      </label>
                      <input
                        type="number"
                        className="mt-1 w-full rounded-md border border-border-subtle bg-white px-2 py-1.5 text-xs"
                        value={stat.value}
                        onChange={(e) =>
                          updateStat(index, 'value', e.target.value)
                        }
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Sonek
                      </label>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-md border border-border-subtle bg-white px-2 py-1.5 text-xs"
                        value={stat.suffix}
                        onChange={(e) =>
                          updateStat(index, 'suffix', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
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

