import { NextResponse } from 'next/server';

import {
  isCrmTaskPriority,
  isCrmTaskStatus,
  type CrmTaskPriority,
  type CrmTaskStatus,
} from '@/lib/admin/taskModel';
import { saveLocalTask } from '@/lib/admin/localTasksStore';
import { addLocalApplicationEvent } from '@/lib/admin/localApplicationsStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

type CreateBody = {
  applicationId?: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueAt?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CreateBody;
  const applicationId = body.applicationId?.trim();
  const title = body.title?.trim();
  const description = body.description?.trim() || null;
  const status = body.status?.trim() || 'open';
  const priority = body.priority?.trim() || 'normal';
  const dueAt = body.dueAt?.trim() || null;

  if (!applicationId || !title) {
    return NextResponse.json(
      { error: 'Başvuru ve görev başlığı zorunludur.' },
      { status: 400 },
    );
  }

  if (!isCrmTaskStatus(status)) {
    return NextResponse.json(
      { error: 'Geçersiz görev durumu.' },
      { status: 400 },
    );
  }

  if (!isCrmTaskPriority(priority)) {
    return NextResponse.json(
      { error: 'Geçersiz görev önceliği.' },
      { status: 400 },
    );
  }

  const useSupabase = process.env.CRM_TASK_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from('crm_tasks')
        .insert({
          application_id: applicationId,
          title,
          description,
          status,
          priority,
          due_at: dueAt,
        })
        .select(
          'id, created_at, updated_at, application_id, title, description, status, priority, due_at',
        )
        .single();

      if (error || !data) {
        throw error ?? new Error('Görev oluşturulamadı.');
      }

      return NextResponse.json({ ok: true, task: data });
    } catch {
      // Supabase kapalıysa local fallback.
    }
  }

  const task = saveLocalTask({
    id: crypto.randomUUID(),
    applicationId,
    title,
    description,
    status: status as CrmTaskStatus,
    priority: priority as CrmTaskPriority,
    dueAt,
  });

  try {
    addLocalApplicationEvent({
      applicationId,
      type: 'gorev',
      message: `Görev oluşturuldu: ${title}`,
    });
  } catch {
    // Görev kaydını event yazılamadı diye başarısız saymıyoruz.
  }

  return NextResponse.json({ ok: true, storage: 'local', task });
}
