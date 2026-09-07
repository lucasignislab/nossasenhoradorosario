'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ContentKind } from '@/types';

type ActionResult = { ok: true } | { ok: false; error: string };

export type ContentFormInput = {
  title: string;
  description: string;
  kind: ContentKind;
  url: string;
  module: string;
  duration_minutes: string;
  published: boolean;
};

async function requireAdministrator() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, error: 'Sessão expirada. Entre novamente.' };

  const { data: caller } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single();

  if (!caller || caller.status !== 'active' || !['admin', 'developer'].includes(caller.role)) {
    return { supabase, user: null, error: 'Você não tem permissão para gerenciar conteúdos.' };
  }

  return { supabase, user, error: null };
}

type ContentRecord = {
  title: string;
  description: string | null;
  kind: ContentKind;
  url: string;
  module: string | null;
  duration_minutes: number | null;
  published: boolean;
};

function parseContentInput(input: ContentFormInput): { record: ContentRecord } | { error: string } {
  const title = input.title.trim();
  if (title.length < 3) return { error: 'Informe um título com pelo menos 3 letras.' };

  const url = input.url.trim();
  try {
    // Aceita apenas URLs http(s) completas.
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return { error: 'Informe um link http(s) válido.' };
  } catch {
    return { error: 'Informe um link válido para o conteúdo.' };
  }

  if (!['video', 'artigo', 'documento'].includes(input.kind)) return { error: 'Escolha um tipo válido.' };

  let duration: number | null = null;
  if (input.duration_minutes.trim()) {
    const parsedDuration = Number(input.duration_minutes);
    if (!Number.isInteger(parsedDuration) || parsedDuration <= 0) {
      return { error: 'Duração deve ser um número inteiro de minutos.' };
    }
    duration = parsedDuration;
  }

  return {
    record: {
      title,
      description: input.description.trim() || null,
      kind: input.kind,
      url,
      module: input.module.trim() || null,
      duration_minutes: duration,
      published: input.published,
    },
  };
}

function revalidateContents() {
  revalidatePath('/admin/conteudos');
  revalidatePath('/dashboard/aulas');
}

export async function createContent(input: ContentFormInput): Promise<ActionResult> {
  const { supabase, user, error: authError } = await requireAdministrator();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const parsed = parseContentInput(input);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  try {
    const { error } = await supabase.from('contents').insert({ ...parsed.record, created_by: user.id });
    if (error) return { ok: false, error: 'Não foi possível criar o conteúdo. Tente novamente.' };
    revalidateContents();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function updateContent(contentId: string, input: ContentFormInput): Promise<ActionResult> {
  if (!contentId) return { ok: false, error: 'Conteúdo não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const parsed = parseContentInput(input);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  try {
    const { error } = await supabase.from('contents').update(parsed.record).eq('id', contentId);
    if (error) return { ok: false, error: 'Não foi possível salvar as alterações.' };
    revalidateContents();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function toggleContentPublished(contentId: string, published: boolean): Promise<ActionResult> {
  if (!contentId) return { ok: false, error: 'Conteúdo não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('contents').update({ published }).eq('id', contentId);
    if (error) return { ok: false, error: 'Não foi possível alterar a publicação.' };
    revalidateContents();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function deleteContent(contentId: string): Promise<ActionResult> {
  if (!contentId) return { ok: false, error: 'Conteúdo não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('contents').delete().eq('id', contentId);
    if (error) return { ok: false, error: 'Não foi possível excluir o conteúdo.' };
    revalidateContents();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
