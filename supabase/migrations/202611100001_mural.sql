-- Mural "Quem vai levar": listas de contribuição vinculadas a cada gira.
-- Gestores de conteúdo criam os itens (com meta de quantidade opcional);
-- os filhos se comprometem com quantidades e a administração marca a entrega.

create table public.mural_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  category text not null default 'outros'
    check (category in ('velas', 'flores', 'mantimentos', 'bebidas', 'limpeza', 'outros')),
  quantity_total numeric(10,2) check (quantity_total is null or quantity_total > 0),
  unit text not null default 'un' check (char_length(unit) between 1 and 12),
  note text check (note is null or char_length(note) <= 240),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mural_items_event_idx on public.mural_items (event_id);

create table public.mural_pledges (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.mural_items(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  quantity numeric(10,2) not null check (quantity > 0),
  note text check (note is null or char_length(note) <= 240),
  delivered boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (item_id, profile_id)
);

create index mural_pledges_item_idx on public.mural_pledges (item_id);
create index mural_pledges_profile_idx on public.mural_pledges (profile_id);

alter table public.mural_items enable row level security;
alter table public.mural_pledges enable row level security;

-- Itens: todos do portal leem; somente gestores de conteúdo escrevem.
create policy "Membros visualizam itens do mural"
on public.mural_items for select
to authenticated
using (true);

create policy "Gestores de conteúdo criam itens do mural"
on public.mural_items for insert
to authenticated
with check (public.is_content_manager());

create policy "Gestores de conteúdo atualizam itens do mural"
on public.mural_items for update
to authenticated
using (public.is_content_manager())
with check (public.is_content_manager());

create policy "Gestores de conteúdo excluem itens do mural"
on public.mural_items for delete
to authenticated
using (public.is_content_manager());

-- Compromissos: todos leem (transparência da corrente); cada filho gerencia
-- os próprios; gestores podem remover e marcar entrega.
create policy "Membros visualizam compromissos do mural"
on public.mural_pledges for select
to authenticated
using (true);

create policy "Filho cria o próprio compromisso"
on public.mural_pledges for insert
to authenticated
with check ((select auth.uid()) = profile_id and delivered = false);

create policy "Filho atualiza o próprio compromisso"
on public.mural_pledges for update
to authenticated
using ((select auth.uid()) = profile_id or public.is_content_manager())
with check ((select auth.uid()) = profile_id or public.is_content_manager());

create policy "Filho ou gestor remove compromisso"
on public.mural_pledges for delete
to authenticated
using ((select auth.uid()) = profile_id or public.is_content_manager());

-- Somente gestores de conteúdo podem alterar a marcação de entrega.
create or replace function public.protect_mural_pledge_delivered()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.delivered is distinct from old.delivered and not public.is_content_manager() then
    raise exception 'Somente a administração pode marcar a entrega.';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_mural_pledge_delivered
before update on public.mural_pledges
for each row execute procedure public.protect_mural_pledge_delivered();

create or replace function public.touch_mural_item_updated_at()
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

create trigger touch_mural_item_updated_at
before update on public.mural_items
for each row execute procedure public.touch_mural_item_updated_at();

-- Nomes de quem se comprometeu: a tabela profiles só expõe o próprio perfil
-- aos filhos; esta view (security definer) libera apenas nome, quantidade e
-- entrega para a corrente ver quem leva o quê.
create or replace view public.mural_roster
with (security_barrier = true) as
select
  p.item_id,
  p.profile_id,
  pr.full_name,
  p.quantity,
  p.delivered
from public.mural_pledges p
join public.profiles pr on pr.id = p.profile_id;

grant select, insert, update, delete on public.mural_items to authenticated;
grant select, insert, update, delete on public.mural_pledges to authenticated;
grant select on public.mural_roster to authenticated;
