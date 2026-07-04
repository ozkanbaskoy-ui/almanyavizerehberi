import type { Metadata } from 'next';

import { CRM_USER_ROLES } from '@/lib/admin/crmUserModel';

export const metadata: Metadata = {
  title: 'Roller ve İzinler',
};

const ROLE_MATRIX: Record<
  string,
  {
    scope: string;
    permissions: string[];
    risk: string;
  }
> = {
  super_admin: {
    scope: 'Tüm sistem, admin, CRM, kullanıcı ve güvenlik ayarları',
    permissions: [
      'Tüm kayıtları okuma/yazma',
      'Rol ve kullanıcı yönetimi',
      'Sistem ayarları ve audit log',
      'Kritik silme/geri alma işlemleri',
    ],
    risk: 'Çok yüksek',
  },
  admin: {
    scope: 'Admin panel, içerik, CRM izleme ve genel operasyon',
    permissions: [
      'İçerik ve site ayarları',
      'Lead ve müşteri kayıtları',
      'CRM kullanıcılarını yönetme',
      'E-posta şablonları',
    ],
    risk: 'Yüksek',
  },
  crm_manager: {
    scope: 'Tüm CRM dosyaları, atama ve performans takibi',
    permissions: [
      'Tüm leadleri görme',
      'Dosya atama',
      'Pipeline ve raporlar',
      'Görev ve not yönetimi',
    ],
    risk: 'Orta',
  },
  case_advisor: {
    scope: 'Kendine atanan başvuru ve dosyalar',
    permissions: [
      'Atanan leadleri görme',
      'Not ve görev ekleme',
      'Müşteriyle iletişim',
      'Dosya durum önerisi',
    ],
    risk: 'Orta',
  },
  document_reviewer: {
    scope: 'Evrak kuyruğu ve belge inceleme',
    permissions: [
      'Belge görüntüleme',
      'Belge durum güncelleme',
      'Eksik evrak işaretleme',
      'Gizli not ekleme',
    ],
    risk: 'Orta',
  },
  finance: {
    scope: 'Ödeme, randevu ve finansal takip',
    permissions: [
      'Ödeme kayıtlarını görme',
      'Ödeme durum güncelleme',
      'Randevu/finans raporları',
      'Finans notu ekleme',
    ],
    risk: 'Orta',
  },
  readonly: {
    scope: 'Sadece okuma ve rapor izleme',
    permissions: [
      'Kayıtları görüntüleme',
      'Raporları izleme',
      'Veri değiştirememe',
      'Dışa aktarma yok',
    ],
    risk: 'Düşük',
  },
};

const SUPABASE_POLICIES = [
  'profiles: kullanıcı kendi profilini, yöneticiler tüm profilleri görür.',
  'applications: public form sadece insert yapar; CRM rolleri select/update yapar.',
  'visa_cases: danışman sadece kendine atanan dosyaları, manager tüm dosyaları görür.',
  'documents: private bucket; signed URL ve RLS dışında dosya erişimi yoktur.',
  'audit_logs: sadece admin, super_admin ve crm_manager okuyabilir.',
];

export default function AdminRolesPage() {
  return (
    <main className="admin-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="admin-page-title">Roller ve İzinler</h1>
          <p className="admin-page-subtitle">
            Admin ve CRM kullanıcılarının görev alanlarını, yetki sınırlarını
            ve Supabase RLS karşılıklarını tek ekranda yönetin.
          </p>
        </div>
        <a href="/admin/users" className="btn-primary">
          Kullanıcı Yönetimi
        </a>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tanımlı Rol
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {CRM_USER_ROLES.length}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Kritik Rol
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            2
          </p>
        </div>
        <div className="metric-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            RLS Durumu
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            Tasarlandı
          </p>
        </div>
      </section>

      <section className="panel mt-6 p-4">
        <div className="table-shell border-0 shadow-none">
          <table className="admin-table">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Rol
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Kapsam
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  İzinler
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {CRM_USER_ROLES.map((role) => {
                const row = ROLE_MATRIX[role.value];
                return (
                  <tr key={role.value} className="border-t border-slate-100">
                    <td className="px-3 py-3">
                      <div className="font-semibold text-slate-950">
                        {role.label}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-slate-500">
                        {role.value}
                      </div>
                    </td>
                    <td className="max-w-xs px-3 py-3 text-sm text-slate-700">
                      {row.scope}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        {row.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-slate-700">
                      {row.risk}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel mt-6 p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Supabase RLS Politikaları
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {SUPABASE_POLICIES.map((policy) => (
            <div
              key={policy}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              {policy}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
