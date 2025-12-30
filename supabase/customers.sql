-- Supabase tablo taslagi: Musteri hesaplari
--
-- Bu tablo, admin panelinden olusturulan musteri kullanicilarini ve
-- her bir musteriye ozel Stripe odeme linkini saklamak icin
-- kullanilir. Tabloyu olusturmak icin Supabase projenizde SQL
-- editorunden bu dosya icerigini calistirmaniz yeterlidir.

create table if not exists public.customer_accounts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Musteri temel bilgileri
  full_name text not null,
  email text not null unique,
  username text not null unique,

  -- Basit custom auth icin sifre alanlari (PBKDF2 hash + salt)
  password_hash text not null,
  password_salt text not null,

  -- Her musteri icin Stripe Payment Link (admin panelinden girilecek)
  stripe_payment_link_url text
);

create index if not exists customer_accounts_email_idx
  on public.customer_accounts (email);

create index if not exists customer_accounts_username_idx
  on public.customer_accounts (username);

