-- Escala de cuidados por data: quintas-feiras + um sábado do mês.
-- Os próprios membros se inscrevem (mín. 7, máx. 9 por data); a administração
-- pode ajustar o sábado de cada mês.

create table public.cleaning_shift_dates (
  id uuid primary key default gen_random_uuid(),
  shift_date date not null unique,
  kind text not null check (kind in ('thursday', 'saturday')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ajuste do sábado de cada mês (month é sempre o dia 1º do mês).
create table public.cleaning_shift_months (
  month date primary key,
  saturday date not null,
  updated_at timestamptz not null default now()
);

create table public.cleaning_shift_signups (
  id uuid primary key default gen_random_uuid(),
  shift_date_id uuid not null references public.cleaning_shift_dates(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (shift_date_id, profile_id)
);

create index cleaning_shift_dates_date_idx on public.cleaning_shift_dates (shift_date);
create index cleaning_shift_signups_date_idx on public.cleaning_shift_signups (shift_date_id);
create index cleaning_shift_signups_profile_idx on public.cleaning_shift_signups (profile_id);

alter table public.cleaning_shift_dates enable row level security;
alter table public.cleaning_shift_months enable row level security;
alter table public.cleaning_shift_signups enable row level security;

create policy "Membros ativos leem as datas de cuidado"
on public.cleaning_shift_dates for select
to authenticated
using (public.is_active_member());

create policy "Administração gerencia as datas de cuidado"
on public.cleaning_shift_dates for all
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Membros ativos leem os sábados ajustados"
on public.cleaning_shift_months for select
to authenticated
using (public.is_active_member());

create policy "Administração ajusta os sábados"
on public.cleaning_shift_months for all
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Membros ativos leem as inscrições"
on public.cleaning_shift_signups for select
to authenticated
using (public.is_active_member());

create policy "Membro ativo inscreve a si mesmo"
on public.cleaning_shift_signups for insert
to authenticated
with check ((select auth.uid()) = profile_id and public.is_active_member());

create policy "Membro cancela a própria inscrição"
on public.cleaning_shift_signups for delete
to authenticated
using ((select auth.uid()) = profile_id or public.is_administrator());

create policy "Administração gerencia as inscrições"
on public.cleaning_shift_signups for all
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

grant select, insert, update, delete on public.cleaning_shift_dates to authenticated;
grant select, insert, update, delete on public.cleaning_shift_months to authenticated;
grant select, insert, update, delete on public.cleaning_shift_signups to authenticated;

-- Garante no máximo 9 inscritos por data, mesmo em caso de inscrições simultâneas.
create or replace function public.enforce_cleaning_shift_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform 1
  from public.cleaning_shift_dates
  where id = new.shift_date_id
  for update;

  if (select count(*) from public.cleaning_shift_signups where shift_date_id = new.shift_date_id) >= 9 then
    raise exception 'Esta data já está com a equipe completa (9 pessoas).';
  end if;
  return new;
end;
$$;

create trigger enforce_cleaning_shift_capacity_trigger
before insert on public.cleaning_shift_signups
for each row execute procedure public.enforce_cleaning_shift_capacity();

-- Gera as datas do mês atual e do próximo: todas as quintas + o sábado
-- configurado (ou o último sábado do mês, por padrão). Idempotente.
create or replace function public.ensure_cleaning_shift_dates()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  i integer;
  month_start date;
  month_end date;
  day date;
  chosen_saturday date;
begin
  for i in 0..1 loop
    month_start := (date_trunc('month', current_date)::date + (i || ' month')::interval)::date;
    month_end := (month_start + interval '1 month - 1 day')::date;

    day := month_start;
    while day <= month_end loop
      if extract(isodow from day) = 4 then
        insert into public.cleaning_shift_dates (shift_date, kind)
        values (day, 'thursday')
        on conflict (shift_date) do nothing;
      end if;
      day := day + 1;
    end loop;

    select months.saturday into chosen_saturday
    from public.cleaning_shift_months months
    where months.month = month_start;

    if chosen_saturday is null then
      chosen_saturday := month_end - ((extract(isodow from month_end)::integer - 6 + 7) % 7);
    end if;

    insert into public.cleaning_shift_dates (shift_date, kind)
    values (chosen_saturday, 'saturday')
    on conflict (shift_date) do nothing;
  end loop;
end;
$$;

revoke all on function public.ensure_cleaning_shift_dates() from public;
grant execute on function public.ensure_cleaning_shift_dates() to authenticated;

create trigger touch_cleaning_shift_dates_updated_at
before update on public.cleaning_shift_dates
for each row execute procedure public.touch_updated_at_generic();

create trigger touch_cleaning_shift_months_updated_at
before update on public.cleaning_shift_months
for each row execute procedure public.touch_updated_at_generic();
