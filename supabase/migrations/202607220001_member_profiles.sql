-- Fundação da Área dos Filhos
-- Novos cadastros sempre começam como membros pendentes. Papéis e aprovação
-- só podem ser alterados pela administração.

create type public.app_role as enum ('member', 'admin', 'developer');
create type public.member_status as enum ('pending', 'active', 'suspended');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 3 and 120),
  phone text,
  role public.app_role not null default 'member',
  status public.member_status not null default 'pending',
  joined_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_administrator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'developer')
      and status = 'active'
  );
$$;

revoke all on function public.is_administrator() from public;
grant execute on function public.is_administrator() to authenticated;

create policy "Membros visualizam o próprio perfil"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or public.is_administrator());

create policy "Membros atualizam o próprio perfil"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id or public.is_administrator())
with check ((select auth.uid()) = id or public.is_administrator());

create or replace function public.protect_profile_access_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_administrator() then
    new.role := old.role;
    new.status := old.status;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_profile_access_fields
before update on public.profiles
for each row execute procedure public.protect_profile_access_fields();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

grant select, update on public.profiles to authenticated;
