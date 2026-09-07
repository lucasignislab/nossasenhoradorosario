import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ProfileRole } from '@/types';

export const ADMIN_ONLY_ROLES: ProfileRole[] = ['admin', 'developer'];
export const CONTENT_MANAGER_ROLES: ProfileRole[] = ['admin', 'developer', 'editor'];

type CallerAccess = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: { id: string } | null;
  role: ProfileRole | null;
  error: string | null;
};

async function resolveCaller(): Promise<CallerAccess> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null, error: 'Sessão expirada. Entre novamente.' };

  const { data: caller } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single();

  if (!caller || caller.status !== 'active') {
    return { supabase, user, role: null, error: 'Seu cadastro precisa estar ativo para esta ação.' };
  }

  return { supabase, user, role: caller.role as ProfileRole, error: null };
}

/** Server actions exclusivas da administração (membros, financeiro, frequência, faxinas). */
export async function requireAdministrator() {
  const access = await resolveCaller();
  if (access.error) return access;
  if (!access.role || !ADMIN_ONLY_ROLES.includes(access.role)) {
    return { ...access, error: 'Você não tem permissão para esta área da gestão.' };
  }
  return access;
}

/** Server actions de conteúdo (agenda, avisos, conteúdos) — também abertas ao papel editor. */
export async function requireContentManager() {
  const access = await resolveCaller();
  if (access.error) return access;
  if (!access.role || !CONTENT_MANAGER_ROLES.includes(access.role)) {
    return { ...access, error: 'Você não tem permissão para gerenciar conteúdos.' };
  }
  return access;
}

/** Guarda de páginas administrativas restritas: editores vão para a agenda. */
export async function redirectEditorsAway() {
  const access = await resolveCaller();
  if (access.role === 'editor') redirect('/admin/agenda');
}
