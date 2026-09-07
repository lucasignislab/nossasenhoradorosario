import { MembersManagement } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types';

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const [pendingResult, membersResult, activeResult, pendingCountResult, suspendedResult] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true }),
      supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true }),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'suspended'),
    ]);

  const pending = (pendingResult.data ?? []) as Profile[];
  const members = (membersResult.data ?? []) as Profile[];
  const counts = {
    active: activeResult.count ?? 0,
    pending: pendingCountResult.count ?? pending.length,
    suspended: suspendedResult.count ?? 0,
  };

  return <MembersManagement pending={pending} members={members} counts={counts} />;
}
