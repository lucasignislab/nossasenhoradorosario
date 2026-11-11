'use server';

import { revalidatePath } from 'next/cache';
import { requireAdministrator } from '@/lib/server/access';

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidateAttendance() {
  revalidatePath('/admin/atendimento');
}

export async function createAttendanceSession(input: { title: string; sessionDate: string; eventId: string | null }): Promise<ActionResult> {
  const title = input.title.trim().slice(0, 120);
  if (title.length < 3) return { ok: false, error: 'Informe um nome com pelo menos 3 letras.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.sessionDate)) return { ok: false, error: 'Informe a data do atendimento.' };

  const { supabase, user, error: authError } = await requireAdministrator();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const { error } = await supabase.from('attendance_sessions').insert({
    title,
    session_date: input.sessionDate,
    event_id: input.eventId,
    created_by: user.id,
  });
  if (error) return { ok: false, error: 'Não foi possível criar o atendimento. Tente novamente.' };
  revalidateAttendance();
  return { ok: true };
}

export async function setAttendanceSessionStatus(sessionId: string, status: 'aberta' | 'encerrada'): Promise<ActionResult> {
  if (!sessionId) return { ok: false, error: 'Atendimento não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const { error } = await supabase
    .from('attendance_sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', sessionId);
  if (error) return { ok: false, error: 'Não foi possível atualizar o atendimento.' };
  revalidateAttendance();
  return { ok: true };
}

export async function deleteAttendanceSession(sessionId: string): Promise<ActionResult> {
  if (!sessionId) return { ok: false, error: 'Atendimento não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const { error } = await supabase.from('attendance_sessions').delete().eq('id', sessionId);
  if (error) return { ok: false, error: 'Não foi possível excluir o atendimento.' };
  revalidateAttendance();
  return { ok: true };
}

/** Chama a próxima senha da fila e marca a chamada anterior como atendida. */
export async function callNextTicket(sessionId: string): Promise<ActionResult> {
  if (!sessionId) return { ok: false, error: 'Atendimento não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  // A senha que estava em chamada passa a atendida.
  await supabase
    .from('attendance_tickets')
    .update({ status: 'atendido' })
    .eq('session_id', sessionId)
    .eq('status', 'chamado');

  const { data: nextRows } = await supabase
    .from('attendance_tickets')
    .select('id, number')
    .eq('session_id', sessionId)
    .eq('status', 'aguardando')
    .order('number', { ascending: true })
    .limit(1);
  const next = (nextRows ?? [])[0];
  if (!next) return { ok: false, error: 'Não há mais senhas aguardando nesta fila.' };

  const now = new Date().toISOString();
  const { error } = await supabase
    .from('attendance_tickets')
    .update({ status: 'chamado', called_at: now })
    .eq('id', next.id)
    .eq('status', 'aguardando');
  if (error) return { ok: false, error: 'Não foi possível chamar a próxima senha.' };

  await supabase
    .from('attendance_sessions')
    .update({ last_called: next.number, updated_at: now })
    .eq('id', sessionId);

  revalidateAttendance();
  return { ok: true };
}

export async function updateTicketStatus(ticketId: string, status: 'aguardando' | 'atendido' | 'ausente'): Promise<ActionResult> {
  if (!ticketId) return { ok: false, error: 'Senha não informada.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const { error } = await supabase
    .from('attendance_tickets')
    .update({ status })
    .eq('id', ticketId);
  if (error) return { ok: false, error: 'Não foi possível atualizar a senha.' };
  revalidateAttendance();
  return { ok: true };
}

export async function deleteTicket(ticketId: string): Promise<ActionResult> {
  if (!ticketId) return { ok: false, error: 'Senha não informada.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const { error } = await supabase.from('attendance_tickets').delete().eq('id', ticketId);
  if (error) return { ok: false, error: 'Não foi possível remover a senha.' };
  revalidateAttendance();
  return { ok: true };
}
