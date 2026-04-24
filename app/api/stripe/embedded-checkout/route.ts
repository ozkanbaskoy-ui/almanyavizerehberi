import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getFixedPaymentOption } from '@/lib/payments/fixedPayments';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    })
  : null;

type Body = {
  paymentSlug?: string;
};

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          'Stripe gizli anahtarı tanımlı değil. STRIPE_SECRET_KEY değerini Vercel ortam değişkenlerine ekleyin.',
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const option = body.paymentSlug
    ? getFixedPaymentOption(body.paymentSlug)
    : null;

  if (!option) {
    return NextResponse.json(
      { error: 'Geçerli bir ödeme seçeneği bulunamadı.' },
      { status: 400 },
    );
  }

  const headerList = await headers();
  const origin =
    headerList.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: option.currency,
            unit_amount: option.amount * 100,
            product_data: {
              name: option.label,
              description: option.description,
            },
          },
          quantity: 1,
        },
      ],
      return_url: `${origin}/${option.slug}/sonuc?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        payment_slug: option.slug,
        product_name: option.label,
      },
    });

    if (!session.client_secret) {
      throw new Error('Stripe istemci anahtarı oluşmadı.');
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Stripe ödeme formu oluşturulurken bir hata oluştu.',
      },
      { status: 500 },
    );
  }
}
