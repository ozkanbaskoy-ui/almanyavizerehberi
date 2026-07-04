-- Almanya Vize Rehberi - Admin + CRM core schema
-- Run this after the existing applications/customers/payments/appointments SQL files.
-- Target: Supabase Postgres with Auth, RLS and private Storage.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles, roles and permissions
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  role text not null default 'case_advisor'
    check (
      role in (
        'super_admin',
        'admin',
        'crm_manager',
        'case_advisor',
        'document_reviewer',
        'finance',
        'readonly'
      )
    ),
  status text not null default 'active'
    check (status in ('active', 'suspended')),
  last_login_at timestamptz,
  two_factor_enabled boolean not null default false
);

-- Compatibility table used by the current admin CRM user screen.
-- In the final Supabase Auth migration, profiles remains the source of truth;
-- crm_users keeps the current password-based local workflow working.
create table if not exists public.crm_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  username text not null unique,
  password_hash text not null,
  password_salt text not null,
  role text not null default 'case_advisor'
    check (
      role in (
        'super_admin',
        'admin',
        'crm_manager',
        'case_advisor',
        'document_reviewer',
        'finance',
        'readonly'
      )
    ),
  status text not null default 'active'
    check (status in ('active', 'suspended')),
  last_login_at timestamptz,
  two_factor_enabled boolean not null default false
);

create index if not exists crm_users_email_idx
  on public.crm_users (email);

create index if not exists crm_users_username_idx
  on public.crm_users (username);

create table if not exists public.permissions (
  id text primary key,
  label text not null,
  module text not null,
  description text
);

create table if not exists public.role_permissions (
  role text not null,
  permission_id text not null references public.permissions (id) on delete cascade,
  primary key (role, permission_id)
);

insert into public.permissions (id, label, module, description)
values
  ('admin.read', 'Admin paneli goruntuleme', 'admin', 'Admin ana ekranlarini gorur.'),
  ('admin.manage_users', 'Kullanici yonetimi', 'admin', 'CRM ve admin kullanicilarini yonetir.'),
  ('admin.manage_site', 'Site yonetimi', 'admin', 'Site, tema, icerik ve SEO ayarlarini yonetir.'),
  ('crm.read_all', 'Tum CRM kayitlarini okuma', 'crm', 'Tum lead ve dosyalari gorur.'),
  ('crm.write_all', 'Tum CRM kayitlarini duzenleme', 'crm', 'Tum lead ve dosyalari duzenler.'),
  ('crm.read_assigned', 'Atanan dosyalari okuma', 'crm', 'Sadece kendine atanan kayitlari gorur.'),
  ('crm.write_assigned', 'Atanan dosyalari duzenleme', 'crm', 'Sadece kendine atanan kayitlari duzenler.'),
  ('documents.review', 'Evrak inceleme', 'documents', 'Belge durumlarini inceler ve gunceller.'),
  ('finance.manage', 'Finans yonetimi', 'finance', 'Odeme ve finans kayitlarini yonetir.'),
  ('audit.read', 'Audit log okuma', 'audit', 'Sistem ve CRM audit kayitlarini gorur.')
on conflict (id) do update
set label = excluded.label,
    module = excluded.module,
    description = excluded.description;

insert into public.role_permissions (role, permission_id)
values
  ('super_admin', 'admin.read'),
  ('super_admin', 'admin.manage_users'),
  ('super_admin', 'admin.manage_site'),
  ('super_admin', 'crm.read_all'),
  ('super_admin', 'crm.write_all'),
  ('super_admin', 'documents.review'),
  ('super_admin', 'finance.manage'),
  ('super_admin', 'audit.read'),
  ('admin', 'admin.read'),
  ('admin', 'admin.manage_users'),
  ('admin', 'admin.manage_site'),
  ('admin', 'crm.read_all'),
  ('admin', 'crm.write_all'),
  ('admin', 'audit.read'),
  ('crm_manager', 'crm.read_all'),
  ('crm_manager', 'crm.write_all'),
  ('crm_manager', 'documents.review'),
  ('crm_manager', 'audit.read'),
  ('case_advisor', 'crm.read_assigned'),
  ('case_advisor', 'crm.write_assigned'),
  ('document_reviewer', 'crm.read_all'),
  ('document_reviewer', 'documents.review'),
  ('finance', 'crm.read_all'),
  ('finance', 'finance.manage'),
  ('readonly', 'crm.read_all')
