import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { createClient } from '@/lib/supabase/server';
import '@/styles/portal.css';
import '@/styles/portal-corporate.css';

type Profile = {
  full_name: string;
  role: 'member' | 'admin' | 'developer' | 'editor';
  status: 'pending' | 'active' | 'suspended';
  avatar_url: string | null;
  onboarded_at: string | null;
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?retorno=/admin');

  const { data } = await supabase.from('profiles').select('full_name, role, status, avatar_url, onboarded_at').eq('id', user.id).single();
  const profile = data as Profile | null;
  if (!profile || profile.status !== 'active' || !['admin', 'developer', 'editor'].includes(profile.role)) redirect('/dashboard');

  return (
    <DashboardLayout mode="admin" user={{ name: profile.full_name, email: user.email ?? '', role: profile.role, avatarUrl: profile.avatar_url, onboarded: Boolean(profile.onboarded_at) }}>
      {children}
    </DashboardLayout>
  );
}
