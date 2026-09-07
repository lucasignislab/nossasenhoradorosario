import Link from 'next/link';
import {
  ArrowRight,
  BadgeDollarSign,
  BellRing,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Filter,
  Landmark,
  ListChecks,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserRoundCheck,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { MetricCard, PageHeader, PanelHeader, ProgressBar, StatusPill } from './PortalUI';
import { FinanceTrendChart } from './FinanceTrendChart';
import { ApprovalActions } from './MemberActions';
import { MembersTable } from './MembersTable';
import {
  formatJoinedAt,
  profileDisplayName,
  profileInitial,
  roleLabel,
} from '@/lib/members';
import { eventCategoryLabel, eventDateParts, formatEventTime, todayISODate } from '@/lib/events';
import { EventRowActions, NewEventButton } from './EventForm';
import type { PortalEvent, Profile } from '@/types';

const attendanceBars = [
  { month: 'Fev', value: 72 }, { month: 'Mar', value: 78 }, { month: 'Abr', value: 75 },
  { month: 'Mai', value: 84 }, { month: 'Jun', value: 81 }, { month: 'Jul', value: 87 },
];

type AdminOverviewProps = {
  basePath?: string;
  activeMembers?: number;
  pendingMembers?: number;
};

export function AdminOverview({ basePath = '/admin', activeMembers, pendingMembers }: AdminOverviewProps) {
  const activeMembersLabel = activeMembers ?? 42;
  const pendingMembersLabel = pendingMembers ?? 3;
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Visão geral · Julho de 2026"
        title="A casa em um só olhar"
        description="Acompanhe o que precisa de cuidado hoje, sem perder de vista o movimento do mês."
        action={<button className="portal-button portal-button--primary"><Plus size={16} /> Novo evento</button>}
      />

      <section className="portal-metrics" aria-label="Indicadores principais">
        <MetricCard icon={UsersRound} label="Filhos ativos" value={String(activeMembersLabel)} detail={`${pendingMembersLabel} cadastro${pendingMembersLabel === 1 ? '' : 's'} aguardando`} tone="brand" />
        <MetricCard icon={CalendarCheck} label="Próxima atividade" value="24 jul" detail="Estudo mediúnico · 20h" tone="gold" />
        <MetricCard icon={WalletCards} label="Recebido no mês" value="R$ 3.840" detail="86% do previsto" tone="info" />
        <MetricCard icon={UserRoundCheck} label="Frequência média" value="87%" detail="+6% em relação a junho" tone="neutral" />
      </section>

      <section className="portal-layout portal-layout--overview">
        <div className="portal-stack">
          <article className="portal-panel">
            <PanelHeader eyebrow="Próximos 7 dias" title="Agenda da casa" action={<Link href={`${basePath}/agenda`} className="portal-text-link">Ver agenda <ArrowRight size={14} /></Link>} />
            <div className="portal-event-list">
              {[
                ['24', 'QUI', 'Estudo mediúnico', '20:00', 'Desenvolvimento'],
                ['26', 'SÁB', 'Cuidado da casa', '09:00', 'Equipe Dourada'],
                ['28', 'SEG', 'Reunião da corrente', '19:30', 'Todos os filhos'],
              ].map(([day, week, title, time, group]) => (
                <div className="portal-event" key={`${day}-${title}`}>
                  <div className="portal-event__date"><strong>{day}</strong><span>{week}</span></div>
                  <div><h3>{title}</h3><p><Clock3 size={13} /> {time} · {group}</p></div>
                  <button aria-label={`Opções para ${title}`}><MoreHorizontal size={19} /></button>
                </div>
              ))}
            </div>
          </article>

          <article className="portal-panel">
            <PanelHeader eyebrow="Acompanhamento" title="Movimento da comunidade" />
            <div className="portal-split-metrics">
              <div><ProgressBar value={87} label="Frequência nas giras de desenvolvimento" /><ProgressBar value={79} label="Participação nos estudos" /><ProgressBar value={92} label="Escalas confirmadas" /></div>
              <div className="portal-note-card">
                <Sparkles size={22} />
                <p>O comparecimento cresceu nas últimas três atividades.</p>
                <span>Dados demonstrativos</span>
              </div>
            </div>
          </article>
        </div>

        <div className="portal-stack">
          <article className="portal-panel portal-panel--accent">
            <PanelHeader eyebrow="Atenção hoje" title={`${pendingMembersLabel} aprovaç${pendingMembersLabel === 1 ? 'ão pendente' : 'ões pendentes'}`} />
            <div className="portal-person-list">
              {['Marina de Souza', 'Rafael Santos', 'Clara Oliveira'].map((name, index) => (
                <div className="portal-person" key={name}>
                  <span>{name.charAt(0)}</span><div><strong>{name}</strong><small>Cadastro há {index + 1} dia{index ? 's' : ''}</small></div>
                  <button aria-label={`Revisar cadastro de ${name}`}><ArrowRight size={16} /></button>
                </div>
              ))}
            </div>
            <Link href={`${basePath}/membros`} className="portal-button portal-button--dark">Revisar cadastros</Link>
          </article>

          <article className="portal-panel">
            <PanelHeader eyebrow="Financeiro" title="Resumo de julho" />
            <dl className="portal-definition-list">
              <div><dt>Previsto</dt><dd>R$ 4.450</dd></div>
              <div><dt>Recebido</dt><dd>R$ 3.840</dd></div>
              <div><dt>Pendente</dt><dd>R$ 610</dd></div>
            </dl>
            <Link href={`${basePath}/financeiro`} className="portal-text-link">Abrir financeiro <ArrowRight size={14} /></Link>
          </article>

          <article className="portal-privacy-card">
            <ShieldCheck size={20} />
            <div><strong>Dados protegidos</strong><p>Frequência e finanças possuem acesso restrito e histórico de alterações.</p></div>
          </article>
        </div>
      </section>
    </div>
  );
}

