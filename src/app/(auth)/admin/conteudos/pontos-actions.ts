'use server';

import { revalidatePath } from 'next/cache';
import { requireContentManager } from '@/lib/server/access';

type ActionResult = { ok: true } | { ok: false; error: string };

function sanitizeName(value: string, max = 120): string {
  return value.trim().slice(0, max);
}

function revalidatePontos() {
  revalidatePath('/admin/conteudos');
  revalidatePath('/dashboard/pontos');
}

export async function createPontoFolder(name: string, parentId: string | null): Promise<ActionResult> {
  const folderName = sanitizeName(name);
  if (folderName.length < 2) return { ok: false, error: 'Informe um nome com pelo menos 2 letras.' };

  const { supabase, user, error: authError } = await requireContentManager();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const { error } = await supabase
    .from('ponto_folders')
    .insert({ name: folderName, parent_id: parentId, created_by: user.id });
  if (error) return { ok: false, error: 'Não foi possível criar a pasta. Tente novamente.' };
  revalidatePontos();
  return { ok: true };
}

export async function renamePontoFolder(folderId: string, name: string): Promise<ActionResult> {
  const folderName = sanitizeName(name);
  if (!folderId) return { ok: false, error: 'Pasta não informada.' };
  if (folderName.length < 2) return { ok: false, error: 'Informe um nome com pelo menos 2 letras.' };

  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  const { error } = await supabase
    .from('ponto_folders')
    .update({ name: folderName, updated_at: new Date().toISOString() })
    .eq('id', folderId);
  if (error) return { ok: false, error: 'Não foi possível renomear a pasta.' };
  revalidatePontos();
  return { ok: true };
}

/** Exclui pasta somente se estiver vazia (sem subpastas e sem pontos). */
export async function deletePontoFolder(folderId: string): Promise<ActionResult> {
  if (!folderId) return { ok: false, error: 'Pasta não informada.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  const [{ count: childFolders }, { count: childPontos }] = await Promise.all([
    supabase.from('ponto_folders').select('id', { count: 'exact', head: true }).eq('parent_id', folderId),
    supabase.from('pontos').select('id', { count: 'exact', head: true }).eq('folder_id', folderId),
  ]);
  if ((childFolders ?? 0) > 0 || (childPontos ?? 0) > 0) {
    return { ok: false, error: 'A pasta tem conteúdo. Remova as subpastas e os pontos antes de excluí-la.' };
  }

  const { error } = await supabase.from('ponto_folders').delete().eq('id', folderId);
  if (error) return { ok: false, error: 'Não foi possível excluir a pasta.' };
  revalidatePontos();
  return { ok: true };
}

export async function createPonto(input: { folderId: string; title: string; filePath: string; fileName: string }): Promise<ActionResult> {
  const title = sanitizeName(input.title, 160);
  if (!input.folderId) return { ok: false, error: 'Pasta não informada.' };
  if (title.length < 3) return { ok: false, error: 'Informe um título com pelo menos 3 letras.' };
  if (!input.filePath.startsWith(`${input.folderId}/`)) return { ok: false, error: 'Arquivo inválido. Envie o PDF novamente.' };

  const { supabase, user, error: authError } = await requireContentManager();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const { error } = await supabase
    .from('pontos')
    .insert({ folder_id: input.folderId, title, file_path: input.filePath, file_name: input.fileName || null, created_by: user.id });
  if (error) return { ok: false, error: 'Não foi possível cadastrar o ponto. Tente novamente.' };
  revalidatePontos();
  return { ok: true };
}

export async function deletePonto(pontoId: string, filePath: string): Promise<ActionResult> {
  if (!pontoId) return { ok: false, error: 'Ponto não informado.' };
  const { supabase, error: authError } = await requireContentManager();
  if (authError) return { ok: false, error: authError };

  const { error } = await supabase.from('pontos').delete().eq('id', pontoId);
  if (error) return { ok: false, error: 'Não foi possível excluir o ponto.' };
  await supabase.storage.from('pontos').remove([filePath]);
  revalidatePontos();
  return { ok: true };
}
