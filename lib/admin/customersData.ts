import { getSupabaseServerClient } from '@/lib/db/supabaseServer';
import { getLocalCustomers } from '@/lib/admin/localCustomersStore';

export type CustomerRecord = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  username: string;
  stripePaymentLinkUrl: string | null;
};

// Admin ekranları için müşteri listesi çeker.
// Supabase yoksa lokal geliştirme deposu kullanılır.
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
      throw error ?? new Error('Boş sonuç');
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
    return getLocalCustomers();
  }
}
