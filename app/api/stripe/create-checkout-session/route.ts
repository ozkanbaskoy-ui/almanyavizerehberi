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
          'Stripe anahtarlari tanimli degil. STRIPE_SECRET_KEY degerini .env.local dosyasinda ayarlayin.',
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
      { error: 'Gecerli bir odeme secenegi belirtilmedi.' },
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
      { error: 'Secilen odeme secenegi icin baslik tanimli degil.' },
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
          'Secilen odeme secenegi icin gecerli bir tutar tanimli degil. Lutfen admin panelinden tutari sayisal olarak girin (orn: 99 veya 99.00).',
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
      throw new Error('Stripe oturum URL\'i olusmadi.');
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Stripe oturumu olusturulurken bir hata olustu.',
      },
      { status: 500 },
    );
  }
}

