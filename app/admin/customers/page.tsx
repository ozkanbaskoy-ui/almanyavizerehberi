import type { Metadata } from 'next';

import { fetchCustomers } from '@/lib/admin/customersData';
import { NewCustomerForm } from './NewCustomerForm';

export const metadata: Metadata = {
  title: 'Müşteriler',
};

export default async function AdminCustomersPage() {
  const customers = await fetchCustomers();

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <main className="admin-page">
      <h1 className="admin-page-title">Müşteriler</h1>
      <p className="admin-page-subtitle">
        Buradan müşteri hesabı oluşturup her müşterinin Stripe ödeme linkini
        kaydedebilirsiniz. Müşteriler kendilerine tanımlanan kullanıcı adı ve
        şifre ile müşteri paneline giriş yapar.
      </p>

      <NewCustomerForm supabaseConfigured={supabaseConfigured} />

      <section className="panel mt-8 p-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Mevcut Müşteriler
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          En fazla son 200 kayıt gösterilir.
        </p>

        {customers.length === 0 ? (
          <p className="mt-4 text-xs text-slate-400">
            Henüz kayıtlı müşteri bulunmuyor. Supabase yoksa yeni kayıtlar
            lokal geliştirme deposuna yazılır.
            <code className="ml-1 rounded bg-slate-100 px-1 py-0.5">
              supabase/customers.sql
            </code>
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-3 py-2 text-left font-semibold">
                    Müşteri
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    E-posta
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Kullanıcı Adı
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Stripe Linki
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Oluşturulma
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-950">
                        {c.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {c.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-3 py-2">{c.email}</td>
                    <td className="px-3 py-2">{c.username}</td>
                    <td className="px-3 py-2">
                      {c.stripePaymentLinkUrl ? (
                        <a
                          href={c.stripePaymentLinkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="status-badge bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          Stripe Linkini Aç
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Tanımlanmamış
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-slate-500">
                      {new Date(c.createdAt).toLocaleString('tr-TR')}
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
