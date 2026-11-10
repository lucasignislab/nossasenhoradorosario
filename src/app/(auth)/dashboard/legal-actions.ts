'use server';

import { createClient } from '@/lib/supabase/server';
import { TERMS_VERSION } from '@/lib/legal';

/** Registra o aceite da versão vigente dos Termos de Uso e Política de Privacidade. */
export async function acceptTerms(): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from('profiles')
    .update({ terms_accepted_at: new Date().toISOString(), terms_version: TERMS_VERSION })
    .eq('id', user.id);
  return { ok: !error };
}
