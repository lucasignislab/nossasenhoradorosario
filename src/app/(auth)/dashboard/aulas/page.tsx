import { MemberStudies } from '@/components/portal/MemberViews';
import { createClient } from '@/lib/supabase/server';
import type { StudyContent } from '@/types';

export default async function AulasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [contentsResult, progressResult] = await Promise.all([
    supabase
      .from('contents')
      .select('*')
      .eq('published', true)
      .order('module', { ascending: true })
      .order('sort_order', { ascending: true }),
    user
      ? supabase.from('content_progress').select('content_id').eq('profile_id', user.id)
      : Promise.resolve({ data: [] as { content_id: string }[] }),
  ]);

  const completedIds = (progressResult.data ?? []).map((row) => row.content_id);

  return (
    <MemberStudies
      contents={(contentsResult.data ?? []) as StudyContent[]}
      completedIds={completedIds}
    />
  );
}
