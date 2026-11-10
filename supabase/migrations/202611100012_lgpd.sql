-- LGPD: aceite registrado dos Termos de Uso e Política de Privacidade.
-- Editável pelo próprio usuário (trigger protege apenas papel e situação).

alter table public.profiles
add column if not exists terms_accepted_at timestamptz,
add column if not exists terms_version text;
