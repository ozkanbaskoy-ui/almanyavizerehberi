'use client';

import { useEffect, useState } from 'react';

type PageEditable = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  bodyHtml: string;
};

type PageEditorProps = {
  params: {
    slug: string;
  };
};

export default function AdminCmsPageEdit({ params }: PageEditorProps) {
  const { slug } = params;
  const [page, setPage] = useState<PageEditable | null>(null);
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
        const res = await fetch(`/api/admin/pages/${slug}`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Sayfa içeriği alınamadı.');
        }
        const data = (await res.json()) as PageEditable;
        if (!cancelled) {
          setPage(data);
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
  }, [slug]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!page) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: page.title,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          bodyHtml: page.bodyHtml,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ?? 'Sayfa kaydedilirken bir hata oluştu.',
        );
      }

      setSuccess('Sayfa içeriği başarıyla güncellendi.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || !page) {
    return (
      <main className="mx-auto max-w-[960px] px-4 py-8">
        <p className="text-sm text-slate-500">Yükleniyor…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[960px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Sayfa Düzenle: {page.title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Bu ekrandan sayfanın başlığını, SEO alanlarını ve HTML gövdesini
        düzenleyebilirsiniz. Gövde alanı HTML olarak kaydedilir; sade içerik
        blokları için paragraf ve başlık etiketlerini kullanabilirsiniz.
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
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sayfa Başlığı (H1)
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
            value={page.title}
            onChange={(e) =>
              setPage({ ...page, title: e.target.value })
            }
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              SEO Title
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
              value={page.seoTitle}
              onChange={(e) =>
                setPage({ ...page, seoTitle: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              SEO Description
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
              rows={3}
              value={page.seoDescription}
              onChange={(e) =>
                setPage({ ...page, seoDescription: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Gövde HTML
          </label>
          <textarea
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-soft px-3 py-2 text-sm font-mono"
            rows={16}
            value={page.bodyHtml}
            onChange={(e) =>
              setPage({ ...page, bodyHtml: e.target.value })
            }
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Basit paragraf ve başlıklar için &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;,
            &lt;ul&gt;, &lt;li&gt; etiketlerini kullanabilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-base px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-light disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </form>
    </main>
  );
}

