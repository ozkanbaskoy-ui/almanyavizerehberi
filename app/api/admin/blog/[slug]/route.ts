import { NextResponse } from 'next/server';

import {
  getBlogPostBySlug,
  saveBlogPostBySlug,
  type BlogEditableFields,
} from '@/lib/content/blog';

type Params = {
  slug: string;
};

export async function GET(
  _request: any,
  context: any,
) {
  try {
    const params = (context as { params: Params }).params;
    const post = getBlogPostBySlug(params.slug);
    return NextResponse.json({
      slug: post.slug,
      title: post.title,
      date: post.date,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      image: post.image ?? '',
      bodyHtml: post.bodyHtml,
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
    const payload = (await request.json()) as BlogEditableFields;
    saveBlogPostBySlug(params.slug, {
      title: payload.title,
      date: payload.date,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      image: payload.image,
      bodyHtml: payload.bodyHtml,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Blog yazısı kaydedilirken hata oluştu',
      },
      { status: 500 },
    );
  }
}
