import { NextResponse } from 'next/server';

import { verifyPassword } from '@/lib/auth/customerPasswords';
import { createCustomerSessionToken } from '@/lib/auth/customerSession';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

type Body = {
  identifier?: string; // kullanici adi veya e-posta
  password?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json().catch(() => ({}))) as Body;
  } catch {
    body = {};
  }

  const identifier = body.identifier?.trim();
  const password = body.password ?? '';

  if (!identifier || !password) {
    return NextResponse.json(
      { error: 'Lutfen kullanici adi/e-posta ve sifre girin.' },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();

    // Once username ile ariyoruz, bulunamazsa e-posta ile tekrar deneriz.
    const selectColumns =
      'id, full_name, email, username, password_hash, password_salt, stripe_payment_link_url';

    let { data, error } = await supabase
      .from('customer_accounts')
      .select(selectColumns)
      .eq('username', identifier)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      const res2 = await supabase
        .from('customer_accounts')
        .select(selectColumns)
        .eq('email', identifier)
        .maybeSingle();

      data = res2.data;
      if (res2.error) {
        throw res2.error;
      }
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Kullanici bulunamadi.' },
        { status: 401 },
      );
    }

    const ok = verifyPassword(
      password,
      (data as any).password_salt,
      (data as any).password_hash,
    );

    if (!ok) {
      return NextResponse.json(
        { error: 'Hatali sifre.' },
        { status: 401 },
      );
    }

    const token = createCustomerSessionToken(data.id as string);

    const res = NextResponse.json({
      ok: true,
      customer: {
        id: data.id,
        fullName: data.full_name,
      },
    });

    // Dev ortamda cookie'nin calismasi icin secure bayragini sadece prod'da aciyoruz.
    const secure =
      process.env.NODE_ENV === 'production' ? true : false;

    res.cookies.set('customer_session', token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 gun
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Giris yapilirken bir hata olustu.',
      },
      { status: 500 },
    );
  }
}
