-- Expõe birth_date no diretório de membros ativos (aniversariantes do mês).
create or replace view public.directory_members
with (security_barrier = true) as
select id, full_name, avatar_url, birth_date
from public.profiles
where status = 'active';

grant select on public.directory_members to authenticated;
