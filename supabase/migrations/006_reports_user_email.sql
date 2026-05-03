-- reports tablosuna kullanıcı emaili ekle (denormalize, join gerektirmez)
alter table reports add column if not exists user_email text;
