-- Agenda da casa: giras, festividades, ações sociais e cursos.
-- Eventos confirmados são conteúdo público (Home e /agenda). Escrita e
-- cancelamento só pela administração. Confirmações de presença são dos filhos.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  entity text,
  description text,
  details text,
  category text not null default 'gira'
    check (category in ('gira', 'festividade', 'acao-social', 'curso')),
  event_date date not null,
  event_time time,
  location text not null default 'T. U. Senhora do Rosário',
  image_url text,
  status text not null default 'confirmada'
    check (status in ('confirmada', 'cancelada')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_date_idx on public.events (event_date);

create table public.event_confirmations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

alter table public.events enable row level security;
alter table public.event_confirmations enable row level security;

-- is_administrator() precisa ser executável por visitantes anônimos para que a
-- política de leitura pública consiga liberar todos os eventos para admins.
grant execute on function public.is_administrator() to anon;

-- Leitura pública de eventos confirmados; administração vê tudo (inclui cancelados).
create policy "Eventos confirmados são públicos"
on public.events for select
to anon, authenticated
using (status = 'confirmada' or public.is_administrator());

create policy "Administração cria eventos"
on public.events for insert
to authenticated
with check (public.is_administrator());

create policy "Administração atualiza eventos"
on public.events for update
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Administração exclui eventos"
on public.events for delete
to authenticated
using (public.is_administrator());

-- Confirmações: cada filho cuida das próprias; administração visualiza todas.
create policy "Filhos visualizam as próprias confirmações"
on public.event_confirmations for select
to authenticated
using ((select auth.uid()) = profile_id or public.is_administrator());

create policy "Filhos confirmam a própria presença"
on public.event_confirmations for insert
to authenticated
with check ((select auth.uid()) = profile_id);

create policy "Filhos cancelam a própria confirmação"
on public.event_confirmations for delete
to authenticated
using ((select auth.uid()) = profile_id or public.is_administrator());

grant select on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;
grant select, insert, delete on public.event_confirmations to authenticated;

-- Mantém updated_at dos eventos sempre atualizado.
create or replace function public.touch_event_updated_at()
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

create trigger touch_event_updated_at
before update on public.events
for each row execute procedure public.touch_event_updated_at();
