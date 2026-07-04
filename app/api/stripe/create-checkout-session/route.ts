import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getSiteSettings } from '@/lib/settings/site';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe =
  stripeSecretKey && stripeSecretKey.length > 0
    ? new Stripe(stripeSecretKey, {
        apiVersion: '2024-06-20',
      })
    : null;

type Body = {
  optionId?: string;
};

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          'Stripe anahtarları tanımlı değil. STRIPE_SECRET_KEY değerini .env.local dosyasında ayarlayın.',
      },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await request.json().catch(() => ({}))) as Body;
  } catch {
    body = {};
  }

  const optionId = body.optionId;

  if (!optionId) {
    return NextResponse.json(
      { error: 'Geçerli bir ödeme seçeneği belirtilmedi.' },
      { status: 400 },
    );
  }

  const site = getSiteSettings();

  let label: string | undefined;
  let amountStr: string | undefined;

  if (optionId === 'payment1') {
    label = site.payment1Label;
    amountStr = site.payment1Amount;
  } else if (optionId === 'payment2') {
    label = site.payment2Label;
    amountStr = site.payment2Amount;
  }

  if (!label) {
    return NextResponse.json(
      { error: 'Seçilen ödeme seçeneği için başlık tanımlı değil.' },
      { status: 400 },
    );
  }

  const rawAmount = amountStr ?? '';
  const normalized = rawAmount
    .replace(',', '.')
    .replace(/[^\d.]/g, '');

  const parsed = parseFloat(normalized || '0');
  if (!(parsed > 0)) {
    return NextResponse.json(
      {
        error:
          'Seçilen ödeme seçeneği için geçerli bir tutar tanımlı değil. Lütfen admin panelinden tutarı sayısal olarak girin (örn. 99 veya 99.00).',
      },
      { status: 400 },
    );
  }

  const amountInCents = Math.round(parsed * 100);

  const headerList = await headers();
  const origin =
    headerList.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: amountInCents,
            product_data: {
              name: label,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/odeme?success=1`,
      cancel_url: `${origin}/odeme?canceled=1`,
      metadata: {
        payment_option: optionId,
        product_name: label,
      },
    });

    if (!session.url) {
      throw new Error('Stripe oturum URL\'i oluşmadı.');
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Stripe oturumu oluşturulurken bir hata oluştu.',
      },
      { status: 500 },
    );
  }
}
