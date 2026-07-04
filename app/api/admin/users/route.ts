import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { hashPassword } from '@/lib/auth/customerPasswords';
import { fetchCrmUsers } from '@/lib/admin/crmUsersData';
import {
  isCrmUserRole,
  isCrmUserStatus,
} from '@/lib/admin/crmUserModel';
import { saveLocalCrmUser } from '@/lib/admin/localCrmUsersStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdminSession() {
  if (!ADMIN_PASSWORD) return true;

  const cookieStore = await cookies();
  const session = cookieStore.get('admin_logged_in')?.value;
  return session === '1';
}

type CreateBody = {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  status?: string;
};

export async function GET() {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  const users = await fetchCrmUsers();
  return NextResponse.json({ ok: true, users });
}

export async function POST(request: Request) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as CreateBody;
  const fullName = body.fullName?.trim();
  const email = body.email?.trim();
  const username = body.username?.trim();
  const password = body.password ?? '';
  const role = body.role?.trim() || 'case_advisor';
  const status = body.status?.trim() || 'active';

  if (!fullName || !email || !username || !password) {
    return NextResponse.json(
      {
        error:
          'Ad soyad, e-posta, kullanıcı adı ve geçici şifre alanları zorunludur.',
      },
      { status: 400 },
    );
  }

  if (!isCrmUserRole(role)) {
    return NextResponse.json(
      { error: 'Geçersiz CRM kullanıcı rolü.' },
      { status: 400 },
    );
  }

  if (!isCrmUserStatus(status)) {
    return NextResponse.json(
      { error: 'Geçersiz kullanıcı durumu.' },
      { status: 400 },
    );
  }

  const { salt, hash } = hashPassword(password);

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('crm_users')
      .insert({
        full_name: fullName,
        email,
        username,
        password_hash: hash,
        password_salt: salt,
        role,
        status,
        two_factor_enabled: false,
      })
      .select(
        'id, created_at, full_name, email, username, role, status, last_login_at, two_factor_enabled',
      )
      .single();

    if (error || !data) {
      throw error ?? new Error('Kayıt eklenemedi');
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
      const user = saveLocalCrmUser({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        fullName,
        email,
        username,
        role,
        status,
        lastLoginAt: null,
        twoFactorEnabled: false,
        passwordHash: hash,
        passwordSalt: salt,
      });

      const {
        passwordHash: _passwordHash,
        passwordSalt: _passwordSalt,
        ...safeUser
      } = user;

      return NextResponse.json({
        ok: true,
        storage: 'local',
        user: safeUser,
      });
    } catch (localErr) {
      return NextResponse.json(
        {
          error:
            localErr instanceof Error
              ? localErr.message
              : err instanceof Error
                ? err.message
                : 'CRM kullanıcısı oluşturulurken bir hata oluştu.',
        },
        { status: 500 },
      );
    }
  }
}
