-- Storage bucket kurulumu
-- Supabase SQL Editor'da çalıştır

-- "photos" bucket oluştur (public read)
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Herkes görselleri okuyabilir
create policy "Görseller herkese açık"
  on storage.objects for select
  using (bucket_id = 'photos');

-- Giriş yapmış kullanıcı yükleyebilir
create policy "Giriş yapmış kullanıcı yükleyebilir"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and auth.role() = 'authenticated'
  );

-- Kullanıcı kendi yüklediğini silebilir
create policy "Kullanıcı kendi dosyasını silebilir"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
