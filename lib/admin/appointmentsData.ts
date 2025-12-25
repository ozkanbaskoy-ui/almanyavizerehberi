import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export type AppointmentRecord = {
  id: string;
  createdAt: string;
  scheduledAt: string;
  status: string;
  inviteeName: string | null;
  inviteeEmail: string | null;
  eventType: string | null;
};

export async function fetchUpcomingAppointments(
  limit = 20,
): Promise<AppointmentRecord[] | null> {
  try {
    const supabase = getSupabaseServerClient();

    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from('appointments')
      .select(
        'id, created_at, scheduled_at, status, invitee_name, invitee_email, event_type',
      )
      .gte('scheduled_at', nowIso)
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (error || !data) {
      throw error ?? new Error('Bos sonuc');
    }

    return data.map((row) => ({
      id: row.id as string,
      createdAt: row.created_at as string,
      scheduledAt: row.scheduled_at as string,
      status: (row.status as string) ?? 'scheduled',
      inviteeName: (row.invitee_name as string | null) ?? null,
      inviteeEmail: (row.invitee_email as string | null) ?? null,
      eventType: (row.event_type as string | null) ?? null,
    }));
  } catch {
    return null;
  }
}

