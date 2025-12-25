'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type BlogForm = {
  slug: string;
  title: string;
  date: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  bodyHtml: string;
};

type PageProps = {
  params: { slug: string };
};

export default function AdminBlogEditPage({ params }: PageProps) {
  const [form, setForm] = useState<BlogForm | null>(null);
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
        const res = await fetch(`/api/admin/blog/${params.slug}`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Blog yazısı alınamadı.');
        }
        const data = (await res.json()) as BlogForm;
        if (!cancelled) {
          setForm(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.',
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
  }, [params.slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/blog/${params.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ?? 'Blog yazısı kaydedilirken hata oluştu.',
        );
      }
      setSuccess('Blog yazısı başarıyla güncellendi.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-[960px] px-4 py-8">
      <Link
        href="/admin/cms/blog"
        className="text-xs font-semibold text-brand-base hover:text-brand-light"
      >
        ← Blog listesine dön
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        Blog Yazısını Düzenle
      </h1>
      <p className="mt-1 text-xs text-slate-500">
        Burada başlık, tarih, SEO alanları, kapak görseli ve HTML içeriğini
        doğrudan güncelleyebilirsiniz. Değişiklikler hemen canlı siteye
        yansır.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Yükleniyor…</p>
      ) : error ? (
        <p className="mt-6 text-sm text-red-600">{error}</p>
      ) : form ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Başlık
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tarih
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SEO Başlık
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  value={form.seoTitle}
                  onChange={(e) =>
                    setForm({ ...form, seoTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Kapak Görseli URL
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                SEO Açıklama
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                rows={3}
                value={form.seoDescription}
                onChange={(e) =>
                  setForm({ ...form, seoDescription: e.target.value })
                }
              />
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              HTML İçerik
            </label>
            <p className="text-[11px] text-slate-500">
              Bu alan, eski siteden gelen ham HTML metnidir. İleri seviye
              kullanıcılar için bırakıldı; düzenlerken dikkatli olun.
            </p>
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs"
              rows={18}
              value={form.bodyHtml}
              onChange={(e) =>
                setForm({ ...form, bodyHtml: e.target.value })
              }
            />
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
              <p className="text-sm text-emerald-600">{success}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </form>
      ) : null}
    </main>
  );
}

