import Link from 'next/link';

import { fetchApplications } from '@/lib/admin/applicationsData';
import { fetchUpcomingAppointments } from '@/lib/admin/appointmentsData';
import { getSiteSettings } from '@/lib/settings/site';

export const metadata = {
  title: 'CRM Randevular',
};

export default async function CrmCalendarPage() {
  const site = getSiteSettings();
  const [appointments, applications] = await Promise.all([
    fetchUpcomingAppointments(30),
    fetchApplications(),
  ]);

  const followUps = applications
    .filter((app) => app.status !== 'tamamlandi' && app.status !== 'reddedildi')
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-[1280px]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
        Takvim
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">
        Randevu ve Takip Planı
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
        Google Calendar randevu akışı, açık dosya takipleri ve görüşme
        hazırlıkları CRM içinde tek takvim yüzeyinde izlenir.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Yaklaşan Randevu
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {appointments?.length ?? 0}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Açık Takip
          </p>
          <p className="mt-2 text-2xl font-semibold text-brand-base">
            {followUps.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Kaynak
          </p>
          {site.calendlyUrl ? (
            <a
              href={site.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-2xl font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Google
            </a>
          ) : (
            <p className="mt-2 text-2xl font-semibold text-amber-600">
              Eksik
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Yaklaşan Randevular
          </h2>
          <div className="mt-4 space-y-3">
            {!appointments ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Google Calendar randevu linki aktifse randevu alma işlemi
                başvuru sayfasında çalışır. CRM içinde otomatik randevu listesi
                için ayrıca takvim senkronizasyon tablosu bağlanabilir.
              </p>
            ) : appointments.length === 0 ? (
              <p className="text-sm text-slate-500">
                Yaklaşan randevu bulunamadı.
              </p>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">
                        {appointment.inviteeName || 'İsimsiz randevu'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {appointment.inviteeEmail || 'E-posta yok'} ·{' '}
                        {appointment.eventType || 'Görüşme'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-blue-700">
                      {new Date(appointment.scheduledAt).toLocaleString(
                        'tr-TR',
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="panel p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Takip Gereken Dosyalar
          </h2>
          <div className="mt-4 space-y-3">
            {followUps.length === 0 ? (
              <p className="text-sm text-slate-500">
                Takip bekleyen açık dosya yok.
              </p>
            ) : (
              followUps.map((app) => (
                <Link
                  key={app.id}
                  href={`/crm/leads/${app.id}`}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-blue-300"
                >
                  <p className="font-semibold text-slate-950">
                    {app.fullName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {app.visaType} · {app.status}
                  </p>
                </Link>
              ))
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
