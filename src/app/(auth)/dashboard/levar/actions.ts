'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireActiveMember() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, error: 'Sessão expirada. Entre novamente.' };

  const { data: caller } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (!caller || caller.status !== 'active') {
    return { supabase, user: null, error: 'Seu cadastro precisa estar ativo para se comprometer.' };
  }

  return { supabase, user, error: null };
}

function revalidateMural() {
  revalidatePath('/dashboard/levar');
  revalidatePath('/admin/mural');
}

function parseQuantity(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return value > 0 ? value : null;
}

// O filho se compromete a levar uma quantidade de um item da gira.
// Se já tiver compromisso naquele item, a quantidade é atualizada.
export async function pledgeMuralItem(itemId: string, quantityRaw: string, note: string): Promise<ActionResult> {
  const { supabase, user, error } = await requireActiveMember();
  if (error || !user) return { ok: false, error: error ?? 'Erro de acesso.' };

  const quantity = parseQuantity(quantityRaw);
  if (!quantity) return { ok: false, error: 'Informe uma quantidade válida (ex.: 2 ou 1,5).' };

  const { error: upsertError } = await supabase
    .from('mural_pledges')
    .upsert(
      { item_id: itemId, profile_id: user.id, quantity, note: note.trim() || null },
      { onConflict: 'item_id,profile_id' },
    );

  if (upsertError) return { ok: false, error: upsertError.message };
  revalidateMural();
  return { ok: true };
}

// O filho desiste do próprio compromisso (antes da gira).
export async function cancelMuralPledge(pledgeId: string): Promise<ActionResult> {
  const { supabase, user, error } = await requireActiveMember();
  if (error || !user) return { ok: false, error: error ?? 'Erro de acesso.' };

  const { error: deleteError } = await supabase
    .from('mural_pledges')
    .delete()
    .eq('id', pledgeId)
    .eq('profile_id', user.id);

  if (deleteError) return { ok: false, error: deleteError.message };
  revalidateMural();
  return { ok: true };
}
