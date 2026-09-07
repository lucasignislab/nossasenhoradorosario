import { MemberAttendance, type MemberAttendanceItem, type MemberUpcomingAttendance } from '@/components/portal/MemberViews';
import { attendanceWindowOpen } from '@/lib/attendance';
import { todayISODate } from '@/lib/events';
import { createClient } from '@/lib/supabase/server';
import type { PortalEvent } from '@/types';

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <MemberAttendance history={[]} />;

  const [attendanceResult, upcomingResult] = await Promise.all([
    supabase
      .from('attendance')
      .select('present, justified, notes, event_id, event:events(*)')
      .eq('profile_id', user.id),
    supabase
      .from('events')
      .select('*')
      .eq('status', 'confirmada')
      .gte('event_date', todayISODate())
      .order('event_date', { ascending: true })
      .limit(12),
  ]);

  const history: MemberAttendanceItem[] = (attendanceResult.data ?? [])
    .filter((row) => row.event)
    .map((row) => ({
      event: row.event as unknown as PortalEvent,
      present: row.present,
      justified: row.justified,
    }));

  const recordByEvent = new Map(
    (attendanceResult.data ?? []).map((row) => [row.event_id, { present: row.present, justified: row.justified, notes: row.notes }]),
  );

  const upcoming: MemberUpcomingAttendance[] = ((upcomingResult.data ?? []) as PortalEvent[]).map((event) => ({
    event,
    current: recordByEvent.get(event.id) ?? null,
    windowOpen: attendanceWindowOpen(event),
  }));

  return <MemberAttendance history={history} upcoming={upcoming} />;
}
