-- Corrige o bootstrap de administradores: o trigger revertia role/status
-- silenciosamente quando auth.uid() é nulo (SQL Editor, service role),
-- impedindo a promoção do primeiro admin. Agora a proteção só se aplica
-- a atualizações vindas de usuários autenticados (cliente).

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
