import { MemberAgenda, type MemberSelfAttendanceMap } from '@/components/portal/MemberViews';
import { attendanceWindowOpen } from '@/lib/attendance';
import { todayISODate } from '@/lib/events';
import { createClient } from '@/lib/supabase/server';
import type { PortalEvent } from '@/types';

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [eventsResult, confirmationsResult] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('status', 'confirmada')
      .gte('event_date', todayISODate())
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true }),
    user
      ? supabase.from('event_confirmations').select('event_id').eq('profile_id', user.id)
      : Promise.resolve({ data: [] as { event_id: string }[] }),
  ]);

  const events = (eventsResult.data ?? []) as PortalEvent[];
  const confirmedEventIds = (confirmationsResult.data ?? []).map((row) => row.event_id);

  // Auto-registro de frequência: traz os registros do próprio membro nas
  // atividades cuja janela (dia do evento até 24h após o início) está aberta.
  const openEvents = events.filter((event) => attendanceWindowOpen(event));
  const selfAttendance: MemberSelfAttendanceMap = {};
  if (user && openEvents.length > 0) {
    const { data: rows } = await supabase
      .from('attendance')
      .select('event_id, present, justified, notes')
      .eq('profile_id', user.id)
      .in('event_id', openEvents.map((event) => event.id));
    const byEventId = new Map((rows ?? []).map((row) => [row.event_id, row]));
    for (const event of openEvents) {
      const row = byEventId.get(event.id);
      selfAttendance[event.id] = {
        windowOpen: true,
        record: row ? { present: row.present, justified: row.justified, notes: row.notes } : null,
      };
    }
  }

  return (
    <MemberAgenda
      events={events}
      confirmedEventIds={confirmedEventIds}
      selfAttendance={selfAttendance}
    />
  );
}
