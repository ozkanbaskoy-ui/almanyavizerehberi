import { NextResponse } from 'next/server';

import {
  getHomeSettings,
  saveHomeSettings,
  type HomeSettings,
} from '@/lib/settings/home';

export async function GET() {
  const settings = getHomeSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HomeSettings;

    if (!body.hero || !body.videos) {
      return NextResponse.json(
        { error: 'Geçersiz veri' },
        { status: 400 },
      );
    }

    saveHomeSettings(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Ana sayfa ayarları kaydedilirken hata oluştu', error);
    return NextResponse.json(
      { error: 'Ana sayfa ayarları kaydedilirken hata oluştu' },
      { status: 500 },
    );
  }
}

