import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  addLocalApplicationEvent,
  updateLocalApplication,
} from '@/lib/admin/localApplicationsStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const VALID_STATUSES = new Set([
  'yeni',
  'incelemede',
  'evrak-bekleniyor',
  'odeme-bekleniyor',
  'tamamlandi',
  'reddedildi',
]);

const VALID_PAYMENT_STATUSES = new Set([
  'bekliyor',
  'odendi',
  'iade-edildi',
]);

const VALID_EVENT_TYPES = new Set([
  'not',
  'telefon-gorusmesi',
  'mail-gonderildi',
  'evrak',
  'randevu',
  'gorev',
  'odeme',
]);

async function ensureAdminSession() {
  if (!ADMIN_PASSWORD) return true;

  const cookieStore = await cookies();
  const session = cookieStore.get('admin_logged_in')?.value;
  return session === '1';
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateBody = {
  status?: string;
  paymentStatus?: string;
  note?: string;
  eventType?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json(
      { error: 'Yetkisiz istek. Lütfen tekrar yönetici girişi yapın.' },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as UpdateBody;

  const status = body.status?.trim();
  const paymentStatus = body.paymentStatus?.trim();
  const note = body.note?.trim();
  const eventType = body.eventType?.trim() || 'not';

  if (status && !VALID_STATUSES.has(status)) {
    return NextResponse.json(
      { error: 'Geçersiz başvuru durumu.' },
      { status: 400 },
    );
  }

  if (paymentStatus && !VALID_PAYMENT_STATUSES.has(paymentStatus)) {
    return NextResponse.json(
      { error: 'Geçersiz ödeme durumu.' },
      { status: 400 },
    );
  }

  if (note && !VALID_EVENT_TYPES.has(eventType)) {
    return NextResponse.json(
      { error: 'Geçersiz CRM aktivite türü.' },
      { status: 400 },
    );
  }

  if (!status && !paymentStatus && !note) {
    return NextResponse.json(
      { error: 'Güncellenecek bir alan veya not girilmedi.' },
      { status: 400 },
    );
  }

  async function updateLocalFallback() {
    if (status || paymentStatus) {
      updateLocalApplication(id, {
        status,
        paymentStatus,
      });

      const changes = [
        status && `Başvuru durumu: ${status}`,
        paymentStatus && `Ödeme durumu: ${paymentStatus}`,
      ].filter(Boolean);

      addLocalApplicationEvent({
        applicationId: id,
        type: 'durum-degisikligi',
        message: changes.join('\n'),
      });
    }

    if (note) {
      addLocalApplicationEvent({
        applicationId: id,
        type: eventType as never,
        message: note,
      });
    }
  }

  try {
    const supabase = getSupabaseServerClient();

    const updateFields: Record<string, string> = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.payment_status = paymentStatus;

    if (Object.keys(updateFields).length > 0) {
      const { error } = await supabase
        .from('applications')
        .update(updateFields)
        .eq('id', id);

      if (error) throw error;

      const changes = [
        status && `Başvuru durumu: ${status}`,
        paymentStatus && `Ödeme durumu: ${paymentStatus}`,
      ].filter(Boolean);

      await supabase.from('application_events').insert({
        application_id: id,
        type: 'durum-degisikligi',
        message: changes.join('\n'),
      });
    }

    if (note) {
      await supabase.from('application_events').insert({
        application_id: id,
        type: eventType,
        message: note,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    try {
      await updateLocalFallback();
      return NextResponse.json({ ok: true, storage: 'local' });
    } catch {
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : 'Başvuru güncellenirken bir hata oluştu.',
        },
        { status: 500 },
      );
    }
  }
}
