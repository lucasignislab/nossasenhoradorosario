import { MemberAgenda } from '@/components/portal/MemberViews';
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

  const confirmedEventIds = (confirmationsResult.data ?? []).map((row) => row.event_id);

  return (
    <MemberAgenda
      events={(eventsResult.data ?? []) as PortalEvent[]}
      confirmedEventIds={confirmedEventIds}
    />
  );
}
