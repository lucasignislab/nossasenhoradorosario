import Link from 'next/link';
import { ArrowRight, Bell, BookOpen, CalendarCheck, CalendarDays, CreditCard, Sparkles, UsersRound } from 'lucide-react';

const modules = [
  { title: 'Agenda interna', description: 'Giras, reuniões e compromissos da corrente.', icon: CalendarDays, status: 'Disponível', href: '/dashboard/agenda' },
  { title: 'Escala de cuidados', description: 'Organização das equipes e dias de cuidado da casa.', icon: UsersRound, status: 'Disponível', href: '/dashboard/faxinas' },
  { title: 'Minha frequência', description: 'Seu histórico de presença nas atividades da casa.', icon: CalendarCheck, status: 'Disponível', href: '/dashboard/frequencia' },
  { title: 'Mensalidades', description: 'Situação, pagamentos e comprovantes em um só lugar.', icon: CreditCard, status: 'Disponível', href: '/dashboard/financeiro' },
  { title: 'Estudos da casa', description: 'Materiais e conteúdos de desenvolvimento mediúnico.', icon: BookOpen, status: 'Disponível', href: '/dashboard/aulas' },
  { title: 'Avisos', description: 'Comunicados e orientações importantes para a corrente.', icon: Bell, status: 'Disponível', href: '/dashboard/avisos' },
];

export default function DashboardPage() {
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
          {modules.map(({ title, description, icon: Icon, status, href }) => {
            const content = (
              <>
                <div className="dashboard-home__module-icon"><Icon size={22} /></div>
                <p className="dashboard-home__module-status">{status}</p>
                <h3>{title}</h3>
                <p>{description}</p>
                {href && <span className="dashboard-home__module-link">Acessar serviço <ArrowRight size={15} /></span>}
              </>
            );

            return href ? (
              <Link className="dashboard-home__module" href={href} key={title}>{content}</Link>
            ) : (
              <article className="dashboard-home__module is-muted" key={title}>{content}</article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
