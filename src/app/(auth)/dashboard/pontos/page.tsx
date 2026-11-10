import { PontosBrowser } from '@/components/portal/PontosBrowser';
import { createClient } from '@/lib/supabase/server';
import type { Ponto, PontoFolder } from '@/types';

export default async function PontosPage() {
  const supabase = await createClient();
  const [foldersResult, pontosResult] = await Promise.all([
    supabase.from('ponto_folders').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
    supabase.from('pontos').select('*').order('title', { ascending: true }),
  ]);

  return (
    <PontosBrowser
      folders={(foldersResult.data ?? []) as PontoFolder[]}
      pontos={(pontosResult.data ?? []) as Ponto[]}
    />
  );
}
