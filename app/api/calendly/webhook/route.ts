import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/lib/db/supabaseServer';
import { sendTemplatedEmail } from '@/lib/notifications/email';

// Not: Gercek ortama gecmeden once Calendly panelinden
// webhook URL'si olarak /api/calendly/webhook adresini eklemeniz
// ve imza dogrulama icin kullanacaginiz yaklasimi belirlemeniz gerekir.

type CalendlyWebhookPayload = {
  event: string;
  time: string;
  payload?: {
    event?: {
      start_time?: string;
      uri?: string;
    };
    event_type?: {
      name?: string;
    };
    invitee?: {
      name?: string;
      email?: string;
      uri?: string;
    };
  };
};

export async function POST(request: Request) {
  // Bu iskelet, Supabase'deki appointments tablosuna temel bilgileri yazar.
  // Guvenlik icin IP kisitlamasi veya imza dogrulama eklemeniz onerilir.

  let body: CalendlyWebhookPayload;

  try {
    body = (await request.json()) as CalendlyWebhookPayload;
  } catch {
    return NextResponse.json(
      { error: 'Gecersiz JSON yuklemesi.' },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();

    const type = body.event;
    const payload = body.payload;
    const event = payload?.event;
    const invitee = payload?.invitee;
    const eventType = payload?.event_type;

    const scheduledAt =
      event?.start_time ?? body.time ?? new Date().toISOString();

    const id =
      event?.uri ??
      invitee?.uri ??
      `calendly-${crypto.randomUUID()}`;

    const status =
      type === 'invitee.canceled' ? 'canceled' : 'scheduled';

    await supabase.from('appointments').upsert(
      {
        id,
        scheduled_at: scheduledAt,
        status,
        invitee_name: invitee?.name ?? null,
        invitee_email: invitee?.email ?? null,
        event_type: eventType?.name ?? null,
      },
      { onConflict: 'id' },
    );

    // Randevu olustugunda isteğe bağlı bilgilendirme e-postası
    if (status === 'scheduled' && invitee?.email) {
      try {
        const date = new Date(scheduledAt);
        await sendTemplatedEmail({
          templateId: 'appointment_scheduled',
          to: invitee.email,
          variables: {
            fullName: invitee.name ?? '',
            appointmentDate: date.toLocaleDateString('tr-TR'),
            appointmentTime: date.toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            channel: 'Online Görüşme',
          },
        });
      } catch (err) {
        console.warn(
          '[calendly] Randevu e-postası gönderilemedi:',
          err,
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Calendly webhook islenirken bir hata olustu.';

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
