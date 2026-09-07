-- Papel restrito de comunicação: quem cuida das redes sociais (Instagram)
-- administra agenda, avisos e conteúdos — sem acesso a membros, financeiro,
-- frequência, faxinas ou configurações.

alter type public.app_role add value 'editor';
-- O restante (funcao is_content_manager e policies) esta em 202609070009_editor_policies.sql
-- (Postgres exige que o novo valor do enum seja commitado antes de ser usado.)
