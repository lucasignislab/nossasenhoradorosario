-- Avisos da casa e biblioteca de estudos com progresso dos filhos.
-- Avisos e conteúdos publicados são visíveis a qualquer membro ativo;
-- escrita é exclusiva da administração. Progresso é pessoal.

-- Membro ativo autenticado (usado nas políticas de leitura).
create or replace function public.is_active_member()
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
      and status = 'active'
  );
$$;

revoke all on function public.is_active_member() from public;
grant execute on function public.is_active_member() to authenticated;

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  body text not null,
  category text not null default 'geral' check (char_length(category) between 2 and 60),
  pinned boolean not null default false,
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notices_published_idx on public.notices (pinned desc, published_at desc);

create table public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  description text,
  kind text not null check (kind in ('video', 'artigo', 'documento')),
  url text not null,
  module text,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  published boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contents_module_idx on public.contents (module, sort_order);

create table public.content_progress (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (content_id, profile_id)
);

alter table public.notices enable row level security;
alter table public.contents enable row level security;
alter table public.content_progress enable row level security;

create policy "Membros ativos leem os avisos"
on public.notices for select
to authenticated
using (public.is_active_member());

create policy "Administração cria avisos"
on public.notices for insert
to authenticated
with check (public.is_administrator());

create policy "Administração atualiza avisos"
on public.notices for update
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Administração exclui avisos"
on public.notices for delete
to authenticated
using (public.is_administrator());

create policy "Membros ativos leem conteúdos publicados"
on public.contents for select
to authenticated
using (public.is_administrator() or (published and public.is_active_member()));

create policy "Administração cria conteúdos"
on public.contents for insert
to authenticated
with check (public.is_administrator());

create policy "Administração atualiza conteúdos"
on public.contents for update
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Administração exclui conteúdos"
on public.contents for delete
to authenticated
using (public.is_administrator());

create policy "Filhos visualizam o próprio progresso"
on public.content_progress for select
to authenticated
using ((select auth.uid()) = profile_id or public.is_administrator());

create policy "Filhos marcam o próprio progresso"
on public.content_progress for insert
to authenticated
with check ((select auth.uid()) = profile_id);

create policy "Filhos desfazem o próprio progresso"
on public.content_progress for delete
to authenticated
using ((select auth.uid()) = profile_id or public.is_administrator());

grant select on public.notices to authenticated;
grant insert, update, delete on public.notices to authenticated;
grant select on public.contents to authenticated;
grant insert, update, delete on public.contents to authenticated;
grant select, insert, delete on public.content_progress to authenticated;

-- Mantém updated_at sempre atualizado.
create or replace function public.touch_updated_at_generic()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger touch_notices_updated_at
before update on public.notices
for each row execute procedure public.touch_updated_at_generic();

create trigger touch_contents_updated_at
before update on public.contents
for each row execute procedure public.touch_updated_at_generic();
