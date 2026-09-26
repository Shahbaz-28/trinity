-- A professional needs to see who chose them (at least name/email) to make
-- the "My Clients" view useful. Without this, profiles_select_own_or_admin
-- silently blocks the embedded client profile in any query a provider runs.

create policy "profiles_select_by_provider"
  on public.profiles for select
  using (
    id in (
      select client_id from public.active_services
      where provider_profile_id in (
        select id from public.provider_profiles where profile_id = auth.uid()
      )
    )
  );
