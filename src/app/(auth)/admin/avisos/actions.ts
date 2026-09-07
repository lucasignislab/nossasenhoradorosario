'use server';

import { revalidatePath } from 'next/cache';
import { requireContentManager } from '@/lib/server/access';

type ActionResult = { ok: true } | { ok: false; error: string };

export type NoticeFormInput = {
  title: string;
  body: string;
  category: string;
  pinned: boolean;
};

function parseNoticeInput(input: NoticeFormInput): { record: Omit<NoticeFormInput, never> & { title: string; body: string; category: string } } | { error: string } {
  const title = input.title.trim();
  if (title.length < 3) return { error: 'Informe um título com pelo menos 3 letras.' };
  const body = input.body.trim();
  if (body.length < 3) return { error: 'Escreva o texto do aviso.' };
  const category = input.category.trim() || 'geral';
  return { record: { title, body, category, pinned: input.pinned } };
}

function revalidateNotices() {
  revalidatePath('/admin/avisos');
  revalidatePath('/dashboard/avisos');
  revalidatePath('/dashboard');
}

export async function createNotice(input: NoticeFormInput): Promise<ActionResult> {
  const { supabase, user, error: authError } = await requireContentManager();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const parsed = parseNoticeInput(input);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  try {
    const { error } = await supabase.from('notices').insert({ ...parsed.record, created_by: user.id });
    if (error) return { ok: false, error: 'Não foi possível publicar o aviso. Tente novamente.' };
    revalidateNotices();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function updateNotice(noticeId: string, input: NoticeFormInput): Promise<ActionResult> {
  if (!noticeId) return { ok: false, error: 'Aviso não informado.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  const parsed = parseNoticeInput(input);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  try {
    const { error } = await supabase.from('notices').update(parsed.record).eq('id', noticeId);
    if (error) return { ok: false, error: 'Não foi possível salvar as alterações.' };
    revalidateNotices();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function toggleNoticePinned(noticeId: string, pinned: boolean): Promise<ActionResult> {
  if (!noticeId) return { ok: false, error: 'Aviso não informado.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('notices').update({ pinned }).eq('id', noticeId);
    if (error) return { ok: false, error: 'Não foi possível alterar o destaque.' };
    revalidateNotices();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function deleteNotice(noticeId: string): Promise<ActionResult> {
  if (!noticeId) return { ok: false, error: 'Aviso não informado.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('notices').delete().eq('id', noticeId);
    if (error) return { ok: false, error: 'Não foi possível excluir o aviso.' };
    revalidateNotices();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
