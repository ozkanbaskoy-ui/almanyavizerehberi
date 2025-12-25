-- Supabase tablo taslagi: Stripe odemeleri

create table if not exists public.payments (
  id text primary key, -- Stripe odeme kimligi (checkout.session veya payment_intent)
  created_at timestamptz default now() not null,
  stripe_object text not null, -- 'checkout.session' veya 'payment_intent'
  amount bigint not null,
  currency text not null,
  status text not null,
  customer_email text,
  application_id text references public.applications (id)
);

