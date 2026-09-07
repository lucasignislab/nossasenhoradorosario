import { ContentManagement } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';
import type { StudyContent } from '@/types';

export default async function AdminContentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('contents')
    .select('*')
    .order('module', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  return <ContentManagement contents={(data ?? []) as StudyContent[]} />;
}
