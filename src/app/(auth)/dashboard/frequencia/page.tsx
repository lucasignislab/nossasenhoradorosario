import { MemberAttendance, type MemberAttendanceItem } from '@/components/portal/MemberViews';
import { createClient } from '@/lib/supabase/server';
import type { PortalEvent } from '@/types';

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <MemberAttendance history={[]} />;

  const { data } = await supabase
    .from('attendance')
    .select('present, justified, event:events(*)')
    .eq('profile_id', user.id);

  const history: MemberAttendanceItem[] = (data ?? [])
    .filter((row) => row.event)
    .map((row) => ({
      event: row.event as unknown as PortalEvent,
      present: row.present,
      justified: row.justified,
    }));

  return <MemberAttendance history={history} />;
}
