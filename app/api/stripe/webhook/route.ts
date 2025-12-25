import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getSupabaseServerClient } from '@/lib/db/supabaseServer';
import { sendTemplatedEmail } from '@/lib/notifications/email';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe =
  stripeSecretKey && stripeSecretKey.length > 0
    ? new Stripe(stripeSecretKey, {
        apiVersion: '2024-06-20',
      })
    : null;

async function upsertPaymentFromCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const supabase = getSupabaseServerClient();

  const amount = session.amount_total ?? 0;
  const currency = session.currency ?? 'eur';
  const customerEmail =
    session.customer_email ??
    session.customer_details?.email ??
    null;
  const applicationId =
    (session.metadata?.application_id as string | undefined) ??
    null;

  await supabase.from('payments').upsert(
    {
      id: session.id,
      stripe_object: 'checkout.session',
      amount,
      currency,
      status: session.payment_status ?? 'paid',
      customer_email: customerEmail,
      application_id: applicationId,
    },
    { onConflict: 'id' },
  );

  // Ödeme alındığında isteğe bağlı teşekkür e-postası
  if (customerEmail) {
    try {
      const paidAt = new Date().toISOString();
      await sendTemplatedEmail({
        templateId: 'payment_received',
        to: customerEmail,
        variables: {
          fullName: session.customer_details?.name ?? '',
          amount: (amount / 100).toFixed(2) + ' ' + currency.toUpperCase(),
          productName:
            (session.metadata?.product_name as string | undefined) ??
            'Danışmanlık Hizmeti',
          paidAt,
          applicationId: applicationId ?? '',
        },
      });
    } catch (err) {
      console.warn(
        '[stripe] Ödeme alındı e-postası gönderilemedi:',
        err,
      );
    }
  }
}

async function upsertPaymentFromPaymentIntent(
  intent: Stripe.PaymentIntent,
  statusOverride?: string,
) {
  const supabase = getSupabaseServerClient();

  const amount = intent.amount_received ?? intent.amount ?? 0;
  const currency = intent.currency ?? 'eur';
  const customerEmail =
    (intent.receipt_email as string | null | undefined) ??
    null;
  const applicationId =
    (intent.metadata?.application_id as string | undefined) ??
    null;

  await supabase.from('payments').upsert(
    {
      id: intent.id,
      stripe_object: 'payment_intent',
      amount,
      currency,
      status: statusOverride ?? intent.status ?? 'unknown',
      customer_email: customerEmail,
      application_id: applicationId,
    },
    { onConflict: 'id' },
  );
}

export async function POST(request: Request) {
  if (!stripe || !stripeWebhookSecret) {
    return NextResponse.json(
      {
        error:
          'Stripe anahtarlari tanimli degil. STRIPE_SECRET_KEY ve STRIPE_WEBHOOK_SECRET ortam degiskenlerini ayarlayin.',
      },
      { status: 500 },
    );
  }

  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Eksik Stripe imza basligi.' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret,
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Webhook dogrulama hatasi';
    return NextResponse.json(
      { error: `Stripe webhook dogrulanamadi: ${message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data
          .object as Stripe.Checkout.Session;
        await upsertPaymentFromCheckoutSession(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const intent = event.data
          .object as Stripe.PaymentIntent;
        await upsertPaymentFromPaymentIntent(intent, 'succeeded');
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data
          .object as Stripe.PaymentIntent;
        await upsertPaymentFromPaymentIntent(intent, 'failed');
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const intentId = charge.payment_intent;
        if (typeof intentId === 'string') {
          const supabase = getSupabaseServerClient();
          await supabase
            .from('payments')
            .update({ status: 'refunded' })
            .eq('id', intentId);
        }
        break;
      }
      default:
        // Desteklemedigimiz event tipleri sessizce gormezden gelinir.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Webhook isleme hatasi';
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
