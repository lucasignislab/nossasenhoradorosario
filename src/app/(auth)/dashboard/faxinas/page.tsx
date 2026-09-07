import { MemberChores, type MemberChoresData } from '@/components/portal/MemberViews';
import { createClient } from '@/lib/supabase/server';
import type { ChoreSchedule, ChoreTeam, Profile } from '@/types';

export default async function FaxinasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <MemberChores data={{ teams: [], schedules: [], visibleTeammates: [], teammatesTotal: 0, currentUserId: '' }} />;
  }

  const { data: memberships } = await supabase
    .from('chore_team_members')
    .select('team_id')
    .eq('profile_id', user.id);

  const teamIds = [...new Set((memberships ?? []).map((row) => row.team_id))];

  if (teamIds.length === 0) {
    return <MemberChores data={{ teams: [], schedules: [], visibleTeammates: [], teammatesTotal: 0, currentUserId: user.id }} />;
  }

  const [teamsResult, schedulesResult, teammatesResult] = await Promise.all([
    supabase.from('chore_teams').select('*').in('id', teamIds).order('name', { ascending: true }),
    supabase.from('chore_schedules').select('*').in('team_id', teamIds).order('chore_date', { ascending: false }),
    supabase.from('chore_team_members').select('profile_id').in('team_id', teamIds),
  ]);

  const teammateIds = [...new Set((teammatesResult.data ?? []).map((row) => row.profile_id))];

  // RLS de profiles expõe apenas o próprio perfil para membros comuns;
  // os demais aparecem apenas como contagem.
  const { data: visibleProfiles } = teammateIds.length > 0
    ? await supabase.from('profiles').select('*').in('id', teammateIds)
    : { data: [] };

  const data: MemberChoresData = {
    teams: (teamsResult.data ?? []) as ChoreTeam[],
    schedules: (schedulesResult.data ?? []) as ChoreSchedule[],
    visibleTeammates: (visibleProfiles ?? []) as Profile[],
    teammatesTotal: teammateIds.length,
    currentUserId: user.id,
  };

  return <MemberChores data={data} />;
}
