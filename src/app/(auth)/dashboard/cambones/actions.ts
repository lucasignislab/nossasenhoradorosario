'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { CamboneStatus } from '@/types';

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidateCambones() {
  revalidatePath('/dashboard/cambones');
  revalidatePath('/admin/cambones');
}

// O cambone responde à própria escala: confirma ou recusa.
export async function respondCamboneAssignment(assignmentId: string, status: CamboneStatus): Promise<ActionResult> {
  if (!['confirmado', 'recusado'].includes(status)) {
    return { ok: false, error: 'Resposta inválida.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão expirada. Entre novamente.' };

  const { error: updateError } = await supabase
    .from('cambone_assignments')
    .update({ status })
    .eq('id', assignmentId)
    .eq('profile_id', user.id);

  if (updateError) return { ok: false, error: updateError.message };
  revalidateCambones();
  return { ok: true };
}
