import { MemberNotices } from '@/components/portal/MemberViews';
import { createClient } from '@/lib/supabase/server';
import type { Notice } from '@/types';

export default async function AvisosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('notices')
    .select('*')
    .order('pinned', { ascending: false })
    .order('published_at', { ascending: true });

  return <MemberNotices notices={(data ?? []) as Notice[]} />;
}
