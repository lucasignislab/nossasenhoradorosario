'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type ActionResult = { ok: true } | { ok: false; error: string };

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
    return { supabase, user: null, error: 'Você não tem permissão para gerenciar a escala de cuidados.' };
  }

  return { supabase, user, error: null };
}

function revalidateChores() {
  revalidatePath('/admin/faxinas');
  revalidatePath('/dashboard/faxinas');
}

function monthRange(month: string): { start: string; end: string } | null {
  if (!/^\d{4}-\d{2}$/.test(month)) return null;
  const [year, monthNumber] = month.split('-').map(Number);
  const start = `${month}-01`;
  const endDate = new Date(Date.UTC(year, monthNumber, 0));
  const end = endDate.toISOString().slice(0, 10);
  return { start, end };
}

function isSaturday(isoDate: string): boolean {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay() === 6;
}

// Ajusta o sábado de cuidado de um mês (YYYY-MM) para uma nova data.
// Se já existir uma escala de sábado gerada naquele mês, ela é movida —
// as inscrições acompanham pela chave estrangeira.
export async function setCleaningSaturday(month: string, saturday: string): Promise<ActionResult> {
  const range = monthRange(month);
  if (!range) return { ok: false, error: 'Mês inválido.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(saturday)) return { ok: false, error: 'Informe uma data válida.' };
  if (saturday < range.start || saturday > range.end) return { ok: false, error: 'O sábado precisa estar dentro do mês escolhido.' };
  if (!isSaturday(saturday)) return { ok: false, error: 'Escolha um sábado.' };

  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error: overrideError } = await supabase
      .from('cleaning_shift_months')
      .upsert({ month: range.start, saturday }, { onConflict: 'month' });
    if (overrideError) return { ok: false, error: 'Não foi possível salvar o ajuste do sábado.' };

    const { data: generated } = await supabase
      .from('cleaning_shift_dates')
      .select('id, shift_date')
      .eq('kind', 'saturday')
      .gte('shift_date', range.start)
      .lte('shift_date', range.end)
      .maybeSingle();

    if (generated && generated.shift_date !== saturday) {
      const { error: moveError } = await supabase
        .from('cleaning_shift_dates')
        .update({ shift_date: saturday })
        .eq('id', generated.id);
      if (moveError) {
        return { ok: false, error: 'Já existe uma data de cuidado neste dia. Escolha outro sábado.' };
      }
    } else if (!generated) {
      const { error: insertError } = await supabase
        .from('cleaning_shift_dates')
        .insert({ shift_date: saturday, kind: 'saturday' });
      if (insertError && insertError.code !== '23505') {
        return { ok: false, error: 'Não foi possível criar a data de sábado.' };
      }
    }

    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

// Remove a inscrição de uma pessoa em uma data (ex.: pedido por WhatsApp).
export async function removeShiftSignup(shiftDateId: string, profileId: string): Promise<ActionResult> {
  if (!shiftDateId || !profileId) return { ok: false, error: 'Inscrição não informada.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase
      .from('cleaning_shift_signups')
      .delete()
      .eq('shift_date_id', shiftDateId)
      .eq('profile_id', profileId);
    if (error) return { ok: false, error: 'Não foi possível remover a inscrição.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
