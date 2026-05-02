-- reports bucket: vatandaş fotoğrafları için public storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reports',
  'reports',
  true,
  5242880, -- 5MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do nothing;

-- Herkes okuyabilir (public bucket)
create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'reports');

-- Herkes yükleyebilir (auth yok, hackathon modu)
create policy "Public upload access"
  on storage.objects for insert
  with check (bucket_id = 'reports');
