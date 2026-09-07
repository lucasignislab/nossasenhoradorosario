'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type ActionResult = { ok: true } | { ok: false; error: string };

export type AttendanceRecord = {
  profileId: string;
  present: boolean;
  justified: boolean;
};

export async function saveAttendance(eventId: string, records: AttendanceRecord[]): Promise<ActionResult> {
  if (!eventId) return { ok: false, error: 'Evento não informado.' };
  if (!Array.isArray(records)) return { ok: false, error: 'Registros inválidos.' };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Sessão expirada. Entre novamente.' };

    const { data: caller } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    if (!caller || caller.status !== 'active' || !['admin', 'developer'].includes(caller.role)) {
      return { ok: false, error: 'Você não tem permissão para registrar a frequência.' };
    }

    const rows = records
      .filter((record) => record.profileId)
      .map((record) => ({
        event_id: eventId,
        profile_id: record.profileId,
        present: record.present,
        // Falta justificada só existe quando a pessoa faltou.
        justified: record.present ? false : record.justified,
        marked_by: user.id,
      }));

    if (rows.length > 0) {
      const { error } = await supabase
        .from('attendance')
        .upsert(rows, { onConflict: 'event_id,profile_id' });
      if (error) return { ok: false, error: 'Não foi possível salvar a chamada. Tente novamente.' };
    }

    revalidatePath('/admin/frequencia');
    revalidatePath('/dashboard/frequencia');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
