'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type ProfileFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export async function updateProfile(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();

  if (fullName.length < 3 || fullName.length > 120) {
    return { status: 'error', message: 'Informe seu nome completo.' };
  }

  if (phone && phone.replace(/\D/g, '').length < 10) {
    return { status: 'error', message: 'Confira o número do WhatsApp.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: 'Sua sessão expirou. Entre novamente.' };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, phone: phone || null })
    .eq('id', user.id);

  if (error) return { status: 'error', message: 'Não foi possível salvar agora. Tente novamente.' };

  revalidatePath('/dashboard', 'layout');
  return { status: 'success', message: 'Seus dados foram atualizados.' };
}
