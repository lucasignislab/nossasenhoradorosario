import { CamboneManagement } from '@/components/portal/CamboneViews';
import { createClient } from '@/lib/supabase/server';
import { todayISODate } from '@/lib/events';
import type { CamboneAssignment, DirectoryMember, PortalEvent } from '@/types';

export default async function AdminCambonesPage() {
  const supabase = await createClient();

  // Giras confirmadas de hoje em diante (60 dias), em ordem crescente.
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

  const [{ data: assignments }, { data: allAssignments }, { data: members }] = await Promise.all([
    eventIds.length > 0
      ? supabase.from('cambone_assignments').select('*').in('event_id', eventIds).order('created_at', { ascending: true })
      : Promise.resolve({ data: [] }),
    // Histórico completo para o rodízio justo.
    supabase.from('cambone_assignments').select('*'),
    supabase.from('directory_members').select('*').order('full_name', { ascending: true }),
  ]);

  return (
    <CamboneManagement
      events={eventList}
      assignments={(assignments ?? []) as CamboneAssignment[]}
      allAssignments={(allAssignments ?? []) as CamboneAssignment[]}
      members={(members ?? []) as DirectoryMember[]}
    />
  );
}
