import { getLocalDocuments } from '@/lib/admin/localDocumentsStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';
import type {
  CrmDocumentRecord,
  CrmDocumentStatus,
} from '@/lib/admin/documentModel';

export {
  CRM_DOCUMENT_STATUSES,
  CRM_DOCUMENT_TYPES,
  formatFileSize,
  getDocumentStatusLabel,
  getDocumentTypeLabel,
  isCrmDocumentStatus,
} from '@/lib/admin/documentModel';
export type {
  CrmDocumentRecord,
  CrmDocumentStatus,
} from '@/lib/admin/documentModel';

type FetchDocumentOptions = {
  applicationId?: string;
};

export async function fetchCrmDocuments(
  options: FetchDocumentOptions = {},
): Promise<CrmDocumentRecord[]> {
  const useSupabase = process.env.CRM_DOCUMENT_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      let query = supabase
        .from('crm_documents')
        .select(
          'id, created_at, updated_at, application_id, document_type, original_filename, mime_type, size_bytes, status, note, storage_path, storage_provider',
        )
        .order('created_at', { ascending: false })
        .limit(300);

      if (options.applicationId) {
        query = query.eq('application_id', options.applicationId);
      }

      const { data, error } = await query;
      if (error || !data) {
        throw error ?? new Error('Boş evrak sonucu');
      }

      return data.map((row) => ({
        id: row.id as string,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
        applicationId: row.application_id as string,
        documentType: row.document_type as string,
        originalFilename: row.original_filename as string,
        mimeType: (row.mime_type as string | null) ?? null,
        sizeBytes: Number(row.size_bytes ?? 0),
        status: (row.status as CrmDocumentStatus) ?? 'uploaded',
        note: (row.note as string | null) ?? null,
        storagePath: row.storage_path as string,
        storageProvider:
          row.storage_provider === 'supabase' ? 'supabase' : 'local',
      }));
    } catch {
      return getLocalDocuments(options);
    }
  }

  return getLocalDocuments(options);
}
