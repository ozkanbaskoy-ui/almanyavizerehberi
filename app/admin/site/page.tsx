'use client';

import { useEffect, useMemo, useState } from 'react';

import type { SiteSettings } from '@/lib/settings/site';
import { normalizeExternalUrl } from '@/lib/whatsappCommunity';

export default function SiteAdminPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const normalizedGroupUrl = useMemo(
    () => normalizeExternalUrl(form?.whatsappGroupUrl),
    [form?.whatsappGroupUrl],
  );
  const normalizedChannelUrl = useMemo(
    () => normalizeExternalUrl(form?.whatsappChannelUrl),
    [form?.whatsappChannelUrl],
  );
  const whatsappUrlsMatch =
    Boolean(normalizedGroupUrl) &&
    normalizedGroupUrl === normalizedChannelUrl;

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
    <main className="admin-page max-w-[960px] py-10">
      <h1 className="admin-page-title text-3xl">
        Site Genel Ayarları
      </h1>
      <p className="admin-page-subtitle mt-3">
        Buradan site adı, iletişim bilgileri, sosyal medya adresleri, Google
        Calendar randevu linki ve YouTube entegrasyon ayarlarını kod yazmadan
        güncelleyebilirsiniz.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Genel Bilgiler */}
        <section className="panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            Genel Bilgiler
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">
                Site Adı
              </label>
              <input
                type="text"
                className="form-input"
                value={form.siteName}
                onChange={(e) =>
                  setForm({ ...form, siteName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">
                Kısa Slogan
              </label>
              <input
                type="text"
                className="form-input"
                value={form.tagline}
                onChange={(e) =>
                  setForm({ ...form, tagline: e.target.value })
                }
              />
            </div>
          </div>
        </section>

        {/* İletişim Bilgileri */}
        <section className="panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            İletişim Bilgileri
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">
                E-posta
              </label>
              <input
                type="email"
                className="form-input"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">
                Telefon
              </label>
              <input
                type="text"
                className="form-input"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm({ ...form, contactPhone: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              WhatsApp Numarası (uluslararası format)
            </label>
            <input
              type="text"
              className="form-input"
              value={form.whatsappNumber}
              onChange={(e) =>
                setForm({ ...form, whatsappNumber: e.target.value })
              }
            />
          </div>
        </section>

        {/* Sosyal Medya */}
        <section className="panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            Sosyal Medya
          </h2>

          <div className="space-y-4">
            <div>
              <label className="form-label">
                Instagram Adresi
              </label>
              <input
                type="url"
                className="form-input"
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm({ ...form, instagramUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="form-label">
                YouTube Kanal Adresi
              </label>
              <input
                type="url"
                className="form-input"
                value={form.youtubeUrl}
                onChange={(e) =>
                  setForm({ ...form, youtubeUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="form-label">
                YouTube Kanal ID
              </label>
              <input
                type="text"
                className="form-input"
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

        <section className="panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            WhatsApp Topluluk
          </h2>
          <p className="text-xs text-slate-600">
            Buraya eklediğiniz linkler, ziyaretçilere gösterilen pop-up içinde
            grup ve kanal butonu olarak görünür.
          </p>

          <div className="space-y-4">
            <div>
              <label className="form-label">
                WhatsApp Grup URL
              </label>
              <input
                type="url"
                className="form-input"
                value={form.whatsappGroupUrl}
                onChange={(e) =>
                  setForm({ ...form, whatsappGroupUrl: e.target.value })
                }
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>

            <div>
              <label className="form-label">
                WhatsApp Kanal URL
              </label>
              <input
                type="url"
                className="form-input"
                value={form.whatsappChannelUrl}
                onChange={(e) =>
                  setForm({ ...form, whatsappChannelUrl: e.target.value })
                }
                placeholder="https://whatsapp.com/channel/..."
              />
            </div>

            {whatsappUrlsMatch && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-900">
                Grup ve kanal URL&apos;leri aynı görünüyor. Kanal butonunun ayrı
                çalışması için buraya gerçek WhatsApp kanal linkini girmeniz
                gerekir.
              </p>
            )}
          </div>
        </section>

        {/* Entegrasyonlar */}
        <section className="panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            Entegrasyonlar
          </h2>

          <div>
            <label className="form-label">
              Google Calendar Randevu URL
            </label>
            <input
              type="url"
              className="form-input"
              value={form.calendlyUrl}
              onChange={(e) =>
                setForm({ ...form, calendlyUrl: e.target.value })
              }
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Örn: https://calendar.google.com/calendar/appointments/schedules/...
            </p>
          </div>
        </section>

        {/* Stripe Ödeme Linkleri */}
        <section className="panel space-y-4 p-6">
          <h2 className="text-lg font-semibold text-brand-dark">
            Stripe Ödeme Linkleri
          </h2>
          <p className="text-xs text-slate-600">
            Burada tanımladığınız ödeme linkleri, sitedeki{' '}
            <code className="rounded bg-surface-soft px-1 py-0.5 text-[10px]">
              /odeme
            </code>{' '}
            sayfasında gösterilir. Stripe panelinizden Payment Link oluşturup
            URL&apos;leri bu alana yapıştırabilirsiniz.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-border-subtle bg-surface-soft p-4">
              <h3 className="text-sm font-semibold text-brand-dark">
                1. Ödeme Linki
              </h3>
              <div>
                <label className="form-label text-[11px]">
                  Başlık
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.payment1Label}
                  onChange={(e) =>
                    setForm({ ...form, payment1Label: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label text-[11px]">
                  Tutar (bilgi için)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.payment1Amount}
                  onChange={(e) =>
                    setForm({ ...form, payment1Amount: e.target.value })
                  }
                  placeholder="Örn: 99 €"
                />
              </div>
              <div>
                <label className="form-label text-[11px]">
                  Stripe Payment Link URL
                </label>
                <input
                  type="url"
                  className="form-input"
                  value={form.payment1Url}
                  onChange={(e) =>
                    setForm({ ...form, payment1Url: e.target.value })
                  }
                  placeholder="https://buy.stripe.com/..."
                />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-border-subtle bg-surface-soft p-4">
              <h3 className="text-sm font-semibold text-brand-dark">
                2. Ödeme Linki
              </h3>
              <div>
                <label className="form-label text-[11px]">
                  Başlık
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.payment2Label}
                  onChange={(e) =>
                    setForm({ ...form, payment2Label: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label text-[11px]">
                  Tutar (bilgi için)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.payment2Amount}
                  onChange={(e) =>
                    setForm({ ...form, payment2Amount: e.target.value })
                  }
                  placeholder="Örn: 149 €"
                />
              </div>
              <div>
                <label className="form-label text-[11px]">
                  Stripe Payment Link URL
                </label>
                <input
                  type="url"
                  className="form-input"
                  value={form.payment2Url}
                  onChange={(e) =>
                    setForm({ ...form, payment2Url: e.target.value })
                  }
                  placeholder="https://buy.stripe.com/..."
                />
              </div>
            </div>
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
            <label className="form-label">
              Bakım Modu Mesajı
            </label>
            <textarea
              className="form-textarea"
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
            className="btn-primary"
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



