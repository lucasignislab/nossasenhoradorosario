import { AdminOverview } from '@/components/portal/AdminViews';
import { todayISODate } from '@/lib/events';
import { currentMonthRange, summarizeMonth } from '@/lib/finance';
import { createClient } from '@/lib/supabase/server';
import type { FinanceEntry, Notice, PortalEvent, Profile } from '@/types';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: callerProfile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null };
  const callerRole = (callerProfile as { role: string } | null)?.role ?? 'member';
  const canSeeSensitive = callerRole === 'admin' || callerRole === 'developer';

  const { start, end } = currentMonthRange();

  const [activeResult, pendingProfilesResult, eventsResult, noticesResult, financeResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('profiles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    supabase
      .from('events')
      .select('*')
      .eq('status', 'confirmada')
      .gte('event_date', todayISODate())
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true })
      .limit(3),
    supabase
      .from('notices')
      .select('*')
      .eq('pinned', true)
      .order('published_at', { ascending: false })
      .limit(5),
    supabase
      .from('finance_entries')
      .select('*')
      .gte('entry_date', start)
      .lte('entry_date', end),
  ]);

  const pendingProfiles = (pendingProfilesResult.data ?? []) as Profile[];
  const summary = summarizeMonth((financeResult.data ?? []) as FinanceEntry[], start, end);

  return (
    <AdminOverview
      activeMembers={activeResult.count ?? 0}
      pendingMembers={pendingProfiles.length}
      pendingProfiles={pendingProfiles}
      upcomingEvents={(eventsResult.data ?? []) as PortalEvent[]}
      pinnedNotices={(noticesResult.data ?? []) as Notice[]}
      financeSummary={{ income: summary.income, expense: summary.expense, balance: summary.balance }}
      canSeeSensitive={canSeeSensitive}
    />
  );
}
