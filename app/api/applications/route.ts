import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/lib/db/supabaseServer';
import {
  addLocalApplicationEvent,
  saveLocalApplication,
} from '@/lib/admin/localApplicationsStore';
import { saveLocalEmailLog } from '@/lib/admin/localEmailLogsStore';
import { sendTemplatedEmail } from '@/lib/notifications/email';
import { getRecipientEmails } from '@/lib/notifications/recipientEmails';

export const runtime = 'nodejs';

const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;

type SupabaseClient = ReturnType<typeof getSupabaseServerClient>;

type EmailJob = {
  templateId: 'application_received' | 'admin_new_application';
  to: string;
  variables: Record<string, string | number | boolean>;
};

async function logEmailDelivery(
  supabase: SupabaseClient | null,
  params: {
    applicationId: string;
    templateId: string;
    recipient: string;
    subject?: string | null;
    status: 'sent' | 'failed';
    providerMessageId?: string | null;
    errorMessage?: string | null;
  },
) {
  saveLocalEmailLog({
    applicationId: params.applicationId,
    templateId: params.templateId,
    recipient: params.recipient,
    subject: params.subject || null,
    status: params.status,
    providerMessageId: params.providerMessageId || null,
    errorMessage: params.errorMessage || null,
  });

  if (!supabase) return;

  try {
    await supabase.from('email_logs').insert({
      application_id: params.applicationId,
      template_id: params.templateId,
      recipient: params.recipient,
      subject: params.subject || null,
      status: params.status,
      provider_message_id: params.providerMessageId || null,
      error_message: params.errorMessage || null,
    });
  } catch (logError) {
    console.warn('[applications] E-posta logu yazılamadı:', logError);
  }
}

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
      age?: string;
      visaType?: string;
      profession?: string;
      education?: string;
      currentCountry?: string;
      urgency?: string;
      contactPreference?: string;
      message?: string;
      source?: string;
      captchaToken?: string | null;
      fitResult?: {
        routeTitle?: string;
        score?: number;
        temperature?: string;
      };
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
    const age = body.age?.trim() || '';
    const visaType = body.visaType?.trim() || 'bilinmiyor';
    const source = body.source?.trim() || 'web-form';
    const profession = body.profession?.trim() || '';
    const education = body.education?.trim() || '';
    const currentCountry = body.currentCountry?.trim() || '';
    const urgency = body.urgency?.trim() || '';
    const contactPreference = body.contactPreference?.trim() || '';
    const message = body.message?.trim() || '';
    const fitResult = body.fitResult;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        {
          error:
            'Lütfen ad soyad, e-posta ve telefon alanlarını doldurun.',
        },
        { status: 400 },
      );
    }

    if (!body.visaType?.trim()) {
      return NextResponse.json(
        { error: 'Lütfen vize türünü seçin.' },
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

    // Supabase istemcisini dene; yoksa CRM demo modunda çalışır
    let supabase: ReturnType<typeof getSupabaseServerClient> | null =
      null;
    try {
      supabase = getSupabaseServerClient();
    } catch (dbError) {
      console.warn(
        '[applications] Supabase yapılandırılmamış, başvuru veritabanına kaydedilmeyecek.',
        dbError,
      );
    }

    const id = crypto.randomUUID();
    const createdAtIso = new Date().toISOString();
    const detailLines = [
      age && `Yaş: ${age}`,
      profession && `Meslek / bölüm: ${profession}`,
      education && `En son eğitim durumu: ${education}`,
      currentCountry && `Bulunduğu ülke: ${currentCountry}`,
      urgency && `Zamanlama: ${urgency}`,
      contactPreference && `İletişim tercihi: ${contactPreference}`,
      fitResult?.routeTitle && `Uygunluk sonucu: ${fitResult.routeTitle}`,
      typeof fitResult?.score === 'number' && `Uygunluk skoru: ${fitResult.score}/100`,
      fitResult?.temperature && `Uygunluk seviyesi: ${fitResult.temperature}`,
      message && `Not: ${message}`,
    ].filter(Boolean);

    saveLocalApplication({
      id,
      createdAt: createdAtIso,
      fullName,
      email,
      phone,
      visaType,
      status: 'yeni',
      paymentStatus: 'bekliyor',
      source,
    });

    addLocalApplicationEvent({
      applicationId: id,
      type: 'not',
      message: 'Başvuru formu gönderildi.',
      createdAt: createdAtIso,
    });

    if (detailLines.length > 0) {
      addLocalApplicationEvent({
        applicationId: id,
        type: 'not',
        message: `Lead detayları:\n${detailLines.join('\n')}`,
      });
    }

    if (supabase) {
      try {
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

        if (detailLines.length > 0) {
          await supabase.from('application_events').insert({
            application_id: id,
            type: 'not',
            message: `Lead detayları:\n${detailLines.join('\n')}`,
          });
        }
      } catch (dbWriteError) {
        console.warn(
          '[applications] Supabase başvuru kaydı yazılamadı, lokal CRM kaydı kullanılacak:',
          dbWriteError,
        );
      }
    }

    const createdAt = new Date().toLocaleString('tr-TR');
    const leadNotifyEmails = getRecipientEmails(undefined, [
      process.env.LEAD_NOTIFY_EMAIL,
    ]);
    const fitSummary =
      fitResult?.routeTitle && typeof fitResult?.score === 'number'
        ? `${fitResult.routeTitle} - ${fitResult.score}/100${
            fitResult.temperature ? ` (${fitResult.temperature})` : ''
          }`
        : '';

    const emailJobs: EmailJob[] = [
      {
        templateId: 'application_received' as const,
        to: email,
        variables: {
          fullName,
          visaType,
          createdAt,
          applicationId: id,
        },
      },
    ];

    for (const adminEmail of leadNotifyEmails) {
      emailJobs.push({
        templateId: 'admin_new_application' as const,
        to: adminEmail,
        variables: {
          fullName,
          email,
          phone,
          visaType,
          age,
          profession,
          education,
          currentCountry,
          urgency,
          contactPreference,
          message,
          fitSummary,
          createdAt,
          applicationId: id,
        },
      });
    }

    for (const job of emailJobs) {
      try {
        const result = await sendTemplatedEmail(job);
        await logEmailDelivery(supabase, {
          applicationId: id,
          templateId: job.templateId,
          recipient: job.to,
          subject: result?.subject,
          status: result?.ok ? 'sent' : 'failed',
          providerMessageId: result?.messageId,
          errorMessage: result?.skipped ? 'E-posta gönderimi atlandı.' : null,
        });
      } catch (emailError) {
        console.warn(
          '[applications] Başvuru e-postası gönderilemedi:',
          emailError,
        );
        await logEmailDelivery(supabase, {
          applicationId: id,
          templateId: job.templateId,
          recipient: job.to,
          status: 'failed',
          errorMessage:
            emailError instanceof Error
              ? emailError.message
              : 'Bilinmeyen e-posta hatası.',
        });
      }
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
