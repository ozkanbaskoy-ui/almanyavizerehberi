import { NextRequest, NextResponse } from 'next/server';

const SERVICE_PARAM_TO_SLUG: Record<string, string> = {
  '1': 'oturum-izni-basvurusu-ve-yenilenmesi',
  '2': 'yabancilar-dairesi-islemleri',
  '3': 'calisma-izni',
  '4': 'sigorta-ve-sosyal-guvenlik',
  '5': 'vergi-islemleri',
  '6': 'dil-egitimi-ve-entegrasyon-kurslari',
  '7': 'barinma-ve-emlak-islemleri',
  '8': 'egitim-ve-cocuklarin-egitimi',
  '9': 'hukuki-danismanlik-ve-haklar',
  '10': 'kulturel-ve-sosyal-rehberlik',
};

export function GET(request: NextRequest) {
  const url = new URL(request.url);
  const l = url.searchParams.get('l') ?? '';

  const slug =
    SERVICE_PARAM_TO_SLUG[l] ?? 'oturum-izni-basvurusu-ve-yenilenmesi';

  return NextResponse.redirect(
    new URL(`/servisler/${slug}`, request.url),
    308,
  );
}

