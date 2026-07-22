import Link from 'next/link';
import { ArrowRight, Bell, BookOpen, CalendarCheck, CalendarDays, CreditCard, Sparkles, UsersRound } from 'lucide-react';

const modules = [
  { title: 'Agenda interna', description: 'Giras, reuniões e compromissos da corrente.', icon: CalendarDays, status: 'Disponível', path: '/agenda' },
  { title: 'Escala de cuidados', description: 'Organização das equipes e dias de cuidado da casa.', icon: UsersRound, status: 'Disponível', path: '/faxinas' },
  { title: 'Minha frequência', description: 'Seu histórico de presença nas atividades da casa.', icon: CalendarCheck, status: 'Disponível', path: '/frequencia' },
  { title: 'Mensalidades', description: 'Situação, pagamentos e comprovantes em um só lugar.', icon: CreditCard, status: 'Disponível', path: '/financeiro' },
  { title: 'Estudos da casa', description: 'Materiais e conteúdos de desenvolvimento mediúnico.', icon: BookOpen, status: 'Disponível', path: '/aulas' },
  { title: 'Avisos', description: 'Comunicados e orientações importantes para a corrente.', icon: Bell, status: 'Disponível', path: '/avisos' },
];

export function MemberHome({ basePath = '/dashboard' }: { basePath?: string }) {
  return (
    <div className="dashboard-home">
      <header className="dashboard-home__welcome">
        <div>
          <p className="dashboard-home__eyebrow"><Sparkles size={14} /> Nossa comunidade</p>
          <h1>Axé, seja bem-vindo à sua área.</h1>
          <p>Este será o seu ponto de encontro com a rotina, os cuidados e os aprendizados da casa.</p>
        </div>
        <div className="dashboard-home__seal" aria-hidden="true">SR</div>
      </header>

      <section aria-labelledby="modules-title">
        <div className="dashboard-home__section-heading">
          <div>
            <p className="dashboard-home__eyebrow">Rotina da comunidade</p>
            <h2 id="modules-title">Serviços da casa</h2>
          </div>
          <span>6 serviços disponíveis</span>
        </div>

        <div className="dashboard-home__grid">
          {modules.map(({ title, description, icon: Icon, status, path }) => {
            const href = `${basePath}${path}`;
            const content = (
              <>
                <div className="dashboard-home__module-icon"><Icon size={22} /></div>
                <p className="dashboard-home__module-status">{status}</p>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="dashboard-home__module-link">Acessar serviço <ArrowRight size={15} /></span>
              </>
            );

            return <Link className="dashboard-home__module" href={href} key={title}>{content}</Link>;
          })}
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return <MemberHome />;
}
