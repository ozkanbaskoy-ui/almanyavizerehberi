-- Supabase tablo taslağı: başvurular ve olaylar (timeline)

create table if not exists public.applications (
  id text primary key,
  created_at timestamptz default now() not null,
  full_name text not null,
  email text not null,
  phone text not null,
  visa_type text not null,
  status text not null default 'yeni',
  payment_status text not null default 'bekliyor',
  source text not null default 'web-form'
);

create table if not exists public.application_events (
  id uuid primary key default gen_random_uuid(),
  application_id text not null references public.applications (id) on delete cascade,
  created_at timestamptz default now() not null,
  type text not null,
  message text not null
);

