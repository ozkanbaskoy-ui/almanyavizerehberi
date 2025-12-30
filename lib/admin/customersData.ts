import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export type CustomerRecord = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  username: string;
  stripePaymentLinkUrl: string | null;
};

// Admin ekranlari icin musteri listesi ceker.
// Supabase yapilandirilamadiysa veya tablo yoksa bos liste dondururuz ve
// arayuzde aciklayici mesaj gosteririz.
export async function fetchCustomers(): Promise<CustomerRecord[]> {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('customer_accounts')
      .select(
        'id, created_at, full_name, email, username, stripe_payment_link_url',
      )
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) {
      throw error ?? new Error('Bos sonuc');
    }

    return data.map((row) => ({
      id: row.id as string,
      createdAt: row.created_at as string,
      fullName: row.full_name as string,
      email: row.email as string,
      username: row.username as string,
      stripePaymentLinkUrl: (row as any).stripe_payment_link_url ?? null,
    }));
  } catch {
    return [];
  }
}

