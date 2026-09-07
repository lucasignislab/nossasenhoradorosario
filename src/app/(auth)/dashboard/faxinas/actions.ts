'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type ActionResult = { ok: true } | { ok: false; error: string };

/** Qualquer pessoa com cadastro ativo (membro, comunicação, administração) pode se inscrever. */
async function requireActiveProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, error: 'Sessão expirada. Entre novamente.' };

  const { data: caller } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (!caller || caller.status !== 'active') {
    return { supabase, user: null, error: 'Seu cadastro precisa estar ativo para participar.' };
  }

  return { supabase, user, error: null };
}

function revalidateShifts() {
  revalidatePath('/dashboard/faxinas');
  revalidatePath('/admin/faxinas');
}

export async function signUpForShift(shiftDateId: string): Promise<ActionResult> {
  if (!shiftDateId) return { ok: false, error: 'Data não informada.' };
  const { supabase, user, error: authError } = await requireActiveProfile();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  try {
    const { count } = await supabase
      .from('cleaning_shift_signups')
      .select('id', { count: 'exact', head: true })
      .eq('shift_date_id', shiftDateId);

    if ((count ?? 0) >= 9) {
      return { ok: false, error: 'Esta data já está com a equipe completa.' };
    }

    const { error } = await supabase
      .from('cleaning_shift_signups')
      .insert({ shift_date_id: shiftDateId, profile_id: user.id });

    if (error) {
      if (error.code === '23505') return { ok: false, error: 'Você já está inscrito nesta data.' };
      return { ok: false, error: 'Não foi possível confirmar sua participação. Tente novamente.' };
    }

    revalidateShifts();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function cancelShiftSignup(shiftDateId: string): Promise<ActionResult> {
  if (!shiftDateId) return { ok: false, error: 'Data não informada.' };
  const { supabase, user, error: authError } = await requireActiveProfile();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  try {
    const { error } = await supabase
      .from('cleaning_shift_signups')
      .delete()
      .eq('shift_date_id', shiftDateId)
      .eq('profile_id', user.id);

    if (error) return { ok: false, error: 'Não foi possível cancelar sua participação.' };

    revalidateShifts();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
