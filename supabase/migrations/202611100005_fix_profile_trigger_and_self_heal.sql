-- Filhos preenchem a própria ficha completa (contato + ficha espiritual).
-- O trigger volta a proteger apenas papel e situação — e recupera o guarda de
-- auth.uid() nulo (SQL Editor / service role) e o toque de updated_at, que a
-- versão 202611100004 removeu sem querer.

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
  end if;
  new.updated_at := now();
  return new;
end;
$$;

-- Autocorreção: quem entra pelo Google pode ficar sem linha em profiles se o
-- trigger de cadastro falhar. Permite que o próprio usuário crie a ficha
-- básica (papel e situação saem pelos defaults; o trigger acima barra
-- qualquer tentativa de se autopromover).
create policy "Usuário cria a própria ficha"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);
