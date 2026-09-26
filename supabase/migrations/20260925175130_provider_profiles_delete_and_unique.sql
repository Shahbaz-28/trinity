-- Phase 4: professionals can withdraw their own (pending) application, and
-- each real account can have at most one provider_profiles row. Seeded demo
-- providers keep profile_id = null, and multiple NULLs don't violate a
-- unique constraint, so they're unaffected.

alter table public.provider_profiles
  add constraint provider_profiles_profile_id_unique unique (profile_id);

create policy "provider_profiles_delete_own"
  on public.provider_profiles for delete
  using (profile_id = auth.uid());

create policy "provider_profiles_delete_admin"
  on public.provider_profiles for delete
  using (public.is_admin());
