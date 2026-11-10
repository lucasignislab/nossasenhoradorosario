'use server';

import { revalidatePath } from 'next/cache';
import { requireContentManager } from '@/lib/server/access';

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidateCambones() {
  revalidatePath('/admin/cambones');
  revalidatePath('/dashboard/cambones');
}

// Escala um filho como cambone de uma gira (com observação/função opcional).
export async function assignCambone(eventId: string, profileId: string, roleNote: string): Promise<ActionResult> {
  const { supabase, user, error } = await requireContentManager();
  if (error || !user) return { ok: false, error: error ?? 'Erro de acesso.' };
  if (!profileId) return { ok: false, error: 'Selecione o filho da casa.' };

  const { error: insertError } = await supabase
    .from('cambone_assignments')
    .insert({
      event_id: eventId,
      profile_id: profileId,
      role_note: roleNote.trim() || null,
      created_by: user.id,
    });

  if (insertError) {
    if (insertError.code === '23505') return { ok: false, error: 'Este filho já está escalado nesta gira.' };
    return { ok: false, error: insertError.message };
  }
  revalidateCambones();
  return { ok: true };
}

export async function removeCamboneAssignment(assignmentId: string): Promise<ActionResult> {
  const { supabase, error } = await requireContentManager();
  if (error) return { ok: false, error };

  const { error: deleteError } = await supabase
    .from('cambone_assignments')
    .delete()
    .eq('id', assignmentId);

  if (deleteError) return { ok: false, error: deleteError.message };
  revalidateCambones();
  return { ok: true };
}
