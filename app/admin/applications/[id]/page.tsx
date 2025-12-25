import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  fetchApplicationById,
  fetchApplicationEvents,
} from '@/lib/admin/applicationsData';

type PageProps = {
  params: { id: string };
};

export default async function AdminApplicationDetailPage({
  params,
}: PageProps) {
  const app = await fetchApplicationById(params.id);
  if (!app) {
    return notFound();
  }

  const events = await fetchApplicationEvents(app.id);

  return (
    <main className="mx-auto max-w-[960px] px-4 py-8">
      <Link
        href="/admin/applications"
        className="text-xs font-semibold text-brand-base hover:text-brand-light"
      >
        ← Başvuru listesine dön
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        Başvuru Detayı
      </h1>
      <p className="mt-1 text-xs text-slate-500">
        Supabase yapılandırıldıysa bu ekrandaki bilgiler gerçek başvuru
        kayıtlarından gelir. Aksi halde örnek (mock) veri kullanılır.
      </p>

      <section className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Başvuru Bilgileri
          </h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Başvuru ID</dt>
              <dd className="font-mono text-xs text-slate-800">
                {app.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Oluşturulma</dt>
              <dd className="text-slate-800">
                {new Date(app.createdAt).toLocaleString('tr-TR')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Ad Soyad</dt>
              <dd className="text-slate-800">{app.fullName}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">E-posta</dt>
              <dd className="text-slate-800">{app.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Telefon</dt>
              <dd className="text-slate-800">{app.phone}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Vize Türü</dt>
              <dd className="text-slate-800">{app.visaType}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Durum</dt>
              <dd className="text-slate-800">{app.status}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Ödeme</dt>
              <dd className="text-slate-800">{app.paymentStatus}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Hızlı İşlemler
          </h2>
          <p className="text-xs text-slate-500">
            Bu alan ileride statü güncelleme, not ekleme ve e-posta
            tetikleme butonları için kullanılacak.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Zaman Tüneli
        </h2>
        {events.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Bu başvuru için henüz bir log kaydı yok.
          </p>
        ) : (
          <ol className="mt-4 space-y-3 text-sm">
            {events.map((event) => (
              <li key={event.id} className="border-l border-slate-200 pl-3">
                <p className="text-xs text-slate-500">
                  {new Date(event.createdAt).toLocaleString('tr-TR')} ·{' '}
                  {event.type}
                </p>
                <p className="text-slate-800">{event.message}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

