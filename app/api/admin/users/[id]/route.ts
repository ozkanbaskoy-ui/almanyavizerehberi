import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  isCrmUserRole,
  isCrmUserStatus,
} from '@/lib/admin/crmUserModel';
import {
  deleteLocalCrmUser,
  updateLocalCrmUser,
} from '@/lib/admin/localCrmUsersStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdminSession() {
  if (!ADMIN_PASSWORD) return true;

  const cookieStore = await cookies();
  const session = cookieStore.get('admin_logged_in')?.value;
  return session === '1';
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateBody = {
  role?: string;
  status?: string;
  twoFactorEnabled?: boolean;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as UpdateBody;
  const role = body.role?.trim();
  const status = body.status?.trim();
  const twoFactorEnabled =
    typeof body.twoFactorEnabled === 'boolean'
      ? body.twoFactorEnabled
      : undefined;

  if (!role && !status && typeof twoFactorEnabled !== 'boolean') {
    return NextResponse.json(
      { error: 'Güncellenecek kullanıcı alanı gönderilmedi.' },
      { status: 400 },
    );
  }

  if (role && !isCrmUserRole(role)) {
    return NextResponse.json(
      { error: 'Geçersiz CRM kullanıcı rolü.' },
      { status: 400 },
    );
  }

  if (status && !isCrmUserStatus(status)) {
    return NextResponse.json(
      { error: 'Geçersiz kullanıcı durumu.' },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const updateFields: Record<string, string | boolean> = {};
    if (role) updateFields.role = role;
    if (status) updateFields.status = status;
    if (typeof twoFactorEnabled === 'boolean') {
      updateFields.two_factor_enabled = twoFactorEnabled;
    }

    const { data, error } = await supabase
      .from('crm_users')
      .update(updateFields)
      .eq('id', id)
      .select(
        'id, created_at, full_name, email, username, role, status, last_login_at, two_factor_enabled',
      )
      .single();

    if (error || !data) {
      throw error ?? new Error('Kullanıcı güncellenemedi.');
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: data.id,
        createdAt: data.created_at,
        fullName: data.full_name,
        email: data.email,
        username: data.username,
        role: data.role,
        status: data.status,
        lastLoginAt: data.last_login_at ?? null,
        twoFactorEnabled: Boolean(data.two_factor_enabled),
      },
    });
  } catch (err) {
    try {
      const user = updateLocalCrmUser(id, {
        role: role as never,
        status: status as never,
        twoFactorEnabled,
      });

      return NextResponse.json({ ok: true, storage: 'local', user });
    } catch (localErr) {
      return NextResponse.json(
        {
          error:
            localErr instanceof Error
              ? localErr.message
              : err instanceof Error
                ? err.message
                : 'CRM kullanıcısı güncellenirken bir hata oluştu.',
        },
        { status: 500 },
      );
    }
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('crm_users').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    try {
      deleteLocalCrmUser(id);
      return NextResponse.json({ ok: true, storage: 'local' });
    } catch (localErr) {
      return NextResponse.json(
        {
          error:
            localErr instanceof Error
              ? localErr.message
              : err instanceof Error
                ? err.message
                : 'CRM kullanıcısı silinirken bir hata oluştu.',
        },
        { status: 500 },
      );
    }
  }
}
