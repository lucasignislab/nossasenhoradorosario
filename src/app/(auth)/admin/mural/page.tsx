import { MuralManagement } from '@/components/portal/MuralViews';
import { createClient } from '@/lib/supabase/server';
import type { MuralItem, MuralPledge, Profile } from '@/types';

export default async function AdminMuralPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from('mural_items')
    .select('*')
    .order('created_at', { ascending: true });

  const itemList = (items ?? []) as MuralItem[];

  const { data: pledges } = await supabase
    .from('mural_pledges')
    .select('*')
    .order('created_at', { ascending: true });

  const pledgeList = (pledges ?? []) as MuralPledge[];
  const profileIds = [...new Set(pledgeList.map((pledge) => pledge.profile_id))];

  const { data: profiles } = profileIds.length > 0
    ? await supabase.from('profiles').select('*').in('id', profileIds).order('full_name', { ascending: true })
    : { data: [] };

  return (
    <MuralManagement
      items={itemList}
      pledges={pledgeList}
      members={(profiles ?? []) as Profile[]}
    />
  );
}
