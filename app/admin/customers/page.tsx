import type { Metadata } from 'next';

import { fetchCustomers } from '@/lib/admin/customersData';
import { NewCustomerForm } from './NewCustomerForm';

export const metadata: Metadata = {
  title: 'Musteriler',
};

export default async function AdminCustomersPage() {
  const customers = await fetchCustomers();

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-50">Musteriler</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-300">
        Buradan musteri hesaplari olusturup her musterinin Stripe odeme
        linkini kaydedebilirsiniz. Musteriler, kendilerine tanimlanan kullanici
        adi ve sifre ile musteri giris sayfasindan giris yapip kendi odeme
        linklerini gorecekler.
      </p>

      <NewCustomerForm supabaseConfigured={supabaseConfigured} />

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <h2 className="text-sm font-semibold text-slate-100">
          Mevcut Musteriler
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          En fazla son 200 kayit gosterilir. Daha gelismis filtreleme ve arama
          ozellikleri ileride eklenebilir.
        </p>

        {customers.length === 0 ? (
          <p className="mt-4 text-xs text-slate-400">
            Henuz kayitli musteri bulunmuyor ya da Supabase tablo/ortam
            ayarlari tamamlanmadi. Supabase SQL editorunde{' '}
            <code className="rounded bg-slate-800 px-1 py-0.5">
              supabase/customers.sql
            </code>{' '}
            icerigini calistirdiginizdan emin olun.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-xs text-slate-100">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="px-3 py-2 text-left font-semibold">
                    Musteri
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    E-posta
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Kullanici Adi
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Stripe Linki
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Olusturulma
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-900/70 hover:bg-slate-900/70"
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-50">
                        {c.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400">
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
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/20"
                        >
                          Stripe Linkini Ac
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Tanimlanmamis
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-slate-400">
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

