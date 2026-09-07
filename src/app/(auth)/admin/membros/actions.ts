'use server';

import { revalidatePath } from 'next/cache';
import { requireAdministrator } from '@/lib/server/access';
import type { ProfileStatus } from '@/types';

type ActionResult = { ok: true } | { ok: false; error: string };

type AssignableRole = 'member' | 'editor';

function revalidateMembers() {
  revalidatePath('/admin/membros');
  revalidatePath('/admin');
}

async function updateMemberStatus(profileId: string, status: ProfileStatus): Promise<ActionResult> {
  if (!profileId) return { ok: false, error: 'Cadastro não informado.' };

  try {
    const { supabase, error: authError } = await requireAdministrator();
    if (authError) return { ok: false, error: authError };

    const { error } = await supabase.from('profiles').update({ status }).eq('id', profileId);
    if (error) return { ok: false, error: 'Não foi possível atualizar o cadastro. Tente novamente.' };

    revalidateMembers();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

// A aprovação pode já definir o papel: filho da casa (padrão) ou comunicação.
// Papéis de gestão (admin/developer) nunca são atribuídos por aqui.
export async function approveMember(profileId: string, role: AssignableRole = 'member'): Promise<ActionResult> {
  if (!['member', 'editor'].includes(role)) {
    return { ok: false, error: 'Papel inválido para aprovação.' };
  }
  if (!profileId) return { ok: false, error: 'Cadastro não informado.' };

  try {
    const { supabase, error: authError } = await requireAdministrator();
    if (authError) return { ok: false, error: authError };

    const { error } = await supabase.from('profiles').update({ status: 'active', role }).eq('id', profileId);
    if (error) return { ok: false, error: 'Não foi possível aprovar o cadastro. Tente novamente.' };

    revalidateMembers();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

// Alterna entre filho da casa e comunicação. Nunca mexe em admin/developer
// e nunca permite alterar o próprio papel.
export async function setMemberRole(profileId: string, role: AssignableRole): Promise<ActionResult> {
  if (!profileId) return { ok: false, error: 'Cadastro não informado.' };
  if (!['member', 'editor'].includes(role)) {
    return { ok: false, error: 'Papel inválido. Apenas filho da casa ou comunicação.' };
  }

  try {
    const { supabase, user, error: authError } = await requireAdministrator();
    if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };
    if (profileId === user.id) {
      return { ok: false, error: 'Você não pode alterar o próprio papel.' };
    }

    const { data: target } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', profileId)
      .single();

    if (!target || !['member', 'editor'].includes(target.role)) {
      return { ok: false, error: 'Só é possível alternar entre filho da casa e comunicação.' };
    }

    const { error } = await supabase.from('profiles').update({ role }).eq('id', profileId);
    if (error) return { ok: false, error: 'Não foi possível alterar o papel. Tente novamente.' };

    revalidateMembers();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
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
