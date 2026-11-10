import { ContentManagement } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';
import type { HouseDocument, Ponto, PontoFolder, StudyContent } from '@/types';

export default async function AdminContentsPage() {
  const supabase = await createClient();
  const [contentsResult, foldersResult, pontosResult, documentsResult] = await Promise.all([
    supabase
      .from('contents')
      .select('*')
      .order('module', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase.from('ponto_folders').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
    supabase.from('pontos').select('*').order('title', { ascending: true }),
    supabase.from('house_documents').select('*').order('sort_order', { ascending: true }).order('title', { ascending: true }),
  ]);

  return (
    <ContentManagement
      contents={(contentsResult.data ?? []) as StudyContent[]}
      pontoFolders={(foldersResult.data ?? []) as PontoFolder[]}
      pontos={(pontosResult.data ?? []) as Ponto[]}
      houseDocuments={(documentsResult.data ?? []) as HouseDocument[]}
    />
  );
}
