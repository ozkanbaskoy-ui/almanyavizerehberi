import type { Metadata } from 'next';

import { fetchCrmUsers } from '@/lib/admin/crmUsersData';
import {
  getRoleLabel,
  getStatusLabel,
} from '@/lib/admin/crmUserModel';
import { CrmUserActions } from './CrmUserActions';
import { NewCrmUserForm } from './NewCrmUserForm';

export const metadata: Metadata = {
  title: 'CRM Kullanıcıları',
};

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  suspended: 'bg-slate-100 text-slate-600',
};

export default async function AdminUsersPage() {
  const users = await fetchCrmUsers();
  const activeUsers = users.filter((user) => user.status === 'active').length;

  return (
    <main className="admin-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="admin-page-title">CRM Kullanıcıları</h1>
          <p className="admin-page-subtitle">
            İç ekip kullanıcılarını, rollerini ve CRM erişim durumlarını bu
            bölümden yönetin. Müşteri hesapları ayrı ekranda tutulur.
          </p>
        </div>
        <div className="metric-card min-w-44">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Aktif Kullanıcı
          </p>
          <p className="mt-2 text-2xl font-semibold text-brand-base">
            {activeUsers}
          </p>
        </div>
      </div>

      <NewCrmUserForm />

      <section className="panel mt-8 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-950">
              Kullanıcı Listesi
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              En fazla son 200 CRM kullanıcısı gösterilir.
            </p>
          </div>
        </div>

        {users.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Henüz CRM kullanıcısı yok. İlk kullanıcıyı yukarıdaki formdan
            oluşturabilirsiniz.
          </p>
        ) : (
          <div className="table-shell mt-4">
            <table className="admin-table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Kullanıcı
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Kullanıcı Adı
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Rol
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Durum
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    2FA
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Son Giriş
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2">
                      <div className="font-semibold text-slate-950">
                        {user.fullName}
                      </div>
                      <a
                        href={`mailto:${user.email}`}
                        className="mt-1 block text-xs text-slate-600 hover:text-brand-base"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-700">
                      {user.username}
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-700">
                      {getRoleLabel(user.role)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`status-badge ${
                          STATUS_STYLES[user.status] ??
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-slate-700">
                      {user.twoFactorEnabled ? 'Açık' : 'Kapalı'}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString('tr-TR')
                        : 'Henüz giriş yok'}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <CrmUserActions
                        userId={user.id}
                        initialRole={user.role}
                        initialStatus={user.status}
                        initialTwoFactorEnabled={user.twoFactorEnabled}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
