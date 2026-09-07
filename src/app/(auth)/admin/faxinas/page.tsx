import { ChoresManagement, type ChoreTeamMemberRow } from '@/components/portal/AdminViews';
import { createClient } from '@/lib/supabase/server';
import type { ChoreSchedule, ChoreTeam, Profile } from '@/types';

export default async function AdminChoresPage() {
  const supabase = await createClient();

  const [teamsResult, schedulesResult, teamMembersResult, membersResult] = await Promise.all([
    supabase.from('chore_teams').select('*').order('name', { ascending: true }),
    supabase.from('chore_schedules').select('*').order('chore_date', { ascending: false }),
    supabase.from('chore_team_members').select('team_id, profile_id'),
    supabase.from('profiles').select('*').eq('status', 'active').order('full_name', { ascending: true }),
  ]);

  return (
    <ChoresManagement
      teams={(teamsResult.data ?? []) as ChoreTeam[]}
      schedules={(schedulesResult.data ?? []) as ChoreSchedule[]}
      teamMembers={(teamMembersResult.data ?? []) as ChoreTeamMemberRow[]}
      members={(membersResult.data ?? []) as Profile[]}
    />
  );
}
