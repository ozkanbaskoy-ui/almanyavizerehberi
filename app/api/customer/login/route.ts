import { NextResponse } from 'next/server';

import { verifyPassword } from '@/lib/auth/customerPasswords';
import { createCustomerSessionToken } from '@/lib/auth/customerSession';
import { findLocalCustomerByIdentifier } from '@/lib/admin/localCustomersStore';
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
      { error: 'Lütfen kullanıcı adı/e-posta ve şifre girin.' },
      { status: 400 },
    );
  }

  function createLoginResponse(customer: { id: string; fullName: string }) {
    const token = createCustomerSessionToken(customer.id);

    const res = NextResponse.json({
      ok: true,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
      },
    });

    res.cookies.set('customer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
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
      const localCustomer = findLocalCustomerByIdentifier(identifier);
      if (localCustomer) {
        const ok = verifyPassword(
          password,
          localCustomer.passwordSalt,
          localCustomer.passwordHash,
        );

        if (ok) {
          return createLoginResponse({
            id: localCustomer.id,
            fullName: localCustomer.fullName,
          });
        }

        return NextResponse.json(
          { error: 'Hatalı şifre.' },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı.' },
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
        { error: 'Hatalı şifre.' },
        { status: 401 },
      );
    }

    return createLoginResponse({
      id: data.id as string,
      fullName: data.full_name as string,
    });
  } catch (err) {
    const localCustomer = findLocalCustomerByIdentifier(identifier);
    if (localCustomer) {
      const ok = verifyPassword(
        password,
        localCustomer.passwordSalt,
        localCustomer.passwordHash,
      );

      if (ok) {
        return createLoginResponse({
          id: localCustomer.id,
          fullName: localCustomer.fullName,
        });
      }

      return NextResponse.json(
        { error: 'Hatalı şifre.' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Giriş yapılırken bir hata oluştu.',
      },
      { status: 500 },
    );
  }
}
