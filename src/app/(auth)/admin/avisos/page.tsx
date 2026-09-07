import { NoticesManagement } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';
import type { Notice } from '@/types';

export default async function AdminNoticesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('notices')
    .select('*')
    .order('pinned', { ascending: false })
    .order('published_at', { ascending: false });

  return <NoticesManagement notices={(data ?? []) as Notice[]} />;
}
