-- Auto-registro de frequência: cada filho registra e corrige a própria
-- presença (válida como frequência oficial, sem etapa de validação).
-- A administração segue com controle total para correções posteriores.

create policy "Membro registra a própria frequência"
on public.attendance for insert
to authenticated
with check ((select auth.uid()) = profile_id and public.is_active_member());

create policy "Membro corrige o próprio registro"
on public.attendance for update
to authenticated
using ((select auth.uid()) = profile_id and public.is_active_member())
with check ((select auth.uid()) = profile_id);
