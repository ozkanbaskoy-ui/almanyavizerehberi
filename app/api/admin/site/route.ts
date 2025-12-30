import { NextResponse } from 'next/server';

import {
  getSiteSettings,
  saveSiteSettings,
  type SiteSettings,
} from '@/lib/settings/site';

export async function GET() {
  const settings = getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SiteSettings>;

    const current = getSiteSettings();

    const next: SiteSettings = {
      siteName: body.siteName ?? current.siteName,
      tagline: body.tagline ?? current.tagline,
      contactEmail: body.contactEmail ?? current.contactEmail,
      contactPhone: body.contactPhone ?? current.contactPhone,
      whatsappNumber: body.whatsappNumber ?? current.whatsappNumber,
      instagramUrl: body.instagramUrl ?? current.instagramUrl,
      youtubeUrl: body.youtubeUrl ?? current.youtubeUrl,
      youtubeChannelId: body.youtubeChannelId ?? current.youtubeChannelId,
      calendlyUrl: body.calendlyUrl ?? current.calendlyUrl,
      payment1Label: body.payment1Label ?? current.payment1Label,
      payment1Amount: body.payment1Amount ?? current.payment1Amount,
      payment1Url: body.payment1Url ?? current.payment1Url,
      payment2Label: body.payment2Label ?? current.payment2Label,
      payment2Amount: body.payment2Amount ?? current.payment2Amount,
      payment2Url: body.payment2Url ?? current.payment2Url,
      maintenanceMode:
        typeof body.maintenanceMode === 'boolean'
          ? body.maintenanceMode
          : current.maintenanceMode,
      maintenanceMessage:
        body.maintenanceMessage ?? current.maintenanceMessage,
    };

    saveSiteSettings(next);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Site ayarları kaydedilirken hata oluştu', error);
    return NextResponse.json(
      { error: 'Site ayarları kaydedilirken hata oluştu' },
      { status: 500 },
    );
  }
}
