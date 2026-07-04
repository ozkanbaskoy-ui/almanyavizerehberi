'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUS_OPTIONS = [
  { value: 'yeni', label: 'Yeni' },
  { value: 'incelemede', label: 'İncelemede' },
  { value: 'evrak-bekleniyor', label: 'Evrak Bekleniyor' },
  { value: 'odeme-bekleniyor', label: 'Ödeme Bekleniyor' },
  { value: 'tamamlandi', label: 'Tamamlandı' },
  { value: 'reddedildi', label: 'Reddedildi' },
];

const PAYMENT_OPTIONS = [
  { value: 'bekliyor', label: 'Bekliyor' },
  { value: 'odendi', label: 'Ödendi' },
  { value: 'iade-edildi', label: 'İade Edildi' },
];

const EVENT_OPTIONS = [
  { value: 'not', label: 'Genel Not' },
  { value: 'telefon-gorusmesi', label: 'Telefon Görüşmesi' },
  { value: 'mail-gonderildi', label: 'E-posta' },
  { value: 'evrak', label: 'Evrak' },
  { value: 'randevu', label: 'Randevu' },
  { value: 'gorev', label: 'Görev' },
  { value: 'odeme', label: 'Ödeme' },
];

type ApplicationActionsProps = {
  applicationId: string;
  initialStatus: string;
  initialPaymentStatus: string;
};

export function ApplicationActions({
  applicationId,
  initialStatus,
  initialPaymentStatus,
}: ApplicationActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [eventType, setEventType] = useState('not');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentStatus,
          eventType,
          note,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(
          data.error || 'Başvuru güncellenirken bir hata oluştu.',
        );
      }

      setNote('');
      setEventType('not');
      setSuccess('Başvuru güncellendi.');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel space-y-4 p-5"
    >
      <div>
        <h2 className="form-label">
          CRM İşlemleri
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Lead durumunu güncelleyin veya zaman tüneline yeni not ekleyin.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="form-field">
          <label className="form-label">
            Başvuru Durumu
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">
            Ödeme Durumu
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="form-select"
          >
            {PAYMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="form-field">
          <label className="form-label">
            Aktivite Türü
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="form-select"
          >
            {EVENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">
            Aktivite / Not
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="form-textarea"
            placeholder="Görüşme notu, eksik evrak, randevu veya takip bilgisi ekleyin."
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        {success && <p className="text-xs text-emerald-600">{success}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </form>
  );
}
