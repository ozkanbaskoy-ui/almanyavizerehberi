import {
  fetchApplicationEvents,
  fetchApplications,
} from '@/lib/admin/applicationsData';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export type AuditLogRecord = {
  id: string;
  createdAt: string;
  actorName: string;
  module: string;
  action: string;
  entityId: string | null;
  entityLabel: string | null;
  message: string;
  severity: 'info' | 'warning' | 'critical';
};

type AuditLogRow = {
  id: string;
  created_at: string;
  actor_name: string | null;
  module: string | null;
  action: string | null;
  entity_id: string | null;
  entity_label: string | null;
  message: string | null;
  severity: string | null;
};

function normalizeSeverity(value: string | null): AuditLogRecord['severity'] {
  if (value === 'warning' || value === 'critical') return value;
  return 'info';
}

export async function fetchAuditLogs(limit = 80): Promise<AuditLogRecord[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('audit_logs')
      .select(
        'id, created_at, actor_name, module, action, entity_id, entity_label, message, severity',
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      throw error ?? new Error('Bos audit sonucu');
    }

    return (data as AuditLogRow[]).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      actorName: row.actor_name || 'Sistem',
      module: row.module || 'system',
      action: row.action || 'event',
      entityId: row.entity_id,
      entityLabel: row.entity_label,
      message: row.message || '',
      severity: normalizeSeverity(row.severity),
    }));
  } catch {
    const applications = await fetchApplications();
    const eventGroups = await Promise.all(
      applications.slice(0, 50).map(async (app) => {
        const events = await fetchApplicationEvents(app.id);
        return events.map((event) => ({
          id: event.id,
          createdAt: event.createdAt,
          actorName: 'CRM',
          module: 'applications',
          action: event.type,
          entityId: app.id,
          entityLabel: app.fullName,
          message: event.message,
          severity:
            event.type === 'durum-degisikligi'
              ? ('warning' as const)
              : ('info' as const),
        }));
      }),
    );

    return eventGroups
      .flat()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }
}
