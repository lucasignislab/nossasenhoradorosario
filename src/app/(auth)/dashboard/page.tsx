import { MemberHome, type MemberHomeSummary } from './MemberHome';
import { todayISODate } from '@/lib/events';
import { currentMonthRange } from '@/lib/finance';
import { createClient } from '@/lib/supabase/server';
import type { CleaningShiftDate, Notice, PortalEvent } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { start, end } = currentMonthRange();
  const today = todayISODate();

  const [eventsResult, confirmationsResult, noticesResult, signupsResult, feeResult] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('status', 'confirmada')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true })
      .limit(1),
    user
      ? supabase.from('event_confirmations').select('event_id').eq('profile_id', user.id)
      : Promise.resolve({ data: [] as { event_id: string }[] }),
    supabase
      .from('notices')
      .select('*')
      .order('pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(3),
    user
      ? supabase.from('cleaning_shift_signups').select('shift_date_id').eq('profile_id', user.id)
      : Promise.resolve({ data: [] as { shift_date_id: string }[] }),
    user
      ? supabase
          .from('finance_entries')
          .select('id', { count: 'exact', head: true })
          .eq('profile_id', user.id)
          .eq('type', 'entrada')
          .eq('category', 'mensalidade')
          .gte('entry_date', start)
          .lte('entry_date', end)
      : Promise.resolve({ count: 0 }),
  ]);

  const nextEvent = ((eventsResult.data ?? []) as PortalEvent[])[0] ?? null;
  const confirmedIds = new Set((confirmationsResult.data ?? []).map((row) => row.event_id));

  // Próxima data de cuidado em que a pessoa está inscrita.
  let nextChore: MemberHomeSummary['nextChore'] = null;
  const shiftDateIds = (signupsResult.data ?? []).map((row) => row.shift_date_id);
  if (shiftDateIds.length > 0) {
    const { data: shiftDates } = await supabase
      .from('cleaning_shift_dates')
      .select('shift_date')
      .in('id', shiftDateIds)
      .gte('shift_date', today)
      .order('shift_date', { ascending: true })
      .limit(1);
    const shiftDate = ((shiftDates ?? []) as Pick<CleaningShiftDate, 'shift_date'>[])[0] ?? null;
    if (shiftDate) nextChore = { shiftDate: shiftDate.shift_date };
  }

  const summary: MemberHomeSummary = {
    nextEvent,
    nextEventConfirmed: nextEvent ? confirmedIds.has(nextEvent.id) : false,
    notices: (noticesResult.data ?? []) as Notice[],
    nextChore,
    monthFeePaid: (feeResult.count ?? 0) > 0,
  };

  return <MemberHome summary={summary} />;
}
