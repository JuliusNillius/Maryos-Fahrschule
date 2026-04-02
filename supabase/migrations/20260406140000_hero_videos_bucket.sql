-- Öffentlicher Bucket für Hero-Hintergrundvideos (MP4). Nur Lesen für alle; Upload z. B. über Dashboard oder Service Role.
-- URLs in Vercel: NEXT_PUBLIC_HERO_VIDEO_DESKTOP_URL / NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hero-videos',
  'hero-videos',
  true,
  104857600, -- 100 MiB pro Datei
  array['video/mp4']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "hero_videos_public_read" on storage.objects;

create policy "hero_videos_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'hero-videos');
