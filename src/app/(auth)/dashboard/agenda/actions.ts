'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type ActionResult = { ok: true } | { ok: false; error: string };

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
    return { supabase, user: null, error: 'Seu cadastro precisa estar ativo para confirmar presença.' as const };
  }

  return { supabase, user, error: null };
}

export async function confirmPresence(eventId: string): Promise<ActionResult> {
  if (!eventId) return { ok: false, error: 'Evento não informado.' };
  const { supabase, user, error: authError } = await requireActiveMember();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  try {
    const { error } = await supabase
      .from('event_confirmations')
      .upsert({ event_id: eventId, profile_id: user.id }, { onConflict: 'event_id,profile_id' });
    if (error) return { ok: false, error: 'Não foi possível confirmar sua presença. Tente novamente.' };
    revalidatePath('/dashboard/agenda');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function cancelConfirmation(eventId: string): Promise<ActionResult> {
  if (!eventId) return { ok: false, error: 'Evento não informado.' };
  const { supabase, user, error: authError } = await requireActiveMember();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  try {
    const { error } = await supabase
      .from('event_confirmations')
      .delete()
      .eq('event_id', eventId)
      .eq('profile_id', user.id);
    if (error) return { ok: false, error: 'Não foi possível cancelar a confirmação. Tente novamente.' };
    revalidatePath('/dashboard/agenda');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