on conflict do nothing;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.status = 'active'
  limit 1
$$;

create or replace function public.current_user_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role(), '') in (
    'super_admin',
    'admin',
    'crm_manager',
    'case_advisor',
    'document_reviewer',
    'finance',
    'readonly'
  )
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role(), '') in ('super_admin', 'admin')
$$;

create or replace function public.current_user_can_manage_crm()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role(), '') in (
    'super_admin',
    'admin',
    'crm_manager'
  )
$$;

-- ---------------------------------------------------------------------------
-- Existing application table extensions
-- ---------------------------------------------------------------------------

alter table public.applications
  add column if not exists assigned_to uuid references public.profiles (id),
  add column if not exists priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  add column if not exists channel text not null default 'website',
  add column if not exists last_contacted_at timestamptz,
  add column if not exists next_follow_up_at timestamptz,
  add column if not exists converted_case_id uuid;

create index if not exists applications_assigned_to_idx
  on public.applications (assigned_to);

create index if not exists applications_status_idx
  on public.applications (status);

create index if not exists applications_next_follow_up_at_idx
  on public.applications (next_follow_up_at);

-- ---------------------------------------------------------------------------
-- CRM domain tables
-- ---------------------------------------------------------------------------

create table if not exists public.case_statuses (
  id text primary key,
  label text not null,
  sort_order integer not null default 0,
  is_closed boolean not null default false
);

insert into public.case_statuses (id, label, sort_order, is_closed)
values
  ('new', 'Yeni', 10, false),
  ('review', 'Incelemede', 20, false),
  ('documents_waiting', 'Evrak Bekleniyor', 30, false),
  ('appointment_waiting', 'Randevu Bekleniyor', 40, false),
  ('payment_waiting', 'Odeme Bekleniyor', 50, false),
  ('submitted', 'Basvuru Sunuldu', 60, false),
  ('approved', 'Onaylandi', 70, true),
  ('rejected', 'Reddedildi', 80, true),
  ('archived', 'Arsiv', 90, true)
on conflict (id) do update
set label = excluded.label,
    sort_order = excluded.sort_order,
    is_closed = excluded.is_closed;

create table if not exists public.visa_cases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  application_id text references public.applications (id) on delete set null,
  customer_account_id uuid,
  title text not null,
  visa_type text not null,
  status_id text not null default 'new' references public.case_statuses (id),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid references public.profiles (id),
  source text not null default 'web-form',
  expected_submission_at timestamptz,
  closed_at timestamptz,
  summary text
);

create index if not exists visa_cases_application_id_idx
  on public.visa_cases (application_id);

create index if not exists visa_cases_assigned_to_idx
  on public.visa_cases (assigned_to);

create index if not exists visa_cases_status_id_idx
  on public.visa_cases (status_id);

create table if not exists public.case_assignments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  case_id uuid not null references public.visa_cases (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'owner',
  assigned_by uuid references public.profiles (id),
  unique (case_id, user_id, role)
);

create table if not exists public.document_types (
  id text primary key,
  label text not null,
  description text,
  required_by_default boolean not null default true,
  sort_order integer not null default 0
);

insert into public.document_types (id, label, description, required_by_default, sort_order)
values
  ('passport', 'Pasaport', 'Kimlik ve seyahat belgesi.', true, 10),
  ('photo', 'Biyometrik Fotograf', 'Vize basvurusu icin guncel fotograf.', true, 20),
  ('diploma', 'Diploma / Sertifika', 'Egitim ve mesleki yeterlilik kaniti.', true, 30),
  ('cv', 'CV', 'Guncel ozgecmis.', true, 40),
  ('contract', 'Is Sozlesmesi / Kabul Yazisi', 'Almanya tarafindan gelen kabul veya sozlesme.', false, 50),
  ('finance', 'Finansal Kanit', 'Banka dokumu veya finansal yeterlilik belgesi.', false, 60),
  ('insurance', 'Sigorta', 'Saglik veya seyahat sigortasi.', false, 70),
  ('other', 'Diger', 'Dosyaya ozel ek belge.', false, 999)
