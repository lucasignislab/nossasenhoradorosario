'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card/stat-card';

export default function DashboardPage() {
  const user = {
    name: 'João Silva',
    email: 'joao@exemplo.com',
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // TODO: Integrar com Supabase Auth
    // await supabase.auth.signOut();
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '30px', color: '#2c1810' }}>
          Bem-vindo, {user.name}!
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          <StatCard
            icon="🎭"
            title="Próxima Gira"
            value="20/03/2026"
            subtitle="Linha dos Caboclos • 20:00"
          />
          <StatCard
            icon="💚"
            title="Mensalidade"
            value="Em Dia"
            subtitle="Próximo vencimento: 10/04/2026"
            variant="success"
          />
          <StatCard
            icon="📚"
            title="Última Aula"
            value="Desenvolvimento Mediúnico"
            subtitle="Postada há 3 dias"
          />
        </div>

        <section
          style={{
            background: 'linear-gradient(135deg, #f9f7f3 0%, #f5f3f0 100%)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 165, 116, 0.2)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#2c1810' }}>Próximos Eventos</h2>
          <p style={{ color: '#7d5a3d', lineHeight: 1.6 }}>
            Aqui você verá os eventos mais próximos. Acesse a seção de{' '}
            <a href="/dashboard/aulas" style={{ color: '#d4a574' }}>
              Aulas
            </a>{' '}
            para conferir todo o conteúdo disponível.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
