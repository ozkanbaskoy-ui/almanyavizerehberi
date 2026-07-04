import { getLocalCrmUsers } from '@/lib/admin/localCrmUsersStore';
import type { CrmUserRecord } from '@/lib/admin/crmUserModel';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export async function fetchCrmUsers(): Promise<CrmUserRecord[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('crm_users')
      .select(
        'id, created_at, full_name, email, username, role, status, last_login_at, two_factor_enabled',
      )
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) {
      throw error ?? new Error('Boş sonuç');
    }

    return data.map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      fullName: row.full_name,
      email: row.email,
      username: row.username,
      role: row.role,
      status: row.status,
      lastLoginAt: row.last_login_at ?? null,
      twoFactorEnabled: Boolean(row.two_factor_enabled),
    }));
  } catch {
    return getLocalCrmUsers();
  }
}
