import { ContentManagement } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';
import type { Ponto, PontoFolder, StudyContent } from '@/types';

export default async function AdminContentsPage() {
  const supabase = await createClient();
  const [contentsResult, foldersResult, pontosResult] = await Promise.all([
    supabase
      .from('contents')
      .select('*')
      .order('module', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase.from('ponto_folders').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
    supabase.from('pontos').select('*').order('title', { ascending: true }),
  ]);

  return (
    <ContentManagement
      contents={(contentsResult.data ?? []) as StudyContent[]}
      pontoFolders={(foldersResult.data ?? []) as PontoFolder[]}
      pontos={(pontosResult.data ?? []) as Ponto[]}
    />
  );
}
