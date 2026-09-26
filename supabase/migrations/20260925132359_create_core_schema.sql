-- Trinity core schema: profiles, provider_profiles, active_services, documents
-- Phase 1 of SUPABASE_PLAN.md

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles: one row per Supabase Auth user
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  full_name         text not null,
  email             text not null,
  role              text not null default 'client' check (role in ('client', 'professional', 'admin')),
  consent_given_at  timestamptz,
  created_at        timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security definer helper so RLS policies can check "is this user an admin"
-- without recursively re-triggering RLS on profiles itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- auto-create a profiles row whenever a new Supabase Auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- provider_profiles: a professional's public listing (CA / Advocate / CS / Accountant)
-- profile_id is nullable so seeded demo providers can exist without a real login.
-- ---------------------------------------------------------------------------
create table public.provider_profiles (
  id                  uuid primary key default gen_random_uuid(),
  profile_id          uuid references public.profiles(id) on delete set null,
  name                text not null,
  email               text,
  category            text not null check (category in ('CA', 'Advocate', 'Company Secretary', 'Accountant')),
  specialization      text not null,
  experience_years    int not null check (experience_years >= 0),
  location            text not null,
  membership_number   text,
  avatar_initial      text not null,
  rating              numeric(2, 1) not null default 5.0,
  reviews_count       int not null default 0,
  status              text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by         uuid references public.profiles(id),
  reviewed_at         timestamptz,
  created_at          timestamptz not null default now()
);

alter table public.provider_profiles enable row level security;
create index provider_profiles_status_idx on public.provider_profiles (status);
create index provider_profiles_category_idx on public.provider_profiles (category);

create policy "provider_profiles_select_approved"
  on public.provider_profiles for select
  using (status = 'approved');

create policy "provider_profiles_select_own"
  on public.provider_profiles for select
  using (profile_id = auth.uid());

create policy "provider_profiles_select_admin"
  on public.provider_profiles for select
  using (public.is_admin());

create policy "provider_profiles_insert_own"
  on public.provider_profiles for insert
  with check (profile_id = auth.uid());

create policy "provider_profiles_update_own"
  on public.provider_profiles for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "provider_profiles_update_admin"
  on public.provider_profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- Owners can edit their own descriptive fields (specialization, location, etc.)
-- but must NOT be able to approve themselves or touch moderation/rating fields.
-- RLS can't restrict individual columns, so a trigger enforces it.
create or replace function public.provider_profiles_guard_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.status := old.status;
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
    new.rating := old.rating;
    new.reviews_count := old.reviews_count;
    new.profile_id := old.profile_id;
  end if;
  return new;
end;
$$;

create trigger provider_profiles_guard_update
  before update on public.provider_profiles
  for each row execute function public.provider_profiles_guard_update();

-- ---------------------------------------------------------------------------
-- active_services: a client's engagement with a provider
-- ---------------------------------------------------------------------------
create table public.active_services (
  id                    uuid primary key default gen_random_uuid(),
  client_id             uuid not null references public.profiles(id) on delete cascade,
  provider_profile_id   uuid not null references public.provider_profiles(id) on delete cascade,
  status                text not null default 'In Progress' check (status in ('In Progress', 'Pending', 'Completed')),
  started_at            timestamptz not null default now()
);

alter table public.active_services enable row level security;
create index active_services_client_idx on public.active_services (client_id);
create index active_services_provider_idx on public.active_services (provider_profile_id);

create policy "active_services_select_client"
  on public.active_services for select
  using (client_id = auth.uid());

create policy "active_services_select_provider"
  on public.active_services for select
  using (
    provider_profile_id in (
      select id from public.provider_profiles where profile_id = auth.uid()
    )
  );

create policy "active_services_select_admin"
  on public.active_services for select
  using (public.is_admin());

create policy "active_services_insert_client"
  on public.active_services for insert
  with check (client_id = auth.uid());

create policy "active_services_update_client"
  on public.active_services for update
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

create policy "active_services_update_provider"
  on public.active_services for update
  using (
    provider_profile_id in (
      select id from public.provider_profiles where profile_id = auth.uid()
    )
  )
  with check (
    provider_profile_id in (
      select id from public.provider_profiles where profile_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- documents: file metadata for an active_service (Storage bucket wiring is Phase 5)
-- ---------------------------------------------------------------------------
create table public.documents (
  id                  uuid primary key default gen_random_uuid(),
  active_service_id   uuid not null references public.active_services(id) on delete cascade,
  title               text not null,
  storage_path        text,
  uploaded_by         uuid not null references public.profiles(id),
  created_at          timestamptz not null default now()
);

alter table public.documents enable row level security;
create index documents_active_service_idx on public.documents (active_service_id);

create policy "documents_select_participant"
  on public.documents for select
  using (
    public.is_admin()
    or active_service_id in (
      select id from public.active_services
      where client_id = auth.uid()
         or provider_profile_id in (select id from public.provider_profiles where profile_id = auth.uid())
    )
  );

create policy "documents_insert_participant"
  on public.documents for insert
  with check (
    uploaded_by = auth.uid()
    and active_service_id in (
      select id from public.active_services
      where client_id = auth.uid()
         or provider_profile_id in (select id from public.provider_profiles where profile_id = auth.uid())
    )
  );
