'use server';

import { createClient } from '@/lib/supabase/server';

/** Marca o tour de boas-vindas como concluído para o usuário logado. */
export async function markOnboarded(): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from('profiles')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', user.id);
  return { ok: !error };
}
