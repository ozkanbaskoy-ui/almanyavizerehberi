import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { hashPassword } from '@/lib/auth/customerPasswords';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdminSession() {
  // Gelistirme kolayligi icin admin sifresi tanimli degilse kontrol etmeyiz.
  if (!ADMIN_PASSWORD) return true;

  const cookieStore = await cookies();
  const session = cookieStore.get('admin_logged_in')?.value;
  return session === '1';
}

export async function GET() {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lutfen tekrar yonetici girisi yapin.' },
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
      throw error ?? new Error('Bos sonuc');
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
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Musteri listesi getirilirken bir hata olustu.',
      },
      { status: 500 },
    );
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
      { error: 'Yetkisiz istek. Lutfen tekrar yonetici girisi yapin.' },
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
          'Ad soyad, e-posta, kullanici adi ve sifre alanlari zorunludur.',
      },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();

    const { salt, hash } = hashPassword(password);

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
      throw error ?? new Error('Kayit eklenemedi');
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
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Musteri olusturulurken bir hata olustu.',
      },
      { status: 500 },
    );
  }
}

