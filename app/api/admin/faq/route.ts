import { NextResponse } from 'next/server';

import { getAllFaq, saveAllFaq, type FAQItem } from '@/lib/content/faq';

export async function GET() {
  const items = getAllFaq();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FAQItem[];
    saveAllFaq(payload);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'SSS kaydedilirken hata oluştu',
      },
      { status: 500 },
    );
  }
}

