-- Profiles tablosuna role kolonu ekle
alter table profiles
  add column if not exists role text
    check (role in ('citizen', 'staff'))
    default 'citizen';

-- full_name kolonu da ekle
alter table profiles
  add column if not exists full_name text;

-- Mevcut kullanıcılara citizen rolü ata
update profiles set role = 'citizen' where role is null;

-- Trigger'ı role'ü de içerecek şekilde güncelle
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'citizen'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
