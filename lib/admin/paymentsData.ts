import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export type PaymentRecord = {
  id: string;
  createdAt: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string | null;
  applicationId: string | null;
};

export type PaymentStats = {
  totalRevenue: number;
  last30DaysRevenue: number;
  paymentsCount: number;
  lastPaymentAt: string | null;
};

// Stripe + Supabase yapilandirilmazsa null dondururuz ki
// admin arayuzunde aciklayici bir mesaj gosterilebilsin.
export async function fetchPaymentStats(): Promise<PaymentStats | null> {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('payments')
      .select('amount, currency, created_at, status')
      .order('created_at', { ascending: false });

    if (error || !data) {
      throw error ?? new Error('Bos sonuc');
    }

    if (!data.length) {
      return {
        totalRevenue: 0,
        last30DaysRevenue: 0,
        paymentsCount: 0,
        lastPaymentAt: null,
      };
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000,
    );

    let totalRevenue = 0;
    let last30DaysRevenue = 0;
    let paymentsCount = 0;
    let lastPaymentAt: string | null = null;

    for (const row of data) {
      // Sadece basarili/success odemeleri ciroya dahil ediyoruz
      if (row.status !== 'succeeded' && row.status !== 'paid') continue;

      const createdAt = new Date(row.created_at);
      const amount = Number(row.amount ?? 0);

      totalRevenue += amount;
      paymentsCount += 1;

      if (createdAt >= thirtyDaysAgo) {
        last30DaysRevenue += amount;
      }

      if (!lastPaymentAt) {
        lastPaymentAt = row.created_at as string;
      }
    }

    return {
      totalRevenue,
      last30DaysRevenue,
      paymentsCount,
      lastPaymentAt,
    };
  } catch {
    return null;
  }
}

export async function fetchRecentPayments(
  limit = 20,
): Promise<PaymentRecord[] | null> {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('payments')
      .select(
        'id, created_at, amount, currency, status, customer_email, application_id',
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      throw error ?? new Error('Bos sonuc');
    }

    return data.map((row) => ({
      id: row.id as string,
      createdAt: row.created_at as string,
      amount: Number(row.amount ?? 0),
      currency: (row.currency as string) ?? 'eur',
      status: (row.status as string) ?? 'unknown',
      customerEmail: (row.customer_email as string | null) ?? null,
      applicationId: (row.application_id as string | null) ?? null,
    }));
  } catch {
    return null;
  }
}

