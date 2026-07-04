import { NextResponse } from 'next/server';

import {
  isCrmTaskPriority,
  isCrmTaskStatus,
  type CrmTaskPriority,
  type CrmTaskStatus,
} from '@/lib/admin/taskModel';
import {
  deleteLocalTask,
  updateLocalTask,
} from '@/lib/admin/localTasksStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateBody = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueAt?: string | null;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as UpdateBody;
  const title = body.title?.trim();
  const description =
    typeof body.description === 'string' ? body.description.trim() : undefined;
  const status = body.status?.trim();
  const priority = body.priority?.trim();
  const dueAt = typeof body.dueAt === 'string' ? body.dueAt.trim() || null : undefined;

  if (status && !isCrmTaskStatus(status)) {
    return NextResponse.json(
      { error: 'Geçersiz görev durumu.' },
      { status: 400 },
    );
  }

  if (priority && !isCrmTaskPriority(priority)) {
    return NextResponse.json(
      { error: 'Geçersiz görev önceliği.' },
      { status: 400 },
    );
  }

  const useSupabase = process.env.CRM_TASK_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      const updateFields: Record<string, string | null> = {};
      if (title) updateFields.title = title;
      if (typeof description !== 'undefined') {
        updateFields.description = description || null;
      }
      if (status) updateFields.status = status;
      if (priority) updateFields.priority = priority;
      if (typeof dueAt !== 'undefined') updateFields.due_at = dueAt;

      const { data, error } = await supabase
        .from('crm_tasks')
        .update(updateFields)
        .eq('id', id)
        .select(
          'id, created_at, updated_at, application_id, title, description, status, priority, due_at',
        )
        .single();

      if (error || !data) {
        throw error ?? new Error('Görev güncellenemedi.');
      }

      return NextResponse.json({ ok: true, task: data });
    } catch {
      // Supabase kapalıysa local fallback.
    }
  }

  const task = updateLocalTask(id, {
    title,
    description,
    status: status as CrmTaskStatus | undefined,
    priority: priority as CrmTaskPriority | undefined,
    dueAt,
  });

  return NextResponse.json({ ok: true, storage: 'local', task });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const useSupabase = process.env.CRM_TASK_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from('crm_tasks').delete().eq('id', id);
      if (error) throw error;

      return NextResponse.json({ ok: true });
    } catch {
      // Supabase kapalıysa local fallback.
    }
  }

  deleteLocalTask(id);
  return NextResponse.json({ ok: true, storage: 'local' });
}
