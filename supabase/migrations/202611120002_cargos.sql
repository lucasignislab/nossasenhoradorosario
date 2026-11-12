-- Cargos da casa: Mãe de Santo (máx. 2), Pai Pequeno, Mãe Pequena, Ogã e Cambone.
-- Somente a administração atribui cargo (mesmo caminho de proteção de role/status).

alter table public.profiles
  add column if not exists cargo text
  check (cargo in ('Mãe de Santo', 'Pai Pequeno', 'Mãe Pequena', 'Ogã', 'Cambone'));

-- Protege o cargo contra edição pelo próprio usuário (igual a role/status).
create or replace function public.protect_profile_access_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not public.is_administrator() then
    new.role := old.role;
    new.status := old.status;
    new.cargo := old.cargo;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

-- Regra da casa: no máximo 2 Mães de Santo (não existe Pai de Santo).
create or replace function public.limit_maes_de_santo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.cargo = 'Mãe de Santo' and (
    select count(*) from public.profiles
    where cargo = 'Mãe de Santo' and id <> new.id
  ) >= 2 then
    raise exception 'A casa pode ter no máximo 2 Mães de Santo.';
  end if;
  return new;
end;
$$;

drop trigger if exists limit_maes_de_santo on public.profiles;
create trigger limit_maes_de_santo
before insert or update on public.profiles
for each row execute procedure public.limit_maes_de_santo();
