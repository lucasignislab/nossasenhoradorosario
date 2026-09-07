import { AgendaManagement } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';
import type { PortalEvent } from '@/types';

export default async function AdminAgendaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true });

  return <AgendaManagement events={(data ?? []) as PortalEvent[]} />;
}
