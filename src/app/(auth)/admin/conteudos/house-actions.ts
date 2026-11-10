'use server';

import { revalidatePath } from 'next/cache';
import { requireAdministrator } from '@/lib/server/access';

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidateDocs() {
  revalidatePath('/admin/conteudos');
  revalidatePath('/dashboard/regras');
}

export async function createHouseDocument(input: { title: string; description: string; filePath: string; fileName: string }): Promise<ActionResult> {
  const title = input.title.trim().slice(0, 160);
  if (title.length < 3) return { ok: false, error: 'Informe um título com pelo menos 3 letras.' };
  if (!input.filePath.trim()) return { ok: false, error: 'Arquivo inválido. Envie o PDF novamente.' };

  const { supabase, user, error: authError } = await requireAdministrator();
  if (authError || !user) return { ok: false, error: authError ?? 'Sessão expirada.' };

  const { error } = await supabase.from('house_documents').insert({
    title,
    description: input.description.trim() || null,
    file_path: input.filePath,
    file_name: input.fileName || null,
    created_by: user.id,
  });
  if (error) return { ok: false, error: 'Não foi possível cadastrar o documento. Tente novamente.' };
  revalidateDocs();
  return { ok: true };
}

export async function toggleHouseDocument(documentId: string, published: boolean): Promise<ActionResult> {
  if (!documentId) return { ok: false, error: 'Documento não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const { error } = await supabase
    .from('house_documents')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', documentId);
  if (error) return { ok: false, error: 'Não foi possível alterar a publicação.' };
  revalidateDocs();
  return { ok: true };
}

export async function deleteHouseDocument(documentId: string, filePath: string): Promise<ActionResult> {
  if (!documentId) return { ok: false, error: 'Documento não informado.' };
  const { supabase, error: authError } = await requireAdministrator();
  if (authError) return { ok: false, error: authError };

  const { error } = await supabase.from('house_documents').delete().eq('id', documentId);
  if (error) return { ok: false, error: 'Não foi possível excluir o documento.' };
  await supabase.storage.from('documentos').remove([filePath]);
  revalidateDocs();
  return { ok: true };
}
