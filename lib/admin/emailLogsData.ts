import { getSupabaseServerClient } from '@/lib/db/supabaseServer';
import { getLocalEmailLogs } from '@/lib/admin/localEmailLogsStore';

export type EmailLogRecord = {
  id: string;
  createdAt: string;
  applicationId: string | null;
  templateId: string | null;
  recipient: string;
  subject: string | null;
  status: string;
  providerMessageId: string | null;
  errorMessage: string | null;
};

export async function fetchEmailLogs(limit = 80): Promise<EmailLogRecord[] | null> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('email_logs')
      .select(
        'id, created_at, application_id, template_id, recipient, subject, status, provider_message_id, error_message',
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      throw error ?? new Error('Bos e-posta log sonucu');
    }

    return data.map((row) => ({
      id: row.id as string,
      createdAt: row.created_at as string,
      applicationId: (row.application_id as string | null) ?? null,
      templateId: (row.template_id as string | null) ?? null,
      recipient: (row.recipient as string) ?? '',
      subject: (row.subject as string | null) ?? null,
      status: (row.status as string) ?? 'unknown',
      providerMessageId: (row.provider_message_id as string | null) ?? null,
      errorMessage: (row.error_message as string | null) ?? null,
    }));
  } catch {
    return getLocalEmailLogs(limit);
  }
}
