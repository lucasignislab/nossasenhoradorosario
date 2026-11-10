'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type ProfileFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

function sanitize(value: FormDataEntryValue | null, max = 120): string {
  return String(value ?? '').trim().slice(0, max);
}

export async function updateProfile(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const fullName = sanitize(formData.get('fullName'));
  const phone = sanitize(formData.get('phone'), 30);
  const guiaFrente = sanitize(formData.get('guiaFrente'));
  const orixaCabeca = sanitize(formData.get('orixaCabeca'));
  const adjunto = sanitize(formData.get('adjunto'));
  const avatarUrl = sanitize(formData.get('avatarUrl'), 500);

  if (fullName.length < 3 || fullName.length > 120) {
    return { status: 'error', message: 'Informe seu nome completo.' };
  }

  if (phone && phone.replace(/\D/g, '').length < 10) {
    return { status: 'error', message: 'Confira o número do WhatsApp.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: 'Sua sessão expirou. Entre novamente.' };

  // Upsert: cobre quem entrou pelo Google e ficou sem linha em profiles —
  // a ficha é criada na hora, com papel/situação nos defaults protegidos.
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: fullName,
      phone: phone || null,
      guia_frente: guiaFrente || null,
      orixa_cabeca: orixaCabeca || null,
      adjunto: adjunto || null,
      avatar_url: avatarUrl || null,
    })
    .select('id')
    .single();

  if (error) return { status: 'error', message: 'Não foi possível salvar agora. Tente novamente.' };

  revalidatePath('/dashboard', 'layout');
  return { status: 'success', message: 'Seus dados foram atualizados.' };
}
