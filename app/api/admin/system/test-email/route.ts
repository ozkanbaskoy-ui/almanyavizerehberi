import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { hasSmtpConfig, sendPlainEmail } from '@/lib/notifications/email';
import { getRecipientEmails } from '@/lib/notifications/recipientEmails';
import { getSiteSettings } from '@/lib/settings/site';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdminSession() {
  if (!ADMIN_PASSWORD) return true;

  const cookieStore = await cookies();
  const session = cookieStore.get('admin_logged_in')?.value;
  return session === '1';
}

function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;

  const visible = name.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(name.length - 2, 3))}@${domain}`;
}

export async function POST() {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  if (!hasSmtpConfig()) {
    return NextResponse.json(
      { error: 'SMTP ayarları eksik. SMTP_HOST, SMTP_USER ve SMTP_PASS kontrol edilmeli.' },
      { status: 400 },
    );
  }

  const site = getSiteSettings();
  const recipients = getRecipientEmails(site.contactEmail, [
    process.env.LEAD_NOTIFY_EMAIL,
    process.env.ADMIN_OTP_EMAIL,
  ]);
  if (recipients.length === 0) {
    return NextResponse.json(
      { error: 'Test e-postası için bir alıcı adresi tanımlı olmalı.' },
      { status: 400 },
    );
  }

  const sentAt = new Date().toLocaleString('tr-TR');

  try {
    const results = [];

    for (const recipient of recipients) {
      results.push(
        await sendPlainEmail({
          to: recipient,
          subject: 'SMTP test e-postası - Almanya Vize Rehberi',
          text: [
            'Bu e-posta admin panelindeki sistem sağlığı ekranından gönderilen SMTP testidir.',
            '',
            `Gönderim zamanı: ${sentAt}`,
            'Sonuç: SMTP bağlantısı ve gönderim akışı çalışıyor.',
          ].join('\n'),
        }),
      );
    }

    return NextResponse.json({
      ok: results.every((result) => result.ok),
      skipped: results.every((result) => result.skipped),
      recipients: recipients.map((recipient) => maskEmail(recipient)),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Test e-postası gönderilemedi.',
        recipients: recipients.map((recipient) => maskEmail(recipient)),
      },
      { status: 500 },
    );
  }
}
