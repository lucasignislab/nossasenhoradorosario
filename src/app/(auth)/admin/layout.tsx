import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { createClient } from '@/lib/supabase/server';
import '@/styles/portal.css';
import '@/styles/portal-corporate.css';

type Profile = {
  full_name: string;
  role: 'member' | 'admin' | 'developer';
  status: 'pending' | 'active' | 'suspended';
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?retorno=/admin');

  const { data } = await supabase.from('profiles').select('full_name, role, status').eq('id', user.id).single();
  const profile = data as Profile | null;
  if (!profile || profile.status !== 'active' || !['admin', 'developer'].includes(profile.role)) redirect('/dashboard');

  return (
    <DashboardLayout mode="admin" user={{ name: profile.full_name, email: user.email ?? '', role: profile.role }}>
      {children}
    </DashboardLayout>
  );
}
