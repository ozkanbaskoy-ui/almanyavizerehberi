import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/lib/db/supabaseServer';
import { sendTemplatedEmail } from '@/lib/notifications/email';

const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 dakika
const RATE_LIMIT_MAX_REQUESTS = 5;

const rateLimitBuckets = new Map<
  string,
  { count: number; first: number }
>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket) {
    rateLimitBuckets.set(ip, { count: 1, first: now });
    return false;
  }

  if (now - bucket.first > RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(ip, { count: 1, first: now });
    return false;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  bucket.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      visaType?: string;
      source?: string;
      captchaToken?: string | null;
    };

    const headerList = await headers();
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headerList.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            'Kısa sürede çok fazla başvuru denemesi tespit edildi. Lütfen birkaç dakika sonra tekrar deneyin.',
        },
        { status: 429 },
      );
    }

    const fullName = body.fullName?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const visaType = body.visaType?.trim() || 'bilinmiyor';
    const source = body.source?.trim() || 'web-form';

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        {
          error:
            'Lütfen ad soyad, e-posta ve telefon alanlarını doldurun.',
        },
        { status: 400 },
      );
    }

    // hCaptcha doğrulaması (sadece SECRET tanımlıysa zorunlu)
    if (HCAPTCHA_SECRET_KEY) {
      const token = body.captchaToken;
      if (!token) {
        return NextResponse.json(
          {
            error:
              'Lütfen güvenlik doğrulamasını (Ben robot değilim) tamamlayın.',
          },
          { status: 400 },
        );
      }

      try {
        const verifyRes = await fetch(
          'https://hcaptcha.com/siteverify',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              secret: HCAPTCHA_SECRET_KEY,
              response: token,
              remoteip: ip,
            }),
          },
        );

        const verifyJson = (await verifyRes.json()) as {
          success?: boolean;
        };

        if (!verifyJson.success) {
          return NextResponse.json(
            {
              error:
                'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.',
            },
            { status: 400 },
          );
        }
      } catch (captchaError) {
        console.warn(
          '[applications] hCaptcha doğrulama hatası:',
          captchaError,
        );
        return NextResponse.json(
          {
            error:
              'Güvenlik doğrulaması sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
          },
          { status: 400 },
        );
      }
    }

    const supabase = getSupabaseServerClient();
    const id = crypto.randomUUID();

    const { error } = await supabase.from('applications').insert({
      id,
      full_name: fullName,
      email,
      phone,
      visa_type: visaType,
      status: 'yeni',
      payment_status: 'bekliyor',
      source,
    });

    if (error) {
      throw error;
    }

    await supabase.from('application_events').insert({
      application_id: id,
      type: 'not',
      message: 'Başvuru formu gönderildi.',
    });

    try {
      const createdAt = new Date().toLocaleString('tr-TR');
      await sendTemplatedEmail({
        templateId: 'application_received',
        to: email,
        variables: {
          fullName,
          visaType,
          createdAt,
          applicationId: id,
        },
      });
    } catch (emailError) {
      console.warn(
        '[applications] Başvuru alındı e-postası gönderilemedi:',
        emailError,
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Başvuru kaydedilirken bir hata oluştu.',
      },
      { status: 500 },
    );
  }
}
