import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import '@/styles/dashboard-home.css';
import '@/styles/portal.css';

type DashboardLayoutRouteProps = { children: React.ReactNode };

type Profile = {
  full_name: string;
  role: 'member' | 'admin' | 'developer';
  status: 'pending' | 'active' | 'suspended';
};

export default async function AuthenticatedDashboardLayout({ children }: DashboardLayoutRouteProps) {
  if (!isSupabaseConfigured) {
    return (
      <main className="member-state">
        <div className="member-state__symbol">SR</div>
        <p className="member-state__eyebrow">Configuração inicial</p>
        <h1>O portal está pronto para ser conectado.</h1>
        <p>Adicione as credenciais do Supabase em <code>.env.local</code> para ativar cadastros e acessos.</p>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('profiles')
    .select('full_name, role, status')
    .eq('id', user.id)
    .single();
  const profile = data as Profile | null;

  const member = {
    name: profile?.full_name || user.user_metadata.full_name || user.email?.split('@')[0] || 'Membro',
    email: user.email || '',
    role: profile?.role || 'member',
  };

  if (!profile || profile.status !== 'active') {
    return (
      <DashboardLayout user={member}>
        <section className="member-state member-state--inside">
          <div className="member-state__symbol">Axé</div>
          <p className="member-state__eyebrow">
            {profile?.status === 'suspended' ? 'Acesso temporariamente suspenso' : 'Cadastro recebido'}
          </p>
          <h1>{profile?.status === 'suspended' ? 'Converse com a administração da casa.' : 'Seu acesso aguarda aprovação.'}</h1>
          <p>
            {profile?.status === 'suspended'
              ? 'A administração poderá orientar você e reativar o acesso quando apropriado.'
              : 'Iyá Pri ou Iyá Bru confirmarão seu vínculo com a casa. Depois disso, as áreas internas serão liberadas automaticamente.'}
          </p>
        </section>
      </DashboardLayout>
    );
  }

  return <DashboardLayout user={member}>{children}</DashboardLayout>;
}
