-- Cuidados da casa (faxinas): equipes, membros das equipes e escalas.
-- A administração organiza tudo; os filhos apenas consultam.

create table public.chore_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 120),
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chore_team_members (
  team_id uuid not null references public.chore_teams(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (team_id, profile_id)
);

create table public.chore_schedules (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.chore_teams(id) on delete cascade,
  chore_date date not null,
  tasks text[] not null default '{}',
  notes text,
  status text not null default 'agendada' check (status in ('agendada', 'concluida', 'cancelada')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chore_schedules_date_idx on public.chore_schedules (chore_date);
create index chore_team_members_profile_idx on public.chore_team_members (profile_id);

alter table public.chore_teams enable row level security;
alter table public.chore_team_members enable row level security;
alter table public.chore_schedules enable row level security;

create policy "Membros ativos leem as equipes"
on public.chore_teams for select
to authenticated
using (public.is_active_member());

create policy "Administração gerencia equipes"
on public.chore_teams for all
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Membros ativos leem as escalas"
on public.chore_schedules for select
to authenticated
using (public.is_active_member());

create policy "Administração gerencia escalas"
on public.chore_schedules for all
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Membros ativos leem a composição das equipes"
on public.chore_team_members for select
to authenticated
using (public.is_active_member());

create policy "Administração gerencia a composição"
on public.chore_team_members for all
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

grant select, insert, update, delete on public.chore_teams to authenticated;
grant select, insert, update, delete on public.chore_team_members to authenticated;
grant select, insert, update, delete on public.chore_schedules to authenticated;

create trigger touch_chore_teams_updated_at
before update on public.chore_teams
for each row execute procedure public.touch_updated_at_generic();

create trigger touch_chore_schedules_updated_at
before update on public.chore_schedules
for each row execute procedure public.touch_updated_at_generic();
