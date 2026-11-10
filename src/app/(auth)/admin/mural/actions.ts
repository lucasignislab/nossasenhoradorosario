'use server';

import { revalidatePath } from 'next/cache';
import { requireContentManager } from '@/lib/server/access';
import type { MuralItemCategory } from '@/types';

type ActionResult = { ok: true } | { ok: false; error: string };

export type MuralItemInput = {
  name: string;
  category: MuralItemCategory;
  quantity_total: string; // '' = sem meta
  unit: string;
  note: string;
};

function revalidateMural() {
  revalidatePath('/admin/mural');
  revalidatePath('/dashboard/levar');
}

function validateItem(input: MuralItemInput): { quantity: number | null } | { error: string } {
  if (input.name.trim().length < 2) return { error: 'Informe o nome do item.' };
  if (input.quantity_total.trim() === '') return { quantity: null };
  const normalized = input.quantity_total.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized) || Number(normalized) <= 0) {
    return { error: 'Meta de quantidade inválida. Deixe vazio para não definir meta.' };
  }
  return { quantity: Number(normalized) };
}

function itemPayload(input: MuralItemInput, quantity: number | null) {
  return {
    name: input.name.trim(),
    category: input.category,
    quantity_total: quantity,
    unit: input.unit.trim() || 'un',
    note: input.note.trim() || null,
  };
}

export async function createMuralItem(input: MuralItemInput): Promise<ActionResult> {
  const { supabase, user, error } = await requireContentManager();
  if (error || !user) return { ok: false, error: error ?? 'Erro de acesso.' };

  const parsed = validateItem(input);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  const { error: insertError } = await supabase
    .from('mural_items')
    .insert({ ...itemPayload(input, parsed.quantity), created_by: user.id });

  if (insertError) return { ok: false, error: insertError.message };
  revalidateMural();
  return { ok: true };
}

export async function updateMuralItem(itemId: string, input: MuralItemInput): Promise<ActionResult> {
  const { supabase, error } = await requireContentManager();
  if (error) return { ok: false, error };

  const parsed = validateItem(input);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  const { error: updateError } = await supabase
    .from('mural_items')
    .update(itemPayload(input, parsed.quantity))
    .eq('id', itemId);

  if (updateError) return { ok: false, error: updateError.message };
  revalidateMural();
  return { ok: true };
}

export async function deleteMuralItem(itemId: string): Promise<ActionResult> {
  const { supabase, error } = await requireContentManager();
  if (error) return { ok: false, error };

  const { error: deleteError } = await supabase.from('mural_items').delete().eq('id', itemId);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidateMural();
  return { ok: true };
}

// Marca ou desfaz a entrega de um compromisso (conferência no dia da gira).
export async function setMuralPledgeDelivered(pledgeId: string, delivered: boolean): Promise<ActionResult> {
  const { supabase, error } = await requireContentManager();
  if (error) return { ok: false, error };

  const { error: updateError } = await supabase
    .from('mural_pledges')
    .update({ delivered })
    .eq('id', pledgeId);

  if (updateError) return { ok: false, error: updateError.message };
  revalidateMural();
  return { ok: true };
}

export async function removeMuralPledge(pledgeId: string): Promise<ActionResult> {
  const { supabase, error } = await requireContentManager();
  if (error) return { ok: false, error };

  const { error: deleteError } = await supabase.from('mural_pledges').delete().eq('id', pledgeId);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidateMural();
  return { ok: true };
}
