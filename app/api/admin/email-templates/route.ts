import { NextResponse } from 'next/server';

import {
  getEmailTemplates,
  saveEmailTemplates,
  type EmailTemplatesConfig,
} from '@/lib/settings/emailTemplates';

export async function GET() {
  const config = getEmailTemplates();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EmailTemplatesConfig;

    if (!body.templates || !Array.isArray(body.templates)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta şablonu verisi.' },
        { status: 400 },
      );
    }

    saveEmailTemplates({
      templates: body.templates,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('E-posta şablonları kaydedilirken hata oluştu', error);
    return NextResponse.json(
      { error: 'E-posta şablonları kaydedilirken hata oluştu.' },
      { status: 500 },
    );
  }
}

