import { NextResponse } from 'next/server';

import {
  CRM_DOCUMENT_TYPES,
  isCrmDocumentStatus,
  type CrmDocumentStatus,
} from '@/lib/admin/documentModel';
import {
  saveLocalDocument,
  saveLocalDocumentFile,
} from '@/lib/admin/localDocumentsStore';
import { addLocalApplicationEvent } from '@/lib/admin/localApplicationsStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function isKnownDocumentType(value: string) {
  return CRM_DOCUMENT_TYPES.some((item) => item.value === value);
}

async function logDocumentEvent(params: {
  applicationId: string;
  message: string;
}) {
  try {
    addLocalApplicationEvent({
      applicationId: params.applicationId,
      type: 'evrak',
      message: params.message,
    });
  } catch {
    // Evrak kaydını event yazılamadı diye başarısız saymıyoruz.
  }
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json(
      { error: 'Geçersiz evrak yükleme isteği.' },
      { status: 400 },
    );
  }

  const file = formData.get('file');
  const applicationId = String(formData.get('applicationId') || '').trim();
  const documentType = String(formData.get('documentType') || '').trim();
  const statusValue = String(formData.get('status') || 'uploaded').trim();
  const note = String(formData.get('note') || '').trim();

  if (!applicationId || !documentType || !(file instanceof File)) {
    return NextResponse.json(
      { error: 'Başvuru, evrak türü ve dosya alanları zorunludur.' },
      { status: 400 },
    );
  }

  if (!isKnownDocumentType(documentType)) {
    return NextResponse.json(
      { error: 'Geçersiz evrak türü.' },
      { status: 400 },
    );
  }

  if (!isCrmDocumentStatus(statusValue)) {
    return NextResponse.json(
      { error: 'Geçersiz evrak durumu.' },
      { status: 400 },
    );
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'Dosya boyutu 20 MB sınırını aşamaz.' },
      { status: 400 },
    );
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error:
          'Sadece PDF, JPG, PNG, WEBP ve DOCX formatları yüklenebilir.',
      },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());
  const status = statusValue as CrmDocumentStatus;
  const useSupabase = process.env.CRM_DOCUMENT_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      const storagePath = `${applicationId}/${id}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('crm-documents')
        .upload(storagePath, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('crm_documents')
        .insert({
          id,
          application_id: applicationId,
          document_type: documentType,
          original_filename: file.name,
          mime_type: file.type || null,
          size_bytes: file.size,
          status,
          note: note || null,
          storage_path: storagePath,
          storage_provider: 'supabase',
        })
        .select(
          'id, created_at, updated_at, application_id, document_type, original_filename, mime_type, size_bytes, status, note, storage_path, storage_provider',
        )
        .single();

      if (error || !data) {
        throw error ?? new Error('Evrak kaydı oluşturulamadı.');
      }

      await logDocumentEvent({
        applicationId,
        message: `Evrak yüklendi: ${file.name}`,
      });

      return NextResponse.json({ ok: true, document: data });
    } catch {
      // Lokal denemede Supabase Storage kapalıysa otomatik local fallback.
    }
  }

  const storagePath = saveLocalDocumentFile({
    id,
    filename: file.name,
    buffer,
  });

  const document = saveLocalDocument({
    id,
    applicationId,
    documentType,
    originalFilename: file.name,
    mimeType: file.type || null,
    sizeBytes: file.size,
    status,
    note: note || null,
    storagePath,
  });

  await logDocumentEvent({
    applicationId,
    message: `Evrak yüklendi: ${file.name}`,
  });

  return NextResponse.json({
    ok: true,
    storage: 'local',
    document,
  });
}
