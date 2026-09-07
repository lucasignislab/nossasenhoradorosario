-- Financeiro da casa: entradas (mensalidades, doações) e saídas (despesas).
-- Valores em centavos para evitar erros de ponto flutuante.
-- A administração gerencia tudo; cada filho vê apenas os próprios lançamentos
-- (ex.: a própria mensalidade).

create table public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('entrada', 'saida')),
  category text not null check (char_length(category) between 2 and 60),
  description text not null check (char_length(description) between 3 and 240),
  amount_cents integer not null check (amount_cents > 0),
  entry_date date not null,
  profile_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index finance_entries_date_idx on public.finance_entries (entry_date);
create index finance_entries_profile_idx on public.finance_entries (profile_id);

alter table public.finance_entries enable row level security;

create policy "Administração gerencia lançamentos financeiros"
on public.finance_entries for all
to authenticated
using (public.is_administrator())
with check (public.is_administrator());

create policy "Filhos visualizam os próprios lançamentos"
on public.finance_entries for select
to authenticated
using ((select auth.uid()) = profile_id);

grant select, insert, update, delete on public.finance_entries to authenticated;

create or replace function public.touch_finance_entry_updated_at()
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

create trigger touch_finance_entry_updated_at
before update on public.finance_entries
for each row execute procedure public.touch_finance_entry_updated_at();
