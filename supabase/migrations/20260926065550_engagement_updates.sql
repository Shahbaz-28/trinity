-- Engagement timeline: the professional posts dated, free-form progress
-- updates against an engagement; the client watches them chronologically.
-- This is the "what step it reached" tracker — active_services.status stays
-- the coarse overall bucket (In Progress/Pending/Completed).

create table public.engagement_updates (
  id                  uuid primary key default gen_random_uuid(),
  active_service_id   uuid not null references public.active_services(id) on delete cascade,
  title               text not null,
  note                text,
  created_by          uuid not null references public.profiles(id),
  created_at          timestamptz not null default now()
);

alter table public.engagement_updates enable row level security;
create index engagement_updates_active_service_idx on public.engagement_updates (active_service_id);

create policy "engagement_updates_select_participant"
  on public.engagement_updates for select
  using (
    public.is_admin()
    or active_service_id in (
      select id from public.active_services
      where client_id = auth.uid()
         or provider_profile_id in (select id from public.provider_profiles where profile_id = auth.uid())
    )
  );

-- Only the professional posts updates — it's a status log, not a chat thread.
create policy "engagement_updates_insert_provider"
  on public.engagement_updates for insert
  with check (
    created_by = auth.uid()
    and active_service_id in (
      select id from public.active_services
      where provider_profile_id in (select id from public.provider_profiles where profile_id = auth.uid())
    )
  );
