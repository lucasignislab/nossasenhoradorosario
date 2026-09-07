'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ChoreScheduleStatus } from '@/types';

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
    return { supabase, user: null, error: 'Você não tem permissão para gerenciar as equipes de cuidado.' };
  }

  return { supabase, user, error: null };
}

function revalidateChores() {
  revalidatePath('/admin/faxinas');
  revalidatePath('/dashboard/faxinas');
}

export async function createTeam(input: { name: string; description: string }): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const name = input.name.trim();
  if (name.length < 3) return { ok: false, error: 'Informe um nome com pelo menos 3 letras.' };

  try {
    const { error } = await supabase
      .from('chore_teams')
      .insert({ name, description: input.description.trim() || null });
    if (error) return { ok: false, error: 'Não foi possível criar a equipe. Tente novamente.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function updateTeam(teamId: string, input: { name: string; description: string; active: boolean }): Promise<ActionResult> {
  if (!teamId) return { ok: false, error: 'Equipe não informada.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const name = input.name.trim();
  if (name.length < 3) return { ok: false, error: 'Informe um nome com pelo menos 3 letras.' };

  try {
    const { error } = await supabase
      .from('chore_teams')
      .update({ name, description: input.description.trim() || null, active: input.active })
      .eq('id', teamId);
    if (error) return { ok: false, error: 'Não foi possível salvar a equipe.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function deleteTeam(teamId: string): Promise<ActionResult> {
  if (!teamId) return { ok: false, error: 'Equipe não informada.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('chore_teams').delete().eq('id', teamId);
    if (error) return { ok: false, error: 'Não foi possível excluir a equipe.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function addTeamMember(teamId: string, profileId: string): Promise<ActionResult> {
  if (!teamId || !profileId) return { ok: false, error: 'Equipe ou pessoa não informada.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase
      .from('chore_team_members')
      .upsert({ team_id: teamId, profile_id: profileId }, { onConflict: 'team_id,profile_id' });
    if (error) return { ok: false, error: 'Não foi possível adicionar à equipe.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function removeTeamMember(teamId: string, profileId: string): Promise<ActionResult> {
  if (!teamId || !profileId) return { ok: false, error: 'Equipe ou pessoa não informada.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase
      .from('chore_team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('profile_id', profileId);
    if (error) return { ok: false, error: 'Não foi possível remover da equipe.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function createSchedule(input: { team_id: string; chore_date: string; tasks: string; notes: string }): Promise<ActionResult> {
  const { supabase, user, error: authError } = await requireAdministrator();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  if (!input.team_id) return { ok: false, error: 'Escolha uma equipe.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.chore_date)) return { ok: false, error: 'Informe uma data válida.' };

  const tasks = input.tasks.split('\n').map((task) => task.trim()).filter(Boolean);
  if (tasks.length === 0) return { ok: false, error: 'Liste pelo menos um cuidado (um por linha).' };

  try {
    const { error } = await supabase.from('chore_schedules').insert({
      team_id: input.team_id,
      chore_date: input.chore_date,
      tasks,
      notes: input.notes.trim() || null,
      created_by: user.id,
    });
    if (error) return { ok: false, error: 'Não foi possível agendar a faxina. Tente novamente.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function updateScheduleStatus(scheduleId: string, status: ChoreScheduleStatus): Promise<ActionResult> {
  if (!scheduleId) return { ok: false, error: 'Escala não informada.' };
  if (!['agendada', 'concluida', 'cancelada'].includes(status)) return { ok: false, error: 'Situação inválida.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('chore_schedules').update({ status }).eq('id', scheduleId);
    if (error) return { ok: false, error: 'Não foi possível atualizar a escala.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function deleteSchedule(scheduleId: string): Promise<ActionResult> {
  if (!scheduleId) return { ok: false, error: 'Escala não informada.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('chore_schedules').delete().eq('id', scheduleId);
    if (error) return { ok: false, error: 'Não foi possível excluir a escala.' };
    revalidateChores();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

// --- Escala por data (inscrição dos próprios membros) ---

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
