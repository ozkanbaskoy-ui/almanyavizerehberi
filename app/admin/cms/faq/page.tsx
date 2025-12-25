'use client';

import { useEffect, useState } from 'react';

import type { FAQItem } from '@/lib/content/faq';

export default function AdminCmsFaqPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
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
        const res = await fetch('/api/admin/faq', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('SSS listesi alınamadı.');
        }
        const data = (await res.json()) as FAQItem[];
        if (!cancelled) {
          setItems(data);
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

  function updateItem(
    index: number,
    field: 'question' | 'answer',
    value: string,
  ) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addItem() {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'Yeni soru',
      answer: 'Yeni cevabı buraya yazın.',
    };
    setItems((prev) => [...prev, newItem]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? 'SSS kaydedilirken hata oluştu.');
      }
      setSuccess('SSS içeriği başarıyla güncellendi.');
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
      <h1 className="text-2xl font-semibold text-slate-900">
        Sıkça Sorulan Sorular
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Buradan SSS (FAQ) bölümündeki soruları ve cevaplarını düzenleyebilir,
        yeni soru ekleyebilir veya mevcut soruları kaldırabilirsiniz.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Yükleniyor…</p>
      ) : error ? (
        <p className="mt-6 text-sm text-red-600">{error}</p>
      ) : (
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Soru #{index + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-[11px] font-semibold text-red-600 hover:text-red-700"
                  >
                    Sil
                  </button>
                </div>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  value={item.question}
                  onChange={(e) =>
                    updateItem(index, 'question', e.target.value)
                  }
                />
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  rows={3}
                  value={item.answer}
                  onChange={(e) =>
                    updateItem(index, 'answer', e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={addItem}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 hover:border-slate-400"
            >
              + Yeni Soru Ekle
            </button>
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
      )}
    </main>
  );
}

