'use server';

import { revalidatePath } from 'next/cache';
import { parseBRLToCents } from '@/lib/finance';
import { createClient } from '@/lib/supabase/server';
import type { FinanceEntryType } from '@/types';

type ActionResult = { ok: true } | { ok: false; error: string };

export type FinanceEntryInput = {
  type: FinanceEntryType;
  category: string;
  description: string;
  amount: string; // valor em BRL digitado, ex.: "123,45"
  entry_date: string;
  profile_id: string; // '' quando não se aplica
};

async function requireAdministrator() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, error: 'Sessão expirada. Entre novamente.' };

  const { data: caller } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single();

  if (!caller || caller.status !== 'active' || !['admin', 'developer'].includes(caller.role)) {
    return { supabase, user: null, error: 'Você não tem permissão para gerenciar o financeiro.' };
  }

  return { supabase, user, error: null };
}

type FinanceRecord = {
  type: FinanceEntryType;
  category: string;
  description: string;
  amount_cents: number;
  entry_date: string;
  profile_id: string | null;
};

function parseEntryInput(input: FinanceEntryInput): { record: FinanceRecord } | { error: string } {
  const description = input.description.trim();
  if (description.length < 3) return { error: 'Informe uma descrição com pelo menos 3 letras.' };
  if (input.type !== 'entrada' && input.type !== 'saida') return { error: 'Tipo de lançamento inválido.' };

  const category = input.category.trim();
  if (category.length < 2) return { error: 'Escolha uma categoria.' };

  const amountCents = parseBRLToCents(input.amount);
  if (!amountCents || amountCents <= 0) return { error: 'Informe um valor válido, ex.: 90,00.' };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.entry_date)) return { error: 'Informe uma data válida.' };

  return {
    record: {
      type: input.type,
      category,
      description,
      amount_cents: amountCents,
      entry_date: input.entry_date,
      profile_id: input.profile_id || null,
    },
  };
}

function revalidateFinance() {
  revalidatePath('/admin/financeiro');
  revalidatePath('/dashboard/financeiro');
  revalidatePath('/admin');
}

export async function createFinanceEntry(input: FinanceEntryInput): Promise<ActionResult> {
  const { supabase, user, error: authError } = await requireAdministrator();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const parsed = parseEntryInput(input);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  try {
    const { error } = await supabase.from('finance_entries').insert({ ...parsed.record, created_by: user.id });
    if (error) return { ok: false, error: 'Não foi possível criar o lançamento. Tente novamente.' };
    revalidateFinance();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function updateFinanceEntry(entryId: string, input: FinanceEntryInput): Promise<ActionResult> {
  if (!entryId) return { ok: false, error: 'Lançamento não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const parsed = parseEntryInput(input);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  try {
    const { error } = await supabase.from('finance_entries').update(parsed.record).eq('id', entryId);
    if (error) return { ok: false, error: 'Não foi possível salvar as alterações.' };
    revalidateFinance();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function deleteFinanceEntry(entryId: string): Promise<ActionResult> {
  if (!entryId) return { ok: false, error: 'Lançamento não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('finance_entries').delete().eq('id', entryId);
    if (error) return { ok: false, error: 'Não foi possível excluir o lançamento.' };
    revalidateFinance();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
