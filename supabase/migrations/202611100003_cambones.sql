-- Escala de cambone por gira. A gestão escala; o cambone confirma ou recusa
-- pelo próprio portal (mesma filosofia do auto-registro de frequência).
-- Transparência: todos veem quem está escalado em cada gira.

create table public.cambone_assignments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_note text check (role_note is null or char_length(role_note) <= 120),
  status text not null default 'escalado'
    check (status in ('escalado', 'confirmado', 'recusado')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

create index cambone_assignments_event_idx on public.cambone_assignments (event_id);
create index cambone_assignments_profile_idx on public.cambone_assignments (profile_id);

alter table public.cambone_assignments enable row level security;

create policy "Membros visualizam a escala de cambone"
on public.cambone_assignments for select
to authenticated
using (true);

create policy "Gestores de conteúdo escalam cambones"
on public.cambone_assignments for insert
to authenticated
with check (public.is_content_manager());

create policy "Gestores ou o próprio cambone atualizam a escala"
on public.cambone_assignments for update
to authenticated
using (public.is_content_manager() or (select auth.uid()) = profile_id)
with check (public.is_content_manager() or (select auth.uid()) = profile_id);

create policy "Gestores de conteúdo removem da escala"
on public.cambone_assignments for delete
to authenticated
using (public.is_content_manager());

-- O cambone só pode responder (confirmar/recusar) a própria escala; gira,
-- pessoa e observação só mudam pela gestão.
create or replace function public.protect_cambone_assignment_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_content_manager() then
    if new.event_id is distinct from old.event_id
      or new.profile_id is distinct from old.profile_id
      or new.role_note is distinct from old.role_note then
      raise exception 'Somente a administração pode alterar a escala.';
    end if;
    if new.status not in ('confirmado', 'recusado') then
      raise exception 'Resposta inválida para a escala.';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_cambone_assignment_fields
before update on public.cambone_assignments
for each row execute procedure public.protect_cambone_assignment_fields();

-- Nomes dos escalados e dos filhos ativos: profiles só expõe o próprio perfil
-- (ou tudo, para administração). Estas views security definer liberam o
-- mínimo necessário para a corrente e para o seletor da gestão (inclui o
-- papel editor, que não lê profiles).
create or replace view public.cambone_roster
with (security_barrier = true) as
select
  a.event_id,
  a.profile_id,
  pr.full_name,
  a.status
from public.cambone_assignments a
join public.profiles pr on pr.id = a.profile_id;

create or replace view public.directory_members
with (security_barrier = true) as
select id, full_name
from public.profiles
where status = 'active';

grant select, insert, update, delete on public.cambone_assignments to authenticated;
grant select on public.cambone_roster to authenticated;
grant select on public.directory_members to authenticated;
