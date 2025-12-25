import { NextResponse } from 'next/server';

import {
  getTypographySettings,
  saveTypographySettings,
  type TypographySettings,
} from '@/lib/settings/typography';

export async function GET() {
  const settings = getTypographySettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TypographySettings>;

    if (!body.scale) {
      return NextResponse.json(
        { error: 'scale zorunludur' },
        { status: 400 },
      );
    }

    const nextSettings: TypographySettings = {
      scale: body.scale,
      font: body.font ?? 'plus-jakarta',
    };

    saveTypographySettings(nextSettings);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Tipografi ayarları kaydedilirken hata oluştu', error);
    return NextResponse.json(
      { error: 'Tipografi ayarları kaydedilirken hata oluştu' },
      { status: 500 },
    );
  }
}
