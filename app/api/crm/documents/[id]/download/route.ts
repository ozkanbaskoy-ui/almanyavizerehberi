import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

import {
  getLocalDocumentAbsolutePath,
  getLocalDocumentById,
} from '@/lib/admin/localDocumentsStore';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function contentDisposition(filename: string) {
  const fallback = filename.replace(/[^\w.-]+/g, '_') || 'evrak';
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const useSupabase = process.env.CRM_DOCUMENT_STORAGE_MODE === 'supabase';

  if (useSupabase) {
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from('crm_documents')
        .select('storage_path')
        .eq('id', id)
        .single();

      if (error || !data?.storage_path) {
        throw error ?? new Error('Evrak bulunamadı.');
      }

      const { data: signed, error: signedError } = await supabase.storage
        .from('crm-documents')
        .createSignedUrl(data.storage_path as string, 60);

      if (signedError || !signed?.signedUrl) {
        throw signedError ?? new Error('İmzalı evrak linki oluşturulamadı.');
      }

      return NextResponse.redirect(signed.signedUrl);
    } catch {
      // Lokal geliştirmede Supabase kapalıysa aşağıdaki local akış denenir.
    }
  }

  const document = getLocalDocumentById(id);
  if (!document) {
    return NextResponse.json({ error: 'Evrak bulunamadı.' }, { status: 404 });
  }

  const absolutePath = getLocalDocumentAbsolutePath(document);
  if (!fs.existsSync(absolutePath)) {
    return NextResponse.json(
      { error: 'Evrak dosyası lokal depoda bulunamadı.' },
      { status: 404 },
    );
  }

  const file = fs.readFileSync(absolutePath);
  return new Response(file, {
    headers: {
      'Content-Type': document.mimeType || 'application/octet-stream',
      'Content-Length': String(file.length),
      'Content-Disposition': contentDisposition(
        path.basename(document.originalFilename),
      ),
    },
  });
}
