import { MemberFinance } from '@/components/portal/MemberViews';
import { createClient } from '@/lib/supabase/server';
import type { FinanceEntry } from '@/types';

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from('finance_entries')
        .select('*')
        .eq('profile_id', user.id)
        .order('entry_date', { ascending: false })
    : { data: [] };

  return <MemberFinance entries={(data ?? []) as FinanceEntry[]} />;
}
