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
