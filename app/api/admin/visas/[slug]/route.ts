import { NextResponse } from 'next/server';

import {
  getVisaBySlug,
  saveVisaBySlug,
  type VisaEditableFields,
} from '@/lib/content/visas';

type Params = {
  slug: string;
};

export async function GET(
  _request: any,
  context: any,
) {
  try {
    const params = (context as { params: Params }).params;
    const visa = getVisaBySlug(params.slug);
    return NextResponse.json({
      slug: visa.slug,
      title: visa.title,
      seoTitle: visa.seoTitle,
      seoDescription: visa.seoDescription,
      bodyHtml: visa.bodyHtml,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Not found' },
      { status: 404 },
    );
  }
}

export async function POST(
  request: any,
  context: any,
) {
  try {
    const params = (context as { params: Params }).params;
    const payload = (await request.json()) as VisaEditableFields;
    saveVisaBySlug(params.slug, {
      title: payload.title,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      bodyHtml: payload.bodyHtml,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Visa içeriği kaydedilirken hata oluştu',
      },
      { status: 500 },
    );
  }
}
