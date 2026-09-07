import Link from 'next/link';
import { ArrowRight, Bell, BookOpen, CalendarCheck, CalendarDays, CreditCard, Sparkles, UsersRound, WalletCards } from 'lucide-react';
import { MetricCard, PanelHeader, StatusPill } from '@/components/portal/PortalUI';
import { eventDateParts, formatEventDateLong, formatEventTime } from '@/lib/events';
import { formatRelativeDate, noticeCategoryLabel } from '@/lib/notices';
import type { Notice, PortalEvent } from '@/types';

const modules = [
  { title: 'Agenda interna', description: 'Giras, reuniões e compromissos da corrente.', icon: CalendarDays, status: 'Disponível', path: '/agenda' },
  { title: 'Escala de cuidados', description: 'Organização das equipes e dias de cuidado da casa.', icon: UsersRound, status: 'Disponível', path: '/faxinas' },
  { title: 'Minha frequência', description: 'Seu histórico de presença nas atividades da casa.', icon: CalendarCheck, status: 'Disponível', path: '/frequencia' },
  { title: 'Mensalidades', description: 'Situação, pagamentos e comprovantes em um só lugar.', icon: CreditCard, status: 'Disponível', path: '/financeiro' },
  { title: 'Estudos da casa', description: 'Materiais e conteúdos de desenvolvimento mediúnico.', icon: BookOpen, status: 'Disponível', path: '/aulas' },
  { title: 'Avisos', description: 'Comunicados e orientações importantes para a corrente.', icon: Bell, status: 'Disponível', path: '/avisos' },
];

export type MemberHomeSummary = {
  nextEvent: PortalEvent | null;
  nextEventConfirmed: boolean;
  notices: Notice[];
  nextChore: { shiftDate: string } | null;
  monthFeePaid: boolean;
};

export function MemberHome({ basePath = '/dashboard', summary }: { basePath?: string; summary?: MemberHomeSummary }) {
  const realSummary = summary ?? null;
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

      {realSummary ? (
        <section aria-label="Resumo da sua rotina">
          <div className="dashboard-home__section-heading">
            <div>
              <p className="dashboard-home__eyebrow">Hoje na casa</p>
              <h2>Seu resumo</h2>
            </div>
          </div>

          <div className="portal-metrics portal-metrics--compact" style={{ marginBottom: 24 }}>
            <MetricCard
              icon={CalendarDays}
              label="Próxima atividade"
              value={realSummary.nextEvent ? `${eventDateParts(realSummary.nextEvent.event_date).day} ${eventDateParts(realSummary.nextEvent.event_date).month}` : '—'}
              detail={realSummary.nextEvent
                ? `${realSummary.nextEvent.title} · ${formatEventTime(realSummary.nextEvent.event_time)}${realSummary.nextEventConfirmed ? ' · presença confirmada' : ''}`
                : 'Nenhuma atividade futura'}
              tone="brand"
            />
            <MetricCard
              icon={UsersRound}
              label="Próxima faxina"
              value={realSummary.nextChore ? `${eventDateParts(realSummary.nextChore.shiftDate).day} ${eventDateParts(realSummary.nextChore.shiftDate).month}` : '—'}
              detail={realSummary.nextChore ? 'Você está inscrito nesta data' : 'Escolha uma data e participe'}
              tone="gold"
            />
            <MetricCard
              icon={WalletCards}
              label="Mensalidade do mês"
              value={realSummary.monthFeePaid ? 'Em dia' : 'Pendente'}
              detail={realSummary.monthFeePaid ? 'Contribuição registrada' : 'Nenhum registro neste mês'}
              tone={realSummary.monthFeePaid ? 'info' : 'warning'}
            />
          </div>

          <article className="portal-panel" style={{ marginBottom: 32 }}>
            <PanelHeader eyebrow="Comunicados" title="Últimos avisos" action={<Link href={`${basePath}/avisos`} className="portal-text-link">Ver todos <ArrowRight size={14} /></Link>} />
            {realSummary.notices.length === 0 ? (
              <p className="portal-panel__copy">Nenhum aviso publicado no momento.</p>
            ) : (
              <div className="portal-person-list">
                {realSummary.notices.map((notice) => (
                  <div className="portal-person" key={notice.id}>
                    <span><Bell size={15} /></span>
                    <div>
                      <strong>{notice.title}</strong>
                      <small>{formatRelativeDate(notice.published_at)} · {noticeCategoryLabel(notice.category)}</small>
                    </div>
                    {notice.pinned ? <StatusPill tone="gold">Fixado</StatusPill> : null}
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      ) : null}

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
