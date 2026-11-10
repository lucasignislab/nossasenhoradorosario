import { MemberCambones } from '@/components/portal/CamboneViews';
import { createClient } from '@/lib/supabase/server';
import { todayISODate } from '@/lib/events';
import type { CamboneAssignment, CamboneRosterEntry, PortalEvent } from '@/types';

export default async function CambonesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <MemberCambones myAssignments={[]} events={[]} roster={[]} currentUserId="" />;
  }

  // Próximas giras confirmadas (hoje + 60 dias).
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + 60);

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'confirmada')
    .gte('event_date', todayISODate())
    .lte('event_date', horizon.toISOString().slice(0, 10))
    .order('event_date', { ascending: true });

  const eventList = (events ?? []) as PortalEvent[];
  const eventIds = eventList.map((event) => event.id);

  const [{ data: myAssignments }, { data: roster }] = eventIds.length > 0
    ? await Promise.all([
        supabase.from('cambone_assignments').select('*').eq('profile_id', user.id).in('event_id', eventIds),
        supabase.from('cambone_roster').select('*').in('event_id', eventIds),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <MemberCambones
      myAssignments={(myAssignments ?? []) as CamboneAssignment[]}
      events={eventList}
      roster={(roster ?? []) as CamboneRosterEntry[]}
      currentUserId={user.id}
    />
  );
}
