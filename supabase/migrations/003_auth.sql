-- Auth tabloları ve RLS politikaları

-- Kullanıcı profilleri
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- Paylaşılan fotoğraf gönderileri
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  original_photo_url text not null,
  ai_photo_url text,
  lat float,
  lon float,
  caption text,
  location_name text,
  likes_count int default 0,
  created_at timestamptz default now()
);

-- Beğeniler
create table likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  post_id uuid not null references posts on delete cascade,
  unique(user_id, post_id)
);

-- Yorumlar
create table comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  post_id uuid not null references posts on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- İndeksler
create index posts_user_id_idx on posts(user_id);
create index posts_created_at_idx on posts(created_at desc);
create index likes_post_id_idx on likes(post_id);
create index comments_post_id_idx on comments(post_id);

-- RLS aktif et
alter table profiles enable row level security;
alter table posts enable row level security;
alter table likes enable row level security;
alter table comments enable row level security;

-- profiles politikaları
create policy "Herkes profilleri okuyabilir"
  on profiles for select using (true);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on profiles for update using (auth.uid() = id);

-- posts politikaları
create policy "Herkes gönderileri okuyabilir"
  on posts for select using (true);

create policy "Giriş yapmış kullanıcı gönderi oluşturabilir"
  on posts for insert with check (auth.uid() = user_id);

create policy "Kullanıcı kendi gönderini güncelleyebilir"
  on posts for update using (auth.uid() = user_id);

create policy "Kullanıcı kendi gönderini silebilir"
  on posts for delete using (auth.uid() = user_id);

-- likes politikaları
create policy "Herkes beğenileri okuyabilir"
  on likes for select using (true);

create policy "Giriş yapmış kullanıcı beğenebilir"
  on likes for insert with check (auth.uid() = user_id);

create policy "Kullanıcı kendi beğenisini silebilir"
  on likes for delete using (auth.uid() = user_id);

-- comments politikaları
create policy "Herkes yorumları okuyabilir"
  on comments for select using (true);

create policy "Giriş yapmış kullanıcı yorum yapabilir"
  on comments for insert with check (auth.uid() = user_id);

create policy "Kullanıcı kendi yorumunu silebilir"
  on comments for delete using (auth.uid() = user_id);

-- Kayıt olunca profiles'a otomatik satır ekleyen trigger
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- likes_count'u otomatik güncelle
create or replace function update_likes_count()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    update posts set likes_count = likes_count + 1 where id = new.post_id;
  elsif TG_OP = 'DELETE' then
    update posts set likes_count = likes_count - 1 where id = old.post_id;
  end if;
  return null;
end;
$$;

create trigger on_like_change
  after insert or delete on likes
  for each row execute procedure update_likes_count();
