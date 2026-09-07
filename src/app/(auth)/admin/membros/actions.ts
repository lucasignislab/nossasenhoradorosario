'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ProfileStatus } from '@/types';

type ActionResult = { ok: true } | { ok: false; error: string };

async function updateMemberStatus(profileId: string, status: ProfileStatus): Promise<ActionResult> {
  if (!profileId) return { ok: false, error: 'Cadastro não informado.' };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Sessão expirada. Entre novamente.' };

    const { data: caller } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    if (!caller || caller.status !== 'active' || !['admin', 'developer'].includes(caller.role)) {
      return { ok: false, error: 'Você não tem permissão para gerenciar cadastros.' };
    }

    const { error } = await supabase.from('profiles').update({ status }).eq('id', profileId);
    if (error) return { ok: false, error: 'Não foi possível atualizar o cadastro. Tente novamente.' };

    revalidatePath('/admin/membros');
    revalidatePath('/admin');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function approveMember(profileId: string): Promise<ActionResult> {
  return updateMemberStatus(profileId, 'active');
}

export async function suspendMember(profileId: string): Promise<ActionResult> {
  return updateMemberStatus(profileId, 'suspended');
}

export async function reactivateMember(profileId: string): Promise<ActionResult> {
  return updateMemberStatus(profileId, 'active');
}

// Reprovar não exclui o usuário do auth: apenas suspende o cadastro.
export async function rejectMember(profileId: string): Promise<ActionResult> {
  return updateMemberStatus(profileId, 'suspended');
}
