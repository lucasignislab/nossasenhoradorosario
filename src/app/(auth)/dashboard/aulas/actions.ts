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
    return { supabase, user: null, error: 'Seu cadastro precisa estar ativo para registrar progresso.' as const };
  }

  return { supabase, user, error: null };
}

export async function markContentCompleted(contentId: string): Promise<ActionResult> {
  if (!contentId) return { ok: false, error: 'Conteúdo não informado.' };
  const { supabase, user, error: authError } = await requireActiveMember();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  try {
    const { error } = await supabase
      .from('content_progress')
      .upsert({ content_id: contentId, profile_id: user.id }, { onConflict: 'content_id,profile_id' });
    if (error) return { ok: false, error: 'Não foi possível registrar o progresso. Tente novamente.' };
    revalidatePath('/dashboard/aulas');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function unmarkContentCompleted(contentId: string): Promise<ActionResult> {
  if (!contentId) return { ok: false, error: 'Conteúdo não informado.' };
  const { supabase, user, error: authError } = await requireActiveMember();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  try {
    const { error } = await supabase
      .from('content_progress')
      .delete()
      .eq('content_id', contentId)
      .eq('profile_id', user.id);
    if (error) return { ok: false, error: 'Não foi possível desfazer a marcação. Tente novamente.' };
    revalidatePath('/dashboard/aulas');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
