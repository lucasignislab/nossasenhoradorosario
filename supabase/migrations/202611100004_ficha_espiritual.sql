-- Ficha espiritual do filho: Guia de Frente, Orixá de Cabeça e Adjuntó.
-- Preenchida pela administração; o filho apenas visualiza no próprio perfil.

alter table public.profiles
  add column guia_frente text check (guia_frente is null or char_length(guia_frente) <= 120),
  add column orixa_cabeca text check (orixa_cabeca is null or char_length(orixa_cabeca) <= 120),
  add column adjunto text check (adjunto is null or char_length(adjunto) <= 120);

-- Estende a proteção existente (role/status) aos campos espirituais:
-- fora da administração, ninguém altera a própria ficha espiritual.
create or replace function public.protect_profile_access_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_administrator() then
    new.role := old.role;
    new.status := old.status;
    new.guia_frente := old.guia_frente;
    new.orixa_cabeca := old.orixa_cabeca;
    new.adjunto := old.adjunto;
  end if;
  return new;
end;
$$;
