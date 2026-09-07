import { AdminOverview } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await createClient();

  const [activeResult, pendingResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ]);

  return (
    <AdminOverview
      activeMembers={activeResult.count ?? 0}
      pendingMembers={pendingResult.count ?? 0}
    />
  );
}