export function FinanceDashboard() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Financeiro"
        title="Cuidado e transparência"
        description="Uma leitura clara das contribuições, despesas e necessidades da casa."
        action={<><button className="portal-button portal-button--secondary"><FileText size={16} /> Exportar</button><button className="portal-button portal-button--primary"><Plus size={16} /> Novo lançamento</button></>}
      />

      <section className="portal-metrics">
        <MetricCard icon={BadgeDollarSign} label="Previsto em julho" value="R$ 4.450" detail="Mensalidades e contribuições" tone="neutral" />
        <MetricCard icon={CircleDollarSign} label="Total recebido" value="R$ 3.840" detail="86% do valor previsto" tone="info" />
        <MetricCard icon={Clock3} label="A receber" value="R$ 610" detail="7 mensalidades pendentes" tone="warning" />
        <MetricCard icon={Landmark} label="Saldo do mês" value="R$ 1.275" detail="Após despesas registradas" tone="gold" />
      </section>

      <section className="portal-layout portal-layout--charts">
        <FinanceTrendChart />

        <article className="portal-panel">
          <PanelHeader eyebrow="Julho" title="Despesas por categoria" />
          <div className="portal-donut-wrap">
            <div className="portal-donut"><span><strong>R$ 2.565</strong><small>Total</small></span></div>
            <ul className="portal-legend-list">
              <li><i className="is-brand" /><span>Manutenção</span><strong>38%</strong></li>
              <li><i className="is-gold" /><span>Materiais</span><strong>27%</strong></li>
              <li><i className="is-info" /><span>Contas</span><strong>21%</strong></li>
              <li><i className="is-neutral" /><span>Outros</span><strong>14%</strong></li>
            </ul>
          </div>
        </article>
      </section>

      <article className="portal-panel">
        <PanelHeader eyebrow="Conciliação" title="Movimentações recentes" action={<button className="portal-filter"><Filter size={14} /> Filtrar</button>} />
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Forma</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              {[
                ['21 jul', 'Mensalidade · M. Souza', 'Contribuição', 'Pix', '+ R$ 90,00', 'Confirmado', 'info'],
                ['20 jul', 'Materiais de limpeza', 'Manutenção', 'Débito', '- R$ 186,40', 'Conciliado', 'neutral'],
                ['18 jul', 'Conta de energia', 'Contas', 'Pix', '- R$ 342,18', 'Conciliado', 'neutral'],
                ['17 jul', 'Mensalidade · R. Santos', 'Contribuição', 'Dinheiro', '+ R$ 90,00', 'Pendente', 'warning'],
              ].map(([date, desc, category, method, value, status, tone]) => (
                <tr key={`${date}-${desc}`}><td>{date}</td><td><strong>{desc}</strong></td><td>{category}</td><td>{method}</td><td className={value.startsWith('+') ? 'is-positive' : 'is-negative'}>{value}</td><td><StatusPill tone={tone as 'info' | 'neutral' | 'warning'}>{status}</StatusPill></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

export function AttendanceDashboard() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Frequência"
        title="Presença é vínculo"
        description="Acompanhe a participação com contexto, acolhimento e respeito ao caminho de cada filho."
        action={<button className="portal-button portal-button--primary"><ListChecks size={16} /> Registrar presença</button>}
      />

      <div className="portal-filter-bar">
        <label>Período<select><option>Julho de 2026</option><option>Junho de 2026</option></select></label>
        <label>Atividade<select><option>Todas as atividades</option><option>Desenvolvimento mediúnico</option><option>Estudos</option><option>Cuidados da casa</option></select></label>
        <label>Grupo<select><option>Toda a corrente</option><option>Desenvolvimento I</option><option>Desenvolvimento II</option></select></label>
      </div>

      <section className="portal-metrics">
        <MetricCard icon={UserCheck} label="Frequência geral" value="87%" detail="36 de 42 filhos ativos" tone="brand" />
        <MetricCard icon={CalendarCheck} label="Presenças no mês" value="184" detail="Em 6 atividades realizadas" tone="info" />
        <MetricCard icon={MessageSquareText} label="Ausências justificadas" value="12" detail="Todos os registros revisados" tone="neutral" />
        <MetricCard icon={TrendingUp} label="Evolução" value="+6%" detail="Comparado ao mês anterior" tone="gold" />
      </section>

      <section className="portal-layout portal-layout--charts">
        <article className="portal-panel">
          <PanelHeader eyebrow="Fevereiro a julho" title="Evolução da presença" />
          <div className="portal-line-bars" aria-label="Evolução demonstrativa da frequência">
            {attendanceBars.map(({ month, value }) => <div key={month}><strong>{value}%</strong><span><i style={{ height: `${value}%` }} /></span><small>{month}</small></div>)}
          </div>
        </article>
        <article className="portal-panel">
          <PanelHeader eyebrow="Por atividade" title="Participação da corrente" />
          <div className="portal-progress-list">
            <ProgressBar value={91} label="Giras de desenvolvimento" />
            <ProgressBar value={84} label="Estudos e aulas" />
            <ProgressBar value={88} label="Giras internas" />
            <ProgressBar value={76} label="Cuidados da casa" />
          </div>
        </article>
      </section>

      <article className="portal-panel">
        <PanelHeader eyebrow="Acompanhamento individual" title="Frequência dos filhos" action={<div className="portal-search"><Search size={15} /><input aria-label="Buscar filho" placeholder="Buscar por nome" /></div>} />
        <div className="portal-table-wrap">
          <table className="portal-table portal-table--attendance">
            <thead><tr><th>Filho da casa</th><th>Desenvolvimento</th><th>Estudos</th><th>Cuidados</th><th>Geral</th><th>Acompanhamento</th></tr></thead>
            <tbody>
              {[
                ['Marina de Souza', '6/6', '4/4', '2/2', '100%', 'Presença constante', 'info'],
                ['Rafael Santos', '5/6', '3/4', '2/2', '83%', 'Dentro do esperado', 'neutral'],
                ['Clara Oliveira', '4/6', '4/4', '1/2', '75%', '1 ausência justificada', 'warning'],
                ['João Pereira', '3/6', '2/4', '2/2', '58%', 'Conversar com cuidado', 'danger'],
              ].map(([name, dev, study, care, total, note, tone]) => (
                <tr key={name}><td><div className="portal-table-person"><span>{name.charAt(0)}</span><strong>{name}</strong></div></td><td>{dev}</td><td>{study}</td><td>{care}</td><td><strong>{total}</strong></td><td><StatusPill tone={tone as 'info' | 'neutral' | 'warning' | 'danger'}>{note}</StatusPill></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <p className="portal-sensitive-note"><ShieldCheck size={15} /> Informações de frequência são sensíveis e visíveis somente para pessoas autorizadas.</p>
    </div>
  );
}

type MemberCounts = { active: number; pending: number; suspended: number };

type MembersManagementProps = {
  pending?: Profile[];
  members?: Profile[];
  counts?: MemberCounts;
};

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewMembers: Profile[] = [
  { id: 'preview-1', full_name: 'Ana Martins', phone: '(11) 99991-0001', role: 'member', status: 'active', joined_at: '2021-03-10', created_at: '2021-03-10T00:00:00Z', updated_at: '2021-03-10T00:00:00Z' },
  { id: 'preview-2', full_name: 'Caio Almeida', phone: '(11) 99992-0002', role: 'member', status: 'active', joined_at: '2022-08-15', created_at: '2022-08-15T00:00:00Z', updated_at: '2022-08-15T00:00:00Z' },
  { id: 'preview-3', full_name: 'Helena Rocha', phone: '(11) 99993-0003', role: 'member', status: 'active', joined_at: '2024-01-20', created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z' },
  { id: 'preview-4', full_name: 'Pedro Lima', phone: '(11) 99994-0004', role: 'member', status: 'suspended', joined_at: '2025-05-05', created_at: '2025-05-05T00:00:00Z', updated_at: '2025-05-05T00:00:00Z' },
];

const previewPending: Profile[] = [
  { id: 'preview-p1', full_name: 'Marina de Souza', phone: '(11) 99990-0000', role: 'member', status: 'pending', joined_at: null, created_at: '2026-07-21T00:00:00Z', updated_at: '2026-07-21T00:00:00Z' },
  { id: 'preview-p2', full_name: 'Rafael Santos', phone: '(11) 99991-0001', role: 'member', status: 'pending', joined_at: null, created_at: '2026-07-20T00:00:00Z', updated_at: '2026-07-20T00:00:00Z' },
  { id: 'preview-p3', full_name: 'Clara Oliveira', phone: '(11) 99992-0002', role: 'member', status: 'pending', joined_at: null, created_at: '2026-07-19T00:00:00Z', updated_at: '2026-07-19T00:00:00Z' },
];

export function MembersManagement({ pending, members, counts }: MembersManagementProps) {
  const pendingList = pending ?? previewPending;
  const memberList = members ?? [...previewMembers, ...previewPending];
  const resolvedCounts: MemberCounts = counts ?? {
    active: memberList.filter((member) => member.status === 'active').length,
    pending: pendingList.length,
    suspended: memberList.filter((member) => member.status === 'suspended').length,
  };
  const adminNames = memberList
    .filter((member) => member.role === 'admin' || member.role === 'developer')
    .map((member) => profileDisplayName(member));

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Pessoas" title="Filhos da casa" description="Cadastros, vínculos, funções e acessos organizados com cuidado." action={<button className="portal-button portal-button--primary"><Plus size={16} /> Convidar pessoa</button>} />
      <section className="portal-metrics portal-metrics--compact">
        <MetricCard icon={UsersRound} label="Ativos" value={String(resolvedCounts.active)} detail="Corrente atual" tone="brand" />
        <MetricCard icon={Clock3} label="Aguardando" value={String(resolvedCounts.pending)} detail="Revisar cadastros" tone="warning" />
        <MetricCard icon={UserRoundCheck} label="Administração" value={String(adminNames.length)} detail={adminNames.join(' e ') || '—'} tone="gold" />
      </section>

      <article className="portal-panel portal-panel--pending">
        <PanelHeader eyebrow="Precisam de atenção" title="Cadastros aguardando aprovação" />
        {pendingList.length === 0 ? (
          <p className="portal-panel__copy">Nenhum cadastro aguardando aprovação.</p>
        ) : (
          <div className="portal-approval-grid">
            {pendingList.map((member) => (
              <article className="portal-approval-card" key={member.id}>
                <div className="portal-approval-card__top">
                  <span>{profileInitial(member)}</span>
                  <div>
                    <h3>{profileDisplayName(member)}</h3>
                    <p>Recebido em {formatJoinedAt(member.created_at)}</p>
                  </div>
                </div>
                <dl>
                  <div><dt>WhatsApp</dt><dd>{member.phone?.trim() || '—'}</dd></div>
                  <div><dt>Solicitação</dt><dd>{roleLabel(member.role)}</dd></div>
                </dl>
                <ApprovalActions profileId={member.id} />
              </article>
            ))}
          </div>
        )}
      </article>

      <article className="portal-panel">
        <PanelHeader eyebrow="Comunidade" title="Todos os filhos" />
        <MembersTable members={memberList} />
      </article>
    </div>
  );
}

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewEvents: PortalEvent[] = [
  { id: 'preview-e1', title: 'Estudo mediúnico', entity: 'Desenvolvimento', description: null, details: null, category: 'curso', event_date: '2026-07-24', event_time: '20:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-e2', title: 'Cuidado da casa', entity: 'Equipe Dourada', description: null, details: null, category: 'acao-social', event_date: '2026-07-26', event_time: '09:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-e3', title: 'Gira de Baianos', entity: 'Baianos', description: null, details: null, category: 'gira', event_date: '2026-07-28', event_time: '19:30:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-e4', title: 'Gira interna', entity: 'Corrente completa', description: null, details: null, category: 'gira', event_date: '2026-08-02', event_time: '19:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'cancelada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
];

export function AgendaManagement({ events }: { events?: PortalEvent[] }) {
  const eventList = events ?? previewEvents;
  const upcoming = eventList.filter((event) => event.event_date >= todayISODate());
  const canceled = eventList.filter((event) => event.status === 'cancelada');

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Agenda" title="Agenda e giras" description="Organize atividades, responsáveis, confirmações e comunicados em um só fluxo." action={<NewEventButton />} />
      <div className="portal-calendar-strip"><button className="is-active">Julho 2026</button><button>Agosto</button><button>Setembro</button><span /><button className="portal-filter"><Filter size={14} /> Filtros</button></div>
      <section className="portal-agenda-layout">
        <article className="portal-panel">
          <PanelHeader eyebrow="Atividades cadastradas" title="Linha do tempo" />
          {eventList.length === 0 ? (
            <p className="portal-panel__copy">Nenhum evento cadastrado. Crie a primeira atividade da casa.</p>
          ) : (
            <div className="portal-timeline">
              {eventList.map((event) => {
                const parts = eventDateParts(event.event_date);
                return (
                  <div className={`portal-timeline__item${event.status === 'cancelada' ? ' is-canceled' : ''}`} key={event.id}>
                    <div className="portal-timeline__date"><strong>{parts.day}</strong><span>{parts.month}</span></div>
                    <i />
                    <div>
                      <span className="portal-timeline__type">{eventCategoryLabel(event.category)}{event.entity ? ` · ${event.entity}` : ''}</span>
                      <h3>{event.title}</h3>
                      <p><Clock3 size={13} /> {formatEventTime(event.event_time)} · {event.location}</p>
                    </div>
                    <StatusPill tone={event.status === 'cancelada' ? 'danger' : 'neutral'}>{event.status === 'cancelada' ? 'Cancelada' : 'Confirmada'}</StatusPill>
                    <EventRowActions event={event} />
                  </div>
                );
              })}
            </div>
          )}
        </article>
        <div className="portal-stack">
          <article className="portal-panel"><PanelHeader eyebrow="Resumo" title="Agenda" /><dl className="portal-definition-list"><div><dt>Atividades futuras</dt><dd>{upcoming.length}</dd></div><div><dt>Confirmadas</dt><dd>{eventList.filter((event) => event.status === 'confirmada').length}</dd></div><div><dt>Canceladas</dt><dd>{canceled.length}</dd></div></dl></article>
          <article className="portal-note-card portal-note-card--light"><BellRing size={22} /><p>Eventos confirmados aparecem automaticamente na Home e na agenda pública.</p><span>Publicação automática</span></article>
        </div>
      </section>
    </div>
  );
}

export function ContentManagement() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Conteúdos" title="Estudos e comunicados" description="Materiais da casa organizados para chegar às pessoas certas, no momento certo." action={<button className="portal-button portal-button--primary"><Plus size={16} /> Novo conteúdo</button>} />
      <section className="portal-content-categories">
        {[['Estudos mediúnicos', '12 materiais', BookOpen], ['Documentos da casa', '8 arquivos', FileText], ['Comunicados', '5 publicados', BellRing]].map(([title, count, Icon]) => { const ContentIcon = Icon as typeof BookOpen; return <article key={String(title)}><ContentIcon size={21} /><div><h2>{String(title)}</h2><p>{String(count)}</p></div><ArrowRight size={17} /></article>; })}
      </section>
      <article className="portal-panel"><PanelHeader eyebrow="Publicados recentemente" title="Biblioteca da casa" action={<div className="portal-search"><Search size={15} /><input aria-label="Buscar conteúdo" placeholder="Buscar conteúdo" /></div>} /><div className="portal-library-list">
        {[
          ['Fundamentos da mediunidade', 'Estudo mediúnico', 'Vídeo · 42 min', 'Todos os filhos'],
          ['Orientações para a corrente', 'Documento da casa', 'PDF · 8 páginas', 'Todos os filhos'],
          ['Escala de agosto', 'Comunicado', 'Publicado hoje', 'Equipe de cuidados'],
          ['Ervas de proteção', 'Material de apoio', 'PDF · 12 páginas', 'Desenvolvimento II'],
        ].map(([title, type, meta, audience]) => <div className="portal-library-item" key={title}><div className="portal-library-item__icon"><FileText size={19} /></div><div><span>{type}</span><h3>{title}</h3><p>{meta}</p></div><StatusPill>{audience}</StatusPill><button className="portal-icon-button" aria-label={`Opções para ${title}`}><MoreHorizontal size={18} /></button></div>)}
      </div></article>
    </div>
  );
}

export function AdminSettings() {
  const roles = [
    ['Iyás administradoras', 'Gestão completa da casa', '2 pessoas', 'Administração'],
    ['Filhos da casa', 'Acesso somente aos próprios dados', '42 pessoas', 'Membro'],
    ['Acesso técnico', 'Configuração sem dados sensíveis por padrão', '1 pessoa', 'Técnico'],
  ];
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Configurações" title="Permissões e segurança" description="Defina quem pode ver, criar e alterar cada parte do sistema." />
      <section className="portal-layout portal-layout--settings">
        <article className="portal-panel"><PanelHeader eyebrow="Papéis do sistema" title="Níveis de acesso" /><div className="portal-role-list">{roles.map(([title, desc, people, badge]) => <div key={title}><div className="portal-role-list__icon"><ShieldCheck size={19} /></div><div><h3>{title}</h3><p>{desc}</p></div><span>{people}</span><StatusPill tone={badge === 'Administração' ? 'gold' : 'neutral'}>{badge}</StatusPill><button className="portal-icon-button" aria-label={`Editar ${title}`}><Settings2 size={17} /></button></div>)}</div></article>
        <div className="portal-stack"><article className="portal-panel portal-panel--accent"><PanelHeader eyebrow="Proteção" title="Boas práticas ativas" /><ul className="portal-check-list"><li><CheckCircle2 size={17} /> Regras por perfil</li><li><CheckCircle2 size={17} /> Dados sensíveis restritos</li><li><CheckCircle2 size={17} /> Sessões protegidas</li><li><Clock3 size={17} /> Auditoria detalhada na próxima etapa</li></ul></article><article className="portal-panel"><PanelHeader eyebrow="Sessão" title="Políticas de acesso" /><p className="portal-panel__copy">Contas suspensas perdem acesso imediatamente. Alterações de papel exigirão confirmação administrativa.</p></article></div>
      </section>
    </div>
  );
}
