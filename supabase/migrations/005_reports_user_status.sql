-- reports tablosuna kullanıcı ve durum alanları ekle
alter table reports
  add column if not exists user_id uuid references profiles(id) on delete set null,
  add column if not exists status  text not null default 'open'
    check (status in ('open', 'resolved', 'deleted'));
