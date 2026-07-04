import Link from 'next/link';

import { fetchCustomers } from '@/lib/admin/customersData';

export const metadata = {
  title: 'CRM Müşteri Profilleri',
};

export default async function CrmCustomersPage() {
  const customers = await fetchCustomers();

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
            Müşteri Merkezi
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Müşteri Profilleri
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Müşteri hesapları, ödeme linkleri ve ileride evrak portalı
            bağlantıları bu alanda izlenecek.
          </p>
        </div>
        <Link href="/admin/customers" className="btn-primary">
          Müşteri Oluştur
        </Link>
      </div>

      <section className="panel mt-6 p-5">
        {customers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Henüz müşteri hesabı yok.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <h2 className="font-semibold text-slate-950">
                  {customer.fullName}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {customer.email}
                </p>
                <p className="mt-3 font-mono text-xs text-slate-600">
                  {customer.username}
                </p>
                {customer.stripePaymentLinkUrl && (
                  <a
                    href={customer.stripePaymentLinkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    Ödeme Linki
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
