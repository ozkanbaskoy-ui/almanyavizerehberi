import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { hashPassword } from '@/lib/auth/customerPasswords';
import {
  getLocalCustomers,
  saveLocalCustomer,
} from '@/lib/admin/localCustomersStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdminSession() {
  // Geliştirme kolaylığı için admin şifresi tanımlı değilse kontrol etmeyiz.
  if (!ADMIN_PASSWORD) return true;

  const cookieStore = await cookies();
  const session = cookieStore.get('admin_logged_in')?.value;
  return session === '1';
}

export async function GET() {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

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

    return NextResponse.json({
      ok: true,
      customers: data.map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        fullName: row.full_name,
        email: row.email,
        username: row.username,
        stripePaymentLinkUrl: (row as any).stripe_payment_link_url ?? null,
      })),
    });
  } catch {
    return NextResponse.json({
      ok: true,
      storage: 'local',
      customers: getLocalCustomers(),
    });
  }
}

type CreateBody = {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  stripePaymentLinkUrl?: string;
};

export async function POST(request: Request) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  let body: CreateBody;
  try {
    body = (await request.json().catch(() => ({}))) as CreateBody;
  } catch {
    body = {};
  }

  const fullName = body.fullName?.trim();
  const email = body.email?.trim();
  const username = body.username?.trim();
  const password = body.password ?? '';
  const stripePaymentLinkUrl = body.stripePaymentLinkUrl?.trim() || null;

  if (!fullName || !email || !username || !password) {
    return NextResponse.json(
      {
        error:
          'Ad soyad, e-posta, kullanıcı adı ve şifre alanları zorunludur.',
      },
      { status: 400 },
    );
  }

  const { salt, hash } = hashPassword(password);

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('customer_accounts')
      .insert({
        full_name: fullName,
        email,
        username,
        password_hash: hash,
        password_salt: salt,
        stripe_payment_link_url: stripePaymentLinkUrl,
      })
      .select(
        'id, created_at, full_name, email, username, stripe_payment_link_url',
      )
      .single();

    if (error || !data) {
      throw error ?? new Error('Kayıt eklenemedi');
    }

    return NextResponse.json({
      ok: true,
      customer: {
        id: data.id,
        createdAt: data.created_at,
        fullName: data.full_name,
        email: data.email,
        username: data.username,
        stripePaymentLinkUrl:
          (data as any).stripe_payment_link_url ?? stripePaymentLinkUrl,
      },
    });
  } catch (err) {
    try {
      const customer = saveLocalCustomer({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        fullName,
        email,
        username,
        stripePaymentLinkUrl,
        passwordHash: hash,
        passwordSalt: salt,
      });

      return NextResponse.json({
        ok: true,
        storage: 'local',
        customer: {
          id: customer.id,
          createdAt: customer.createdAt,
          fullName: customer.fullName,
          email: customer.email,
          username: customer.username,
          stripePaymentLinkUrl: customer.stripePaymentLinkUrl,
        },
      });
    } catch (localErr) {
      return NextResponse.json(
        {
          error:
            localErr instanceof Error
              ? localErr.message
              : err instanceof Error
                ? err.message
                : 'Müşteri oluşturulurken bir hata oluştu.',
        },
        { status: 500 },
      );
    }
  }
}
