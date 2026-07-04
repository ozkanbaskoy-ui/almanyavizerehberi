import { NextResponse } from 'next/server';

import {
  isCrmDocumentStatus,
  type CrmDocumentStatus,
} from '@/lib/admin/documentModel';
import {
  deleteLocalDocument,
  getLocalDocumentById,
  updateLocalDocument,
} from '@/lib/admin/localDocumentsStore';
import { addLocalApplicationEvent } from '@/lib/admin/localApplicationsStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateBody = {
  status?: string;
  note?: string;
};

async function addDocumentEvent(documentId: string, message: string) {
  const localDocument = getLocalDocumentById(documentId);
  if (!localDocument) return;

  try {
    addLocalApplicationEvent({
      applicationId: localDocument.applicationId,
      type: 'evrak',
      message,
    });
  } catch {
    // Event yazımı kritik işlem değil.
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as UpdateBody;
  const status = body.status?.trim();
  const note = typeof body.note === 'string' ? body.note.trim() : undefined;

  if (!status && typeof note === 'undefined') {
    return NextResponse.json(
      { error: 'Güncellenecek evrak alanı gönderilmedi.' },
      { status: 400 },
    );
  }

  if (status && !isCrmDocumentStatus(status)) {
    return NextResponse.json(
      { error: 'Geçersiz evrak durumu.' },
      { status: 400 },
    );
  }

  const useSupabase = process.env.CRM_DOCUMENT_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      const updateFields: Record<string, string | null> = {};
      if (status) updateFields.status = status;
      if (typeof note !== 'undefined') updateFields.note = note || null;

      const { data, error } = await supabase
        .from('crm_documents')
        .update(updateFields)
        .eq('id', id)
        .select(
          'id, created_at, updated_at, application_id, document_type, original_filename, mime_type, size_bytes, status, note, storage_path, storage_provider',
        )
        .single();

      if (error || !data) {
        throw error ?? new Error('Evrak güncellenemedi.');
      }

      return NextResponse.json({ ok: true, document: data });
    } catch {
      // Supabase kapalıysa local fallback.
    }
  }

  const document = updateLocalDocument(id, {
    status: status as CrmDocumentStatus | undefined,
    note,
  });

  await addDocumentEvent(
    id,
    `Evrak güncellendi: ${document.originalFilename} (${document.status})`,
  );

  return NextResponse.json({ ok: true, storage: 'local', document });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const useSupabase = process.env.CRM_DOCUMENT_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      const { data } = await supabase
        .from('crm_documents')
        .select('storage_path')
        .eq('id', id)
        .single();

      if (data?.storage_path) {
        await supabase.storage
          .from('crm-documents')
          .remove([data.storage_path as string]);
      }

      const { error } = await supabase.from('crm_documents').delete().eq('id', id);
      if (error) throw error;

      return NextResponse.json({ ok: true });
    } catch {
      // Supabase kapalıysa local fallback.
    }
  }

  deleteLocalDocument(id);
  return NextResponse.json({ ok: true, storage: 'local' });
}
