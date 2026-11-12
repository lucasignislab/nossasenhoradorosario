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

export type SpiritualRecordInput = {
  guia_frente: string;
  orixa_cabeca: string;
  adjunto: string;
};

// Ficha espiritual do filho: preenchida somente pela administração
// (o trigger protect_profile_access_fields bloqueia qualquer outro caminho).
export async function updateSpiritualRecord(profileId: string, input: SpiritualRecordInput): Promise<ActionResult> {
  if (!profileId) return { ok: false, error: 'Cadastro não informado.' };

  try {
    const { supabase, error: authError } = await requireAdministrator();
    if (authError) return { ok: false, error: authError };

    const { error } = await supabase.from('profiles').update({
      guia_frente: input.guia_frente.trim() || null,
      orixa_cabeca: input.orixa_cabeca.trim() || null,
      adjunto: input.adjunto.trim() || null,
    }).eq('id', profileId);

    if (error) return { ok: false, error: 'Não foi possível salvar a ficha espiritual. Tente novamente.' };

    revalidateMembers();
    revalidatePath('/dashboard/perfil');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

// Cargo espiritual da casa: atribuído somente pela administração
// (Mães de Santo e administração técnica). O banco limita a 2 Mães de Santo.
export async function setMemberCargo(profileId: string, cargo: string | null): Promise<ActionResult> {
  if (!profileId) return { ok: false, error: 'Cadastro não informado.' };
  const valid = ['Mãe de Santo', 'Pai Pequeno', 'Mãe Pequena', 'Ogã', 'Cambone'];
  if (cargo !== null && !valid.includes(cargo)) {
    return { ok: false, error: 'Cargo inválido.' };
  }

  try {
    const { supabase, error: authError } = await requireAdministrator();
    if (authError) return { ok: false, error: authError };

    const { error } = await supabase.from('profiles').update({ cargo }).eq('id', profileId);
    if (error) {
      if (error.message.includes('Mães de Santo')) {
        return { ok: false, error: 'A casa já tem 2 Mães de Santo. Remova uma antes de nomear outra.' };
      }
      return { ok: false, error: 'Não foi possível atualizar o cargo. Tente novamente.' };
    }

    revalidateMembers();
    revalidatePath('/dashboard/carteirinha');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export type MemberRecordInput = {
  full_name: string;
  phone: string;
  birth_date: string;
  joined_at: string;
};

// Ficha completa do filho: leitura e edição somente pela administração.
export async function updateMemberRecord(profileId: string, input: MemberRecordInput): Promise<ActionResult> {
  if (!profileId) return { ok: false, error: 'Cadastro não informado.' };
  const fullName = input.full_name.trim();
  if (fullName.length < 3 || fullName.length > 120) {
    return { ok: false, error: 'Informe o nome completo (3 a 120 letras).' };
  }
  const dateOrNull = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null);
  if (input.birth_date && !dateOrNull(input.birth_date)) return { ok: false, error: 'Data de nascimento inválida.' };
  if (input.joined_at && !dateOrNull(input.joined_at)) return { ok: false, error: 'Data de entrada inválida.' };

  try {
    const { supabase, error: authError } = await requireAdministrator();
    if (authError) return { ok: false, error: authError };

    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      phone: input.phone.trim() || null,
      birth_date: dateOrNull(input.birth_date),
      joined_at: dateOrNull(input.joined_at),
    }).eq('id', profileId);

    if (error) return { ok: false, error: 'Não foi possível salvar a ficha. Tente novamente.' };

    revalidateMembers();
    revalidatePath('/dashboard/carteirinha');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

// Promove/rebaixa a administração com um clique (ex.: as Mães de Santo).
// Somente administradores; nunca o próprio usuário nem acesso técnico (developer).
export async function setMemberAdmin(profileId: string, makeAdmin: boolean): Promise<ActionResult> {
  if (!profileId) return { ok: false, error: 'Cadastro não informado.' };

  try {
    const { supabase, user, error: authError } = await requireAdministrator();
    if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };
    if (profileId === user.id) {
      return { ok: false, error: 'Você não pode alterar o próprio acesso.' };
    }

    const { data: target } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', profileId)
      .single();

    if (!target) return { ok: false, error: 'Cadastro não encontrado.' };
    if (target.role === 'developer') {
      return { ok: false, error: 'O acesso técnico não pode ser alterado por aqui.' };
    }
    if (target.status !== 'active') {
      return { ok: false, error: 'Aprove o cadastro antes de promover à administração.' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: makeAdmin ? 'admin' : 'member' })
      .eq('id', profileId);
    if (error) return { ok: false, error: 'Não foi possível atualizar o acesso. Tente novamente.' };

    revalidateMembers();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
