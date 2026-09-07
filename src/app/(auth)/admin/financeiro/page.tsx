import { FinanceDashboard } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';
import type { FinanceEntry, Profile } from '@/types';

export default async function AdminFinancePage() {
  const supabase = await createClient();

  const since = new Date();
  since.setMonth(since.getMonth() - 11);
  const sinceISO = `${since.getFullYear()}-${String(since.getMonth() + 1).padStart(2, '0')}-01`;

  const [entriesResult, membersResult] = await Promise.all([
    supabase
      .from('finance_entries')
      .select('*')
      .gte('entry_date', sinceISO)
      .order('entry_date', { ascending: false }),
    supabase
      .from('profiles')
      .select('*')
      .eq('status', 'active')
      .order('full_name', { ascending: true }),
  ]);

  return (
    <FinanceDashboard
      entries={(entriesResult.data ?? []) as FinanceEntry[]}
      members={(membersResult.data ?? []) as Profile[]}
    />
  );
}
