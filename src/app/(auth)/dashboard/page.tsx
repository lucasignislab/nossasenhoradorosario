import { MemberHome, type MemberHomeSummary } from './MemberHome';
import { todayISODate } from '@/lib/events';
import { currentMonthRange } from '@/lib/finance';
import { createClient } from '@/lib/supabase/server';
import type { ChoreSchedule, ChoreTeam, Notice, PortalEvent } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { start, end } = currentMonthRange();
  const today = todayISODate();

  const [eventsResult, confirmationsResult, noticesResult, membershipsResult, feeResult] = await Promise.all([
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
      ? supabase.from('chore_team_members').select('team_id').eq('profile_id', user.id)
      : Promise.resolve({ data: [] as { team_id: string }[] }),
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

  let nextChore: MemberHomeSummary['nextChore'] = null;
  const teamIds = [...new Set((membershipsResult.data ?? []).map((row) => row.team_id))];
  if (teamIds.length > 0) {
    const { data: schedules } = await supabase
      .from('chore_schedules')
      .select('*')
      .in('team_id', teamIds)
      .eq('status', 'agendada')
      .gte('chore_date', today)
      .order('chore_date', { ascending: true })
      .limit(1);
    const schedule = ((schedules ?? []) as ChoreSchedule[])[0] ?? null;
    if (schedule) {
      const { data: team } = await supabase.from('chore_teams').select('name').eq('id', schedule.team_id).single();
      nextChore = { schedule, teamName: (team as Pick<ChoreTeam, 'name'> | null)?.name ?? 'Sua equipe' };
    }
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
