-- Supabase tablo taslagi: Calendly randevulari

create table if not exists public.appointments (
  id text primary key, -- Calendly event veya invitee URI'si
  created_at timestamptz default now() not null,
  scheduled_at timestamptz not null,
  status text not null, -- 'scheduled' veya 'canceled'
  invitee_name text,
  invitee_email text,
  event_type text,
  application_id text references public.applications (id),
  source text not null default 'calendly'
);

