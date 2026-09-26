-- Real file storage for engagement documents (the `documents` table itself
-- was created in Phase 1 but never wired to an actual Storage bucket).
-- Objects are stored at path "{active_service_id}/{filename}" so RLS can
-- scope access per-engagement using the folder name.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760, -- 10 MB
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

create policy "documents_bucket_select_participant"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (
      public.is_admin()
      or (storage.foldername(name))[1]::uuid in (
        select id from public.active_services
        where client_id = auth.uid()
           or provider_profile_id in (select id from public.provider_profiles where profile_id = auth.uid())
      )
    )
  );

create policy "documents_bucket_insert_participant"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1]::uuid in (
      select id from public.active_services
      where client_id = auth.uid()
         or provider_profile_id in (select id from public.provider_profiles where profile_id = auth.uid())
    )
  );
