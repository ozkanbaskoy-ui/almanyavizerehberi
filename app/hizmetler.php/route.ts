import { NextRequest, NextResponse } from 'next/server';

const VISA_PARAM_TO_SLUG: Record<string, string> = {
  '1': 'calisma-vizesi',
  '2': 'mavi-kart-vizesi',
  '3': 'firsat-karti',
  '5': 'mesleki-egitim-vizesi',
  '7': 'aile-birlesimi-vizesi',
  '9': 'yuksekogrenim-vizesi',
  '10': 'dil-kursu-vizesi',
};

export function GET(request: NextRequest) {
  const url = new URL(request.url);
  const l = url.searchParams.get('l') ?? '';

  const slug = VISA_PARAM_TO_SLUG[l] ?? 'calisma-vizesi';

  return NextResponse.redirect(
    new URL(`/hizmetler/${slug}`, request.url),
    308,
  );
}

