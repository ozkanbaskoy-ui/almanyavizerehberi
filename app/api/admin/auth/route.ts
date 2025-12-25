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
const OTP_COOKIE_NAME = 'admin_otp';
const OTP_TTL_SECONDS = 10 * 60; // 10 minutes

type Body = {
  mode?: 'password' | 'code';
  username?: string;
  password?: string;
  code?: string;
};

function getOtpSecret() {
  // Fallback secret if no dedicated secret is configured.
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

    // If there is no admin password configured at all, behave like
    // "auth disabled" and let the user in (development convenience).
    if (!ADMIN_PASSWORD) {
      const res = NextResponse.json({
        ok: true,
        authEnabled: false,
      });
      res.cookies.set('admin_logged_in', '1', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/admin',
        maxAge: 60 * 60 * 8,
      });
      return res;
    }

    const mode = body.mode ?? 'password';

    if (mode === 'password') {
      // Step 1: validate username and password.
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

      // If SMTP and a contact email are configured, send an OTP code.
      const smtpReady = hasSmtpConfig();
      let toEmail: string | null = null;

      if (smtpReady) {
        const site = getSiteSettings();
        if (site.contactEmail) {
          toEmail = site.contactEmail;
        }
      }

      if (smtpReady && toEmail) {
        const code = generateOtpCode();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + OTP_TTL_SECONDS * 1000);
        const secret = getOtpSecret();

        const hash = crypto
          .createHmac('sha256', secret)
          .update(`${code}|${expiresAt.toISOString()}`)
          .digest('hex');

        const otpPayload = {
          hash,
          expiresAt: expiresAt.toISOString(),
        };

        // Send the code by email.
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

        // Temporary OTP cookie (only for /admin).
        res.cookies.set(OTP_COOKIE_NAME, JSON.stringify(otpPayload), {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/admin',
          maxAge: OTP_TTL_SECONDS,
        });

        return res;
      }

      // If SMTP or email is not ready yet, fall back to simple
      // username + password login with no OTP.
      const res = NextResponse.json({
        ok: true,
        authEnabled: true,
        step: 'done',
      });

      res.cookies.set('admin_logged_in', '1', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/admin',
        maxAge: 60 * 60 * 8, // 8 hours
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

      const cookieStore = cookies();
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
          secure: true,
          sameSite: 'lax',
          path: '/admin',
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

      // One-time use: clear OTP cookie.
      res.cookies.set(OTP_COOKIE_NAME, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/admin',
        maxAge: 0,
      });

      // Main admin session cookie.
      res.cookies.set('admin_logged_in', '1', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/admin',
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

