import { getLocalTasks } from '@/lib/admin/localTasksStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';
import type {
  CrmTaskPriority,
  CrmTaskRecord,
  CrmTaskStatus,
} from '@/lib/admin/taskModel';

export {
  CRM_TASK_PRIORITIES,
  CRM_TASK_STATUSES,
  getTaskPriorityLabel,
  getTaskStatusLabel,
  isCrmTaskPriority,
  isCrmTaskStatus,
} from '@/lib/admin/taskModel';
export type {
  CrmTaskPriority,
  CrmTaskRecord,
  CrmTaskStatus,
} from '@/lib/admin/taskModel';

export async function fetchCrmTasks(
  options: { applicationId?: string } = {},
): Promise<CrmTaskRecord[]> {
  const useSupabase = process.env.CRM_TASK_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      let query = supabase
        .from('crm_tasks')
        .select(
          'id, created_at, updated_at, application_id, title, description, status, priority, due_at',
        )
        .order('created_at', { ascending: false })
        .limit(300);

      if (options.applicationId) {
        query = query.eq('application_id', options.applicationId);
      }

      const { data, error } = await query;
      if (error || !data) {
        throw error ?? new Error('Boş görev sonucu');
      }

      return data.map((row) => ({
        id: row.id as string,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
        applicationId: row.application_id as string,
        title: row.title as string,
        description: (row.description as string | null) ?? null,
        status: (row.status as CrmTaskStatus) ?? 'open',
        priority: (row.priority as CrmTaskPriority) ?? 'normal',
        dueAt: (row.due_at as string | null) ?? null,
      }));
    } catch {
      return getLocalTasks(options);
    }
  }

  return getLocalTasks(options);
}
