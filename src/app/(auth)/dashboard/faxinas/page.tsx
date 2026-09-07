import { MemberChores, type MemberChoresData } from '@/components/portal/MemberViews';
import { createClient } from '@/lib/supabase/server';
import { todayISODate } from '@/lib/events';
import type { CleaningShiftDate, CleaningShiftSignup } from '@/types';

export default async function FaxinasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <MemberChores data={{ dates: [], signups: [], currentUserId: '' }} />;
  }

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

  const data: MemberChoresData = {
    dates: (dates ?? []) as CleaningShiftDate[],
    signups: (signups ?? []) as CleaningShiftSignup[],
    currentUserId: user.id,
  };

  return <MemberChores data={data} />;
}
