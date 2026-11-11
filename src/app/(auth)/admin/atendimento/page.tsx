import { AttendanceManager } from '@/components/portal/AttendanceManager';
import { redirectEditorsAway } from '@/lib/server/access';
import { createClient } from '@/lib/supabase/server';
import type { AttendanceSession, AttendanceTicket, PortalEvent } from '@/types';

export default async function AdminAttendancePage() {
  await redirectEditorsAway();
  const supabase = await createClient();

  const [sessionsResult, eventsResult] = await Promise.all([
    supabase
      .from('attendance_sessions')
      .select('*')
      .order('session_date', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('events')
      .select('id, title, event_date, event_time, category')
      .eq('status', 'confirmada')
      .order('event_date', { ascending: false })
      .limit(30),
  ]);

  const sessions = (sessionsResult.data ?? []) as AttendanceSession[];
  const sessionIds = sessions.map((session) => session.id);

  const { data: ticketsData } = sessionIds.length > 0
    ? await supabase
        .from('attendance_tickets')
        .select('*')
        .in('session_id', sessionIds)
        .order('number', { ascending: true })
    : { data: [] };

  return (
    <AttendanceManager
      sessions={sessions}
      tickets={(ticketsData ?? []) as AttendanceTicket[]}
      events={(eventsResult.data ?? []) as Pick<PortalEvent, 'id' | 'title' | 'event_date' | 'event_time' | 'category'>[]}
    />
  );
}
