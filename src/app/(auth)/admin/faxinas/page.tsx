import { ChoresManagement } from '@/components/portal/AdminViews';
import { redirectEditorsAway } from '@/lib/server/access';
import { createClient } from '@/lib/supabase/server';
import { todayISODate } from '@/lib/events';
import type { CleaningShiftDate, CleaningShiftSignup, Profile } from '@/types';

export default async function AdminChoresPage() {
  await redirectEditorsAway();
  const supabase = await createClient();

  // Gera as datas do mês atual e do próximo (todas as quintas + o sábado do mês).
  await supabase.rpc('ensure_cleaning_shift_dates');

  const { data: dates } = await supabase
    .from('cleaning_shift_dates')
    .select('*')
    .gte('shift_date', todayISODate())
    .order('shift_date', { ascending: true });

  const dateIds = (dates ?? []).map((date) => date.id);

  const { data: signups } = dateIds.length > 0
    ? await supabase.from('cleaning_shift_signups').select('*').in('shift_date_id', dateIds)
    : { data: [] };

  const profileIds = [...new Set((signups ?? []).map((signup) => signup.profile_id))];

  const { data: profiles } = profileIds.length > 0
    ? await supabase.from('profiles').select('*').in('id', profileIds).order('full_name', { ascending: true })
    : { data: [] };

  return (
    <ChoresManagement
      dates={(dates ?? []) as CleaningShiftDate[]}
      signups={(signups ?? []) as CleaningShiftSignup[]}
      profiles={(profiles ?? []) as Profile[]}
    />
  );
}
