-- Limpeza: remove o modelo antigo de faxinas por equipes fixas,
-- substituído pela escala por data (202609070010_cleaning_shifts.sql).
-- O cascade remove triggers e policies vinculados; a função genérica
-- touch_updated_at_generic() segue em uso por outras tabelas.

drop table if exists public.chore_schedules cascade;
drop table if exists public.chore_team_members cascade;
drop table if exists public.chore_teams cascade;
