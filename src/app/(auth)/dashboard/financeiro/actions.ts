'use server';

import { revalidatePath } from 'next/cache';
import { MENSALIDADE_MAX_CENTS, MENSALIDADE_MIN_CENTS, parseBRLToCents } from '@/lib/finance';
import { createClient } from '@/lib/supabase/server';

type ActionResult = { ok: true } | { ok: false; error: string };

const MONTH_NAMES_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

async function requireActiveMember() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, error: 'Sessão expirada. Entre novamente.' as const };

  const { data: caller } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (!caller || caller.status !== 'active') {
    return { supabase, user: null, error: 'Seu cadastro precisa estar ativo para registrar a mensalidade.' as const };
  }

  return { supabase, user, error: null };
}

function revalidateFinance() {
  revalidatePath('/dashboard/financeiro');
  revalidatePath('/dashboard');
  revalidatePath('/admin/financeiro');
}

// O próprio membro registra a mensalidade do mês com o valor que vai pagar
// (entre R$ 70 e R$ 100). Nasce pendente; vira "pago" ao enviar o comprovante.
export async function registerMensalidade(month: string, amount: string): Promise<ActionResult> {
  if (!/^\d{4}-\d{2}$/.test(month)) return { ok: false, error: 'Escolha o mês de referência.' };

  const amountCents = parseBRLToCents(amount);
  if (!amountCents || amountCents < MENSALIDADE_MIN_CENTS || amountCents > MENSALIDADE_MAX_CENTS) {
    return { ok: false, error: 'O valor da mensalidade precisa estar entre R$ 70,00 e R$ 100,00.' };
  }

  const { supabase, user, error: authError } = await requireActiveMember();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const [year, monthNumber] = month.split('-').map(Number);
  const monthName = MONTH_NAMES_PT[monthNumber - 1];
  // Vencimento padrão da casa: dia 10.
  const entryDate = `${month}-10`;

  try {
    const { error } = await supabase.from('finance_entries').insert({
      type: 'entrada',
      category: 'mensalidade',
      description: `Mensalidade — ${monthName}/${year}`,
      amount_cents: amountCents,
      entry_date: entryDate,
      status: 'pendente',
      profile_id: user.id,
      created_by: user.id,
    });

    if (error) {
      if (error.code === '23505') return { ok: false, error: 'Este mês já foi registrado. Consulte o histórico abaixo.' };
      return { ok: false, error: 'Não foi possível registrar a mensalidade. Tente novamente.' };
    }

    revalidateFinance();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

// Chamada depois do upload do comprovante no Storage: marca a mensalidade como paga.
export async function submitMensalidadeReceipt(entryId: string, receiptPath: string): Promise<ActionResult> {
  if (!entryId) return { ok: false, error: 'Mensalidade não informada.' };
  if (!receiptPath || receiptPath.includes('..')) return { ok: false, error: 'Comprovante inválido. Tente enviar novamente.' };

  const { supabase, user, error: authError } = await requireActiveMember();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  // O caminho precisa estar na pasta do próprio membro (garantido também pela policy do bucket).
  if (!receiptPath.startsWith(`${user.id}/`)) {
    return { ok: false, error: 'Comprovante inválido. Tente enviar novamente.' };
  }

  try {
    const { error } = await supabase
      .from('finance_entries')
      .update({ status: 'pago', receipt_path: receiptPath })
      .eq('id', entryId)
      .eq('profile_id', user.id)
      .eq('category', 'mensalidade');

    if (error) return { ok: false, error: 'Não foi possível anexar o comprovante. Tente novamente.' };

    revalidateFinance();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
