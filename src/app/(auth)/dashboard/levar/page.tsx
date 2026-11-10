import { MemberMural } from '@/components/portal/MuralViews';
import { createClient } from '@/lib/supabase/server';
import type { MuralItem, MuralPledge, MuralRosterEntry } from '@/types';

export default async function QuemVaiLevarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <MemberMural items={[]} pledges={[]} roster={[]} currentUserId="" />;
  }

  const { data: items } = await supabase
    .from('mural_items')
    .select('*')
    .order('created_at', { ascending: true });

  const itemList = (items ?? []) as MuralItem[];
  const itemIds = itemList.map((item) => item.id);

  const [{ data: pledges }, { data: roster }] = itemIds.length > 0
    ? await Promise.all([
        supabase.from('mural_pledges').select('*').in('item_id', itemIds),
        supabase.from('mural_roster').select('*').in('item_id', itemIds),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <MemberMural
      items={itemList}
      pledges={(pledges ?? []) as MuralPledge[]}
      roster={(roster ?? []) as MuralRosterEntry[]}
      currentUserId={user.id}
    />
  );
}
