import { NextResponse } from 'next/server';

import {
  getPageBySlug,
  savePageBySlug,
  type PageContent,
} from '@/lib/content/pages';

type Params = {
  slug: string;
};

type PageEditableFields = Pick<
  PageContent,
  'title' | 'seoTitle' | 'seoDescription' | 'bodyHtml'
>;

export async function GET(
  _request: any,
  context: any,
) {
  try {
    const params = (context as { params: Params }).params;
    const page = getPageBySlug(params.slug);
    return NextResponse.json({
      slug: page.slug,
      title: page.title,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      bodyHtml: page.bodyHtml,
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
    const payload = (await request.json()) as PageEditableFields;

    savePageBySlug(params.slug, {
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
            : 'Sayfa kaydedilirken bir hata oluştu.',
      },
      { status: 500 },
    );
  }
}

