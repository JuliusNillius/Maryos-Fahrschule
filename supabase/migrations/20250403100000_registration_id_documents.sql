-- Ausweis-Dokumente (privater Bucket, nur Server-Upload via Service Role)
alter table public.registrations
  add column if not exists id_document_front_path text,
  add column if not exists id_document_back_path text;

comment on column public.registrations.id_document_front_path is 'Pfad in Storage-Bucket registration-ids';
comment on column public.registrations.id_document_back_path is 'Pfad in Storage-Bucket registration-ids';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'registration-ids',
  'registration-ids',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
