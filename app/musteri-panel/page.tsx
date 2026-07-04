import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { verifyCustomerSessionToken } from '@/lib/auth/customerSession';
import { getLocalCustomerById } from '@/lib/admin/localCustomersStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const metadata: Metadata = {
  title: 'Müşteri Paneli',
};

export default async function MusteriPanelPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('customer_session')?.value;

  if (!token) {
    redirect('/musteri-giris');
  }

  const parsed = verifyCustomerSessionToken(token);
  if (!parsed.ok || !parsed.customerId) {
    redirect('/musteri-giris');
  }

  let customer:
    | {
        id: string;
        fullName: string;
        email: string;
        stripePaymentLinkUrl: string | null;
        createdAt: string;
      }
    | null = null;

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('customer_accounts')
      .select(
        'id, created_at, full_name, email, username, stripe_payment_link_url',
      )
      .eq('id', parsed.customerId)
      .maybeSingle();

    if (error || !data) {
      throw error ?? new Error('Müşteri bulunamadı');
    }

    customer = {
      id: data.id as string,
      fullName: data.full_name as string,
      email: data.email as string,
      stripePaymentLinkUrl:
        (data as any).stripe_payment_link_url ?? null,
      createdAt: data.created_at as string,
    };
  } catch {
    const localCustomer = getLocalCustomerById(parsed.customerId);
    if (localCustomer) {
      customer = {
        id: localCustomer.id,
        fullName: localCustomer.fullName,
        email: localCustomer.email,
        stripePaymentLinkUrl: localCustomer.stripePaymentLinkUrl,
        createdAt: localCustomer.createdAt,
      };
    }
  }

  if (!customer) {
    redirect('/musteri-giris');
  }

  return (
    <main className="min-h-screen bg-slate-950/95 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/70">
          <h1 className="text-xl font-semibold text-slate-50">
            Merhaba, {customer.fullName}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Bu alan sizin için oluşturulan özel müşteri panelidir. Aşağıda
            çalışma sürecinde kullanacağınız ödeme linkini bulabilirsiniz.
          </p>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Ödeme Linkiniz
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Bu link Stripe üzerinden güvenli ödeme yapmanız için
              hazırlanmıştır. Ödeme tutarı ve detayları ekip tarafından
              tanımlanır.
            </p>

            {customer.stripePaymentLinkUrl ? (
              <a
                href={customer.stripePaymentLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-50 shadow-lg shadow-emerald-900/60 transition hover:bg-emerald-600"
              >
                Stripe Üzerinden Ödeme Yap
              </a>
            ) : (
              <p className="mt-3 rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                Sizin için tanımlanmış bir ödeme linki henüz görünmüyor. Lütfen
                ekibimizle iletişime geçin.
              </p>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-[11px] text-slate-400">
            <p>
              Hesap bilgileri:{' '}
              <span className="font-mono text-slate-300">
                {customer.email}
              </span>
            </p>
            <p className="mt-1">
              Hesabınız{' '}
              {new Date(customer.createdAt).toLocaleString('tr-TR')} tarihinde
              oluşturulmuştur.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
