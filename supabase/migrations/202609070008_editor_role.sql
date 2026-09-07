-- Papel restrito de comunicação: quem cuida das redes sociais (Instagram)
-- administra agenda, avisos e conteúdos — sem acesso a membros, financeiro,
-- frequência, faxinas ou configurações.

alter type public.app_role add value 'editor';

-- Gestor de conteúdo: admin, developer ou editor ativo.
create or replace function public.is_content_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'developer', 'editor')
      and status = 'active'
  );
$$;

revoke all on function public.is_content_manager() from public;
grant execute on function public.is_content_manager() to authenticated;
-- Mesmo grant dado a is_administrator() na migration 002, mantendo a
-- consistência com a política de leitura pública de eventos.
grant execute on function public.is_content_manager() to anon;

-- Agenda (eventos): escrita passa a aceitar o papel editor.
drop policy if exists "Administração cria eventos" on public.events;
create policy "Gestores de conteúdo criam eventos"
on public.events for insert
to authenticated
with check (public.is_content_manager());

drop policy if exists "Administração atualiza eventos" on public.events;
create policy "Gestores de conteúdo atualizam eventos"
on public.events for update
to authenticated
using (public.is_content_manager())
with check (public.is_content_manager());

drop policy if exists "Administração exclui eventos" on public.events;
create policy "Gestores de conteúdo excluem eventos"
on public.events for delete
to authenticated
using (public.is_content_manager());

-- Avisos: escrita passa a aceitar o papel editor.
drop policy if exists "Administração cria avisos" on public.notices;
create policy "Gestores de conteúdo criam avisos"
on public.notices for insert
to authenticated
with check (public.is_content_manager());

drop policy if exists "Administração atualiza avisos" on public.notices;
create policy "Gestores de conteúdo atualizam avisos"
on public.notices for update
to authenticated
using (public.is_content_manager())
with check (public.is_content_manager());

drop policy if exists "Administração exclui avisos" on public.notices;
create policy "Gestores de conteúdo excluem avisos"
on public.notices for delete
to authenticated
using (public.is_content_manager());

-- Conteúdos de estudo: escrita passa a aceitar o papel editor.
drop policy if exists "Administração cria conteúdos" on public.contents;
create policy "Gestores de conteúdo criam conteúdos"
on public.contents for insert
to authenticated
with check (public.is_content_manager());

drop policy if exists "Administração atualiza conteúdos" on public.contents;
create policy "Gestores de conteúdo atualizam conteúdos"
on public.contents for update
to authenticated
using (public.is_content_manager())
with check (public.is_content_manager());

drop policy if exists "Administração exclui conteúdos" on public.contents;
create policy "Gestores de conteúdo excluem conteúdos"
on public.contents for delete
to authenticated
using (public.is_content_manager());

-- event_confirmations, membros, financeiro, frequência e faxinas continuam
-- exclusivos de is_administrator().
