-- Frequência: registro de presença dos filhos por atividade (chamada).
-- Uma linha por pessoa por evento; falta justificada só faz sentido com ausência.
-- A administração registra e corrige; cada filho vê apenas o próprio histórico.

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  present boolean not null default true,
  justified boolean not null default false,
  notes text,
  marked_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

create index attendance_event_idx on public.attendance (event_id);
create index attendance_profile_idx on public.attendance (profile_id);

alter table public.attendance enable row level security;

create policy "Administração gerencia a frequência"
on public.attendance for all
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Filhos visualizam a própria frequência"
on public.attendance for select
to authenticated
using ((select auth.uid()) = profile_id);

grant select, insert, update, delete on public.attendance to authenticated;

create or replace function public.touch_attendance_updated_at()
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

create trigger touch_attendance_updated_at
before update on public.attendance
for each row execute procedure public.touch_attendance_updated_at();
