import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { verifyCustomerSessionToken } from '@/lib/auth/customerSession';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const metadata: Metadata = {
  title: 'Musteri Paneli',
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
      throw error ?? new Error('Musteri bulunamadi');
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
    // Supabase ayarisinda bir sorun varsa guvenli tarafta kalarak tekrar girise yonlendir.
    redirect('/musteri-giris');
  }

  if (!customer) {
    redirect('/musteri-giris');
  }

  return (
    <main className="min-h-screen bg-slate-950/95 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/70">
          <h1 className="text-xl font-semibold text-slate-50">
            Merhaba, {customer.fullName}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Bu alan sizin icin olusturulan ozel musteri panelidir. Asagida
            AVR Global ile calisma surecinde kullanacaginiz odeme linkini
            bulabilirsiniz.
          </p>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Odeme Linkiniz
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Bu link Stripe uzerinden guvenli odeme yapmaniz icin
              hazirlanmistir. Odeme tutari ve detaylari AVR Global tarafindan
              Stripe panelinde tanimlanmistir.
            </p>

            {customer.stripePaymentLinkUrl ? (
              <a
                href={customer.stripePaymentLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-50 shadow-lg shadow-emerald-900/60 transition hover:bg-emerald-600"
              >
                Stripe Uzerinden Odeme Yap
              </a>
            ) : (
              <p className="mt-3 rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                Sizin icin tanimlanmis bir odeme linki henuz gorunmuyor. Lutfen
                AVR Global ekibiyle iletisime gecin.
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
              Hesabiniz{' '}
              {new Date(customer.createdAt).toLocaleString('tr-TR')} tarihinde
              olusturulmustur.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