on conflict (id) do update
set label = excluded.label,
    description = excluded.description,
    required_by_default = excluded.required_by_default,
    sort_order = excluded.sort_order;

create table if not exists public.case_documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  case_id uuid not null references public.visa_cases (id) on delete cascade,
  application_id text references public.applications (id) on delete set null,
  document_type_id text references public.document_types (id),
  storage_bucket text not null default 'crm-documents',
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  size_bytes bigint,
  status text not null default 'uploaded'
    check (status in ('requested', 'uploaded', 'in_review', 'approved', 'rejected', 'expired')),
  uploaded_by uuid references public.profiles (id),
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  review_note text
);

create index if not exists case_documents_case_id_idx
  on public.case_documents (case_id);

create index if not exists case_documents_application_id_idx
  on public.case_documents (application_id);

-- Current Next.js CRM document workflow uses application-linked crm_documents.
-- This keeps local/Supabase behavior simple before every lead is converted to a visa_case.
create table if not exists public.crm_documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  application_id text not null references public.applications (id) on delete cascade,
  document_type text not null,
  original_filename text not null,
  mime_type text,
  size_bytes bigint not null default 0,
  status text not null default 'uploaded'
    check (status in ('requested', 'uploaded', 'in_review', 'approved', 'rejected', 'expired')),
  note text,
  storage_path text not null,
  storage_provider text not null default 'supabase'
    check (storage_provider in ('local', 'supabase')),
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz
);

create index if not exists crm_documents_application_id_idx
  on public.crm_documents (application_id);

create index if not exists crm_documents_status_idx
  on public.crm_documents (status);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  application_id text references public.applications (id) on delete cascade,
  case_id uuid references public.visa_cases (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'done', 'canceled')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  due_at timestamptz,
  assigned_to uuid references public.profiles (id),
  created_by uuid references public.profiles (id)
);

create index if not exists crm_tasks_assigned_to_idx
  on public.crm_tasks (assigned_to);

create index if not exists crm_tasks_due_at_idx
  on public.crm_tasks (due_at);

create table if not exists public.case_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  application_id text references public.applications (id) on delete cascade,
  case_id uuid references public.visa_cases (id) on delete cascade,
  author_id uuid references public.profiles (id),
  visibility text not null default 'internal'
    check (visibility in ('internal', 'customer_visible', 'private')),
  note text not null
);

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  application_id text references public.applications (id) on delete cascade,
  case_id uuid references public.visa_cases (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  type text not null,
  title text not null,
  body text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists crm_activities_application_id_idx
  on public.crm_activities (application_id, created_at desc);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  application_id text references public.applications (id) on delete set null,
  case_id uuid references public.visa_cases (id) on delete set null,
  template_id text,
  recipient text not null,
  subject text,
  status text not null default 'queued'
    check (status in ('queued', 'sent', 'failed')),
  provider_message_id text,
  error_message text
);

create table if not exists public.saved_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner_id uuid references public.profiles (id) on delete cascade,
  module text not null,
  name text not null,
  filters jsonb not null default '{}'::jsonb,
  columns jsonb not null default '[]'::jsonb,
  sort jsonb not null default '{}'::jsonb,
  is_shared boolean not null default false
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid references public.profiles (id) on delete set null,
  actor_name text,
  module text not null,
  action text not null,
  entity_id text,
  entity_label text,
  message text not null,
  severity text not null default 'info'
    check (severity in ('info', 'warning', 'critical')),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create table if not exists public.notification_recipients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  label text,
  receive_leads boolean not null default true,
  receive_payments boolean not null default true,
  receive_errors boolean not null default true,
  active boolean not null default true
);

insert into public.notification_recipients (email, label, receive_leads)
values ('almanyavizerehberi@gmail.com', 'Almanya Vize Rehberi', true)
on conflict (email) do update
set label = excluded.label,
    receive_leads = true,
    active = true;

-- ---------------------------------------------------------------------------
-- Audit trigger for application status/payment changes
-- ---------------------------------------------------------------------------

