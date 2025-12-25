import { NextResponse } from 'next/server';

import {
  getServiceBySlug,
  saveServiceBySlug,
  type ServiceEditableFields,
} from '@/lib/content/services';

type Params = {
  slug: string;
};

export async function GET(
  _request: any,
  context: any,
) {
  try {
    const params = (context as { params: Params }).params;
    const service = getServiceBySlug(params.slug);
    return NextResponse.json({
      slug: service.slug,
      title: service.title,
      seoTitle: service.seoTitle,
      seoDescription: service.seoDescription,
      bodyHtml: service.bodyHtml,
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
    const payload = (await request.json()) as ServiceEditableFields;
    saveServiceBySlug(params.slug, {
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
            : 'Hizmet içeriği kaydedilirken hata oluştu',
      },
      { status: 500 },
    );
  }
}
