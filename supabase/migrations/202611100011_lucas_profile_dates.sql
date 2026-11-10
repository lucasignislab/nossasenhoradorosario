-- Dados do fundador: nascimento 16/10/1980, membro desde 09/01/2026.
update public.profiles
set birth_date = '1980-10-16',
    joined_at = '2026-01-09',
    updated_at = now()
where full_name ilike 'Lucas Coelho';
