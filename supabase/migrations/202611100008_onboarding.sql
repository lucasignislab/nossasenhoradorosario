-- Onboarding guiado por perfil: marca quando o usuário concluiu o tour
-- de boas-vindas. Editável pelo próprio usuário (o trigger
-- protect_profile_access_fields protege apenas papel e situação).

alter table public.profiles
add column if not exists onboarded_at timestamptz;