create or replace function public.log_application_audit_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor text;
begin
  select p.full_name into actor
  from public.profiles p
  where p.id = auth.uid();

  if old.status is distinct from new.status
     or old.payment_status is distinct from new.payment_status
     or old.assigned_to is distinct from new.assigned_to then
    insert into public.audit_logs (
      actor_id,
      actor_name,
      module,
      action,
      entity_id,
      entity_label,
      message,
      severity,
      metadata
    )
    values (
      auth.uid(),
      coalesce(actor, 'Sistem'),
      'applications',
      'update',
      new.id,
      new.full_name,
      'Basvuru guncellendi.',
      'warning',
      jsonb_build_object(
        'old_status', old.status,
        'new_status', new.status,
        'old_payment_status', old.payment_status,
        'new_payment_status', new.payment_status,
        'old_assigned_to', old.assigned_to,
        'new_assigned_to', new.assigned_to
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_applications_audit on public.applications;

create trigger trg_applications_audit
after update on public.applications
for each row
execute function public.log_application_audit_trigger();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.crm_users enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.applications enable row level security;
alter table public.application_events enable row level security;
alter table public.visa_cases enable row level security;
alter table public.case_assignments enable row level security;
alter table public.document_types enable row level security;
alter table public.case_documents enable row level security;
alter table public.crm_documents enable row level security;
alter table public.crm_tasks enable row level security;
alter table public.case_notes enable row level security;
alter table public.crm_activities enable row level security;
alter table public.email_logs enable row level security;
alter table public.saved_views enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notification_recipients enable row level security;

drop policy if exists profiles_select_staff_or_self on public.profiles;
create policy profiles_select_staff_or_self
on public.profiles for select
using (id = auth.uid() or public.current_user_is_staff());

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin
on public.profiles for update
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists crm_users_admin_all on public.crm_users;
create policy crm_users_admin_all
on public.crm_users for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists permissions_select_staff on public.permissions;
create policy permissions_select_staff
on public.permissions for select
using (public.current_user_is_staff());

drop policy if exists role_permissions_select_staff on public.role_permissions;
create policy role_permissions_select_staff
on public.role_permissions for select
using (public.current_user_is_staff());

drop policy if exists applications_public_insert on public.applications;
create policy applications_public_insert
on public.applications for insert
with check (true);

drop policy if exists applications_staff_select on public.applications;
create policy applications_staff_select
on public.applications for select
using (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
  or public.current_profile_role() in ('document_reviewer', 'finance', 'readonly')
);

drop policy if exists applications_staff_update on public.applications;
create policy applications_staff_update
on public.applications for update
using (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
  or public.current_profile_role() in ('document_reviewer', 'finance')
)
with check (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
  or public.current_profile_role() in ('document_reviewer', 'finance')
);

drop policy if exists application_events_staff_select on public.application_events;
create policy application_events_staff_select
on public.application_events for select
using (public.current_user_is_staff());

drop policy if exists application_events_staff_insert on public.application_events;
create policy application_events_staff_insert
on public.application_events for insert
with check (public.current_user_is_staff());

drop policy if exists visa_cases_staff_select on public.visa_cases;
create policy visa_cases_staff_select
on public.visa_cases for select
using (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
  or public.current_profile_role() in ('document_reviewer', 'finance', 'readonly')
);

drop policy if exists visa_cases_staff_write on public.visa_cases;
create policy visa_cases_staff_write
on public.visa_cases for all
using (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
)
with check (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
);

drop policy if exists case_assignments_staff on public.case_assignments;
create policy case_assignments_staff
on public.case_assignments for all
using (public.current_user_can_manage_crm() or user_id = auth.uid())
with check (public.current_user_can_manage_crm());

drop policy if exists document_types_staff_select on public.document_types;
create policy document_types_staff_select
on public.document_types for select
using (public.current_user_is_staff());

drop policy if exists case_documents_staff_select on public.case_documents;
create policy case_documents_staff_select
on public.case_documents for select
using (public.current_user_is_staff());

drop policy if exists case_documents_staff_write on public.case_documents;
create policy case_documents_staff_write
on public.case_documents for all
using (
  public.current_user_can_manage_crm()
  or public.current_profile_role() = 'document_reviewer'
)
with check (
  public.current_user_can_manage_crm()
  or public.current_profile_role() = 'document_reviewer'
);

drop policy if exists crm_documents_staff_select on public.crm_documents;
create policy crm_documents_staff_select
on public.crm_documents for select
using (public.current_user_is_staff());

drop policy if exists crm_documents_staff_write on public.crm_documents;
create policy crm_documents_staff_write
on public.crm_documents for all
using (
  public.current_user_can_manage_crm()
  or public.current_profile_role() = 'document_reviewer'
  or public.current_profile_role() = 'case_advisor'
)
with check (
  public.current_user_can_manage_crm()
  or public.current_profile_role() = 'document_reviewer'
  or public.current_profile_role() = 'case_advisor'
);

drop policy if exists crm_tasks_staff_select on public.crm_tasks;
create policy crm_tasks_staff_select
on public.crm_tasks for select
using (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
  or created_by = auth.uid()
  or public.current_profile_role() in ('document_reviewer', 'finance', 'readonly')
);

drop policy if exists crm_tasks_staff_write on public.crm_tasks;
create policy crm_tasks_staff_write
on public.crm_tasks for all
using (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
  or created_by = auth.uid()
)
with check (
  public.current_user_can_manage_crm()
  or assigned_to = auth.uid()
  or created_by = auth.uid()
);

drop policy if exists case_notes_staff_select on public.case_notes;
create policy case_notes_staff_select
on public.case_notes for select
using (
  public.current_user_can_manage_crm()
  or author_id = auth.uid()
  or visibility <> 'private'
);

drop policy if exists case_notes_staff_insert on public.case_notes;
create policy case_notes_staff_insert
on public.case_notes for insert
with check (public.current_user_is_staff());

drop policy if exists crm_activities_staff_select on public.crm_activities;
create policy crm_activities_staff_select
on public.crm_activities for select
using (public.current_user_is_staff());

drop policy if exists crm_activities_staff_insert on public.crm_activities;
create policy crm_activities_staff_insert
on public.crm_activities for insert
with check (public.current_user_is_staff());

drop policy if exists email_logs_admin_select on public.email_logs;
create policy email_logs_admin_select
on public.email_logs for select
using (
  public.current_user_is_admin()
  or public.current_profile_role() in ('crm_manager', 'finance')
);

drop policy if exists saved_views_owner_or_shared on public.saved_views;
create policy saved_views_owner_or_shared
on public.saved_views for select
using (owner_id = auth.uid() or is_shared = true or public.current_user_is_admin());

drop policy if exists saved_views_owner_write on public.saved_views;
create policy saved_views_owner_write
on public.saved_views for all
using (owner_id = auth.uid() or public.current_user_is_admin())
with check (owner_id = auth.uid() or public.current_user_is_admin());

drop policy if exists audit_logs_admin_select on public.audit_logs;
create policy audit_logs_admin_select
on public.audit_logs for select
using (
  public.current_user_is_admin()
  or public.current_profile_role() = 'crm_manager'
);

drop policy if exists notification_recipients_admin_all on public.notification_recipients;
create policy notification_recipients_admin_all
on public.notification_recipients for all
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

-- ---------------------------------------------------------------------------
-- Private Storage bucket for CRM documents
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'crm-documents',
  'crm-documents',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists crm_documents_storage_select on storage.objects;
create policy crm_documents_storage_select
on storage.objects for select
using (
  bucket_id = 'crm-documents'
  and public.current_user_is_staff()
);

drop policy if exists crm_documents_storage_insert on storage.objects;
create policy crm_documents_storage_insert
on storage.objects for insert
with check (
  bucket_id = 'crm-documents'
  and public.current_user_is_staff()
);

drop policy if exists crm_documents_storage_update on storage.objects;
create policy crm_documents_storage_update
on storage.objects for update
using (
  bucket_id = 'crm-documents'
  and (
    public.current_user_can_manage_crm()
    or public.current_profile_role() = 'document_reviewer'
  )
)
with check (
  bucket_id = 'crm-documents'
  and (
    public.current_user_can_manage_crm()
    or public.current_profile_role() = 'document_reviewer'
  )
);

drop policy if exists crm_documents_storage_delete on storage.objects;
create policy crm_documents_storage_delete
on storage.objects for delete
using (
  bucket_id = 'crm-documents'
  and public.current_user_is_admin()
);
