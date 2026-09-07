import { AdminSettings } from '@/components/portal/AdminViews';
import { redirectEditorsAway } from '@/lib/server/access';
import { createClient } from '@/lib/supabase/server';

async function countByStatusAndRole(supabase: Awaited<ReturnType<typeof createClient>>, status: string, role?: string) {
  let query = supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', status);
  if (role) query = query.eq('role', role);
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminSettingsPage() {
  await redirectEditorsAway();
  const supabase = await createClient();

  const [admins, developers, members, editors, pending] = await Promise.all([
    countByStatusAndRole(supabase, 'active', 'admin'),
    countByStatusAndRole(supabase, 'active', 'developer'),
    countByStatusAndRole(supabase, 'active', 'member'),
    countByStatusAndRole(supabase, 'active', 'editor'),
    countByStatusAndRole(supabase, 'pending'),
  ]);

  return <AdminSettings counts={{ admins, developers, members, editors, pending }} />;
}
