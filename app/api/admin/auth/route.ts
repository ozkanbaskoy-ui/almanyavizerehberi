import crypto from 'crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  hasSmtpConfig,
  sendTemplatedEmail,
} from '@/lib/notifications/email';
import { getSiteSettings } from '@/lib/settings/site';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'ozkan';
const ADMIN_OTP_EMAIL = process.env.ADMIN_OTP_EMAIL;
const COOKIE_SECURE = process.env.NODE_ENV === 'production';
const OTP_COOKIE_NAME = 'admin_otp';
const OTP_TTL_SECONDS = 10 * 60; // 10 dakika

type Body = {
  mode?: 'password' | 'code';
  username?: string;
  password?: string;
  code?: string;
};

function getOtpSecret() {
  // Ayrı bir gizli anahtar tanımlı değilse, şifreyi fallback olarak kullan.
  return (
    process.env.ADMIN_OTP_SECRET ||
    ADMIN_PASSWORD ||
    'change-me-in-production'
  );
}

function generateOtpCode(): string {
  const num = crypto.randomInt(0, 1_000_000);
  return num.toString().padStart(6, '0');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;

    // Hiç admin şifresi tanımlı değilse, geliştirme kolaylığı için korumayı kaldır.
    if (!ADMIN_PASSWORD) {
      const res = NextResponse.json({
        ok: true,
        authEnabled: false,
      });
      res.cookies.set('admin_logged_in', '1', {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8,
      });
      return res;
    }

    const mode = body.mode ?? 'password';

    if (mode === 'password') {
      // Adım 1: kullanıcı adı ve şifre kontrolü
      if (!body.username || body.username !== ADMIN_USERNAME) {
        return NextResponse.json(
          { error: 'Geçersiz kullanıcı adı.' },
          { status: 401 },
        );
      }

      if (!body.password || body.password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: 'Geçersiz yönetici şifresi.' },
          { status: 401 },
        );
      }

      // SMTP ve hedef e-posta hazırsa OTP kodu gönder.
      const smtpReady = hasSmtpConfig();
      let toEmail: string | null = null;

      if (smtpReady) {
        if (ADMIN_OTP_EMAIL) {
          toEmail = ADMIN_OTP_EMAIL;
        } else {
          const site = getSiteSettings();
          if (site.contactEmail) {
            toEmail = site.contactEmail;
          }
        }
      }

      if (smtpReady && toEmail) {
        const code = generateOtpCode();
        const now = new Date();
        const expiresAt = new Date(
          now.getTime() + OTP_TTL_SECONDS * 1000,
        );
        const secret = getOtpSecret();

        const hash = crypto
          .createHmac('sha256', secret)
          .update(`${code}|${expiresAt.toISOString()}`)
          .digest('hex');

        const otpPayload = {
          hash,
          expiresAt: expiresAt.toISOString(),
        };

        await sendTemplatedEmail({
          templateId: 'admin_login_code',
          to: toEmail,
          variables: {
            code,
            time: now.toLocaleString('tr-TR', {
              dateStyle: 'short',
              timeStyle: 'short',
            }),
          },
        });

        const res = NextResponse.json({
          ok: true,
          step: 'code',
        });

        // Geçici OTP çerezi (tüm sitede geçerli olacak şekilde path '/')
        res.cookies.set(OTP_COOKIE_NAME, JSON.stringify(otpPayload), {
          httpOnly: true,
          secure: COOKIE_SECURE,
          sameSite: 'lax',
          path: '/',
          maxAge: OTP_TTL_SECONDS,
        });

        return res;
      }

      // SMTP veya e-posta hazır değilse OTP olmadan doğrudan giriş.
      const res = NextResponse.json({
        ok: true,
        authEnabled: true,
        step: 'done',
      });

      res.cookies.set('admin_logged_in', '1', {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 saat
      });

      return res;
    }

    if (mode === 'code') {
      const code = body.code?.trim();
      if (!code) {
        return NextResponse.json(
          { error: 'Lütfen doğrulama kodunu girin.' },
          { status: 400 },
        );
      }

      const cookieStore = await cookies();
      const otpCookie = cookieStore.get(OTP_COOKIE_NAME)?.value;

      if (!otpCookie) {
        return NextResponse.json(
          {
            error:
              'Doğrulama kodu oturumu bulunamadı veya süresi doldu. Lütfen tekrar giriş yapın.',
          },
          { status: 401 },
        );
      }

      let parsed: { hash: string; expiresAt: string };
      try {
        parsed = JSON.parse(otpCookie) as {
          hash: string;
          expiresAt: string;
        };
      } catch {
        return NextResponse.json(
          {
            error:
              'Doğrulama kodu oturumu geçersiz. Lütfen tekrar giriş yapın.',
          },
          { status: 401 },
        );
      }

      const expiresAt = new Date(parsed.expiresAt);
      if (!Number.isFinite(expiresAt.getTime()) || expiresAt < new Date()) {
        const res = NextResponse.json(
          {
            error:
              'Doğrulama kodunun süresi dolmuş. Lütfen tekrar giriş yapın.',
          },
          { status: 401 },
        );
        res.cookies.set(OTP_COOKIE_NAME, '', {
          httpOnly: true,
          secure: COOKIE_SECURE,
          sameSite: 'lax',
          path: '/',
          maxAge: 0,
        });
        return res;
      }

      const secret = getOtpSecret();
      const expectedHash = crypto
        .createHmac('sha256', secret)
        .update(`${code}|${expiresAt.toISOString()}`)
        .digest('hex');

      if (expectedHash !== parsed.hash) {
        return NextResponse.json(
          { error: 'Geçersiz doğrulama kodu.' },
          { status: 401 },
        );
      }

      const res = NextResponse.json({
        ok: true,
        authEnabled: true,
      });

      // OTP çerezini temizle
      res.cookies.set(OTP_COOKIE_NAME, '', {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });

      // Ana admin oturumu
      res.cookies.set('admin_logged_in', '1', {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8,
      });

      return res;
    }

    return NextResponse.json(
      { error: 'Geçersiz istek modu.' },
      { status: 400 },
    );
  } catch (err) {
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

