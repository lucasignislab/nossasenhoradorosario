import { AttendanceDashboard } from '@/components/portal/AdminViews';
import { redirectEditorsAway } from '@/lib/server/access';
import { createClient } from '@/lib/supabase/server';
import type { Attendance, PortalEvent, Profile } from '@/types';

export default async function AdminAttendancePage() {
  await redirectEditorsAway();
  const supabase = await createClient();

  const [eventsResult, membersResult, attendanceResult] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true }),
    supabase
      .from('profiles')
      .select('*')
      .eq('status', 'active')
      .order('full_name', { ascending: true }),
    supabase
      .from('attendance')
      .select('*'),
  ]);

  return (
    <AttendanceDashboard
      events={(eventsResult.data ?? []) as PortalEvent[]}
      members={(membersResult.data ?? []) as Profile[]}
      attendance={(attendanceResult.data ?? []) as Attendance[]}
    />
  );
}
