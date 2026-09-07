'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { attendanceWindowOpen } from '@/lib/attendance';

type ActionResult = { ok: true } | { ok: false; error: string };

export type SelfAttendanceMark = 'present' | 'justified';

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
    return { supabase, user: null, error: 'Seu cadastro precisa estar ativo para registrar a frequência.' as const };
  }

  return { supabase, user, error: null };
}

function revalidateAttendance() {
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/agenda');
  revalidatePath('/dashboard/frequencia');
  revalidatePath('/admin/frequencia');
}

// O próprio membro registra (ou corrige, dentro da janela) a sua frequência.
// O registro já vale como frequência oficial — a administração pode corrigir depois.
export async function registerOwnAttendance(eventId: string, mark: SelfAttendanceMark, notes?: string): Promise<ActionResult> {
  if (!eventId) return { ok: false, error: 'Atividade não informada.' };
  if (!['present', 'justified'].includes(mark)) return { ok: false, error: 'Registro inválido.' };

  const { supabase, user, error: authError } = await requireActiveMember();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  try {
    const { data: event } = await supabase
      .from('events')
      .select('event_date, event_time, status')
      .eq('id', eventId)
      .single();

    if (!event) return { ok: false, error: 'Atividade não encontrada.' };
    if (!attendanceWindowOpen(event)) {
      return { ok: false, error: 'O registro de frequência fica disponível somente no dia da atividade, até 23h59. Fale com a administração para corrigir.' };
    }

    const { error } = await supabase
      .from('attendance')
      .upsert({
        event_id: eventId,
        profile_id: user.id,
        present: mark === 'present',
        justified: mark === 'justified',
        notes: mark === 'justified' ? (notes?.trim() || null) : null,
        marked_by: user.id,
      }, { onConflict: 'event_id,profile_id' });

    if (error) return { ok: false, error: 'Não foi possível registrar sua frequência. Tente novamente.' };

    revalidateAttendance();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
