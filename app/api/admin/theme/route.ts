import { NextResponse } from 'next/server';

import {
  getThemeSettings,
  saveThemeSettings,
  type ThemeSettings,
} from '@/lib/settings/theme';
import type {
  ThemeCustomColors,
  ThemeKey,
} from '@/lib/settings/theme-presets';

type ThemePayload = {
  activeTheme?: ThemeKey;
  customColors?: Partial<ThemeCustomColors>;
};

export async function GET() {
  const settings = getThemeSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ThemePayload;

    if (!body.activeTheme) {
      return NextResponse.json(
        { error: 'activeTheme zorunludur' },
        { status: 400 },
      );
    }

    const nextSettings: ThemeSettings = {
      activeTheme: body.activeTheme,
      customColors: {
        heroFrom: body.customColors?.heroFrom ?? '',
        heroTo: body.customColors?.heroTo ?? '',
        videoBg: body.customColors?.videoBg ?? '',
        videoBorder: body.customColors?.videoBorder ?? '',
      },
    };

    saveThemeSettings(nextSettings);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Tema ayarları kaydedilirken hata oluştu', error);
    return NextResponse.json(
      { error: 'Tema ayarları kaydedilirken hata oluştu' },
      { status: 500 },
    );
  }
}

