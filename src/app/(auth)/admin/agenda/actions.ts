'use server';

import { revalidatePath } from 'next/cache';
import { requireContentManager } from '@/lib/server/access';
import type { EventCategory } from '@/types';

type ActionResult = { ok: true } | { ok: false; error: string };

export type EventFormInput = {
  title: string;
  entity: string;
  category: EventCategory;
  event_date: string;
  event_time: string;
  location: string;
  description: string;
  details: string;
  image_url: string;
};

const VALID_CATEGORIES: EventCategory[] = ['gira', 'festividade', 'acao-social', 'curso'];

type EventRecord = {
  title: string;
  entity: string | null;
  category: EventCategory;
  event_date: string;
  event_time: string | null;
  location: string;
  description: string | null;
  details: string | null;
  image_url: string | null;
};

type ParsedEventInput =
  | { record: EventRecord; error?: undefined }
  | { error: string; record?: undefined };

function parseEventInput(input: EventFormInput): ParsedEventInput {
  const title = input.title.trim();
  if (title.length < 3) return { error: 'Informe um título com pelo menos 3 letras.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.event_date)) {
    return { error: 'Informe uma data válida.' as const };
  }
  if (!VALID_CATEGORIES.includes(input.category)) {
    return { error: 'Escolha uma categoria válida.' as const };
  }

  return {
    record: {
      title,
      entity: input.entity.trim() || null,
      category: input.category,
      event_date: input.event_date,
      event_time: input.event_time || null,
      location: input.location.trim() || 'T. U. Senhora do Rosário',
      description: input.description.trim() || null,
      details: input.details.trim() || null,
      image_url: input.image_url.trim() || null,
    },
  };
}

function revalidateAgendas() {
  revalidatePath('/admin/agenda');
  revalidatePath('/dashboard/agenda');
  revalidatePath('/agenda');
  revalidatePath('/');
}

export async function createEvent(input: EventFormInput): Promise<ActionResult> {
  const { supabase, user, error: authError } = await requireContentManager();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const parsed = parseEventInput(input);
  if (!parsed.record) return { ok: false, error: parsed.error ?? 'Dados inválidos.' };

  try {
    const { error } = await supabase.from('events').insert({ ...parsed.record, created_by: user.id });
    if (error) return { ok: false, error: 'Não foi possível criar o evento. Tente novamente.' };
    revalidateAgendas();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function updateEvent(eventId: string, input: EventFormInput): Promise<ActionResult> {
  if (!eventId) return { ok: false, error: 'Evento não informado.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  const parsed = parseEventInput(input);
  if (!parsed.record) return { ok: false, error: parsed.error ?? 'Dados inválidos.' };

  try {
    const { error } = await supabase.from('events').update(parsed.record).eq('id', eventId);
    if (error) return { ok: false, error: 'Não foi possível salvar as alterações.' };
    revalidateAgendas();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function cancelEvent(eventId: string): Promise<ActionResult> {
  if (!eventId) return { ok: false, error: 'Evento não informado.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('events').update({ status: 'cancelada' }).eq('id', eventId);
    if (error) return { ok: false, error: 'Não foi possível cancelar o evento.' };
    revalidateAgendas();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function restoreEvent(eventId: string): Promise<ActionResult> {
  if (!eventId) return { ok: false, error: 'Evento não informado.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('events').update({ status: 'confirmada' }).eq('id', eventId);
    if (error) return { ok: false, error: 'Não foi possível reconfirmar o evento.' };
    revalidateAgendas();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}

export async function deleteEvent(eventId: string): Promise<ActionResult> {
  if (!eventId) return { ok: false, error: 'Evento não informado.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  try {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) return { ok: false, error: 'Não foi possível excluir o evento.' };
    revalidateAgendas();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' };
  }
}
