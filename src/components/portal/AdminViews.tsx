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
  Pin,
  Play,
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
import { eventCategoryLabel, eventDateParts, formatEventDateLong, formatEventTime, todayISODate } from '@/lib/events';
import { EventRowActions, NewEventButton } from './EventForm';
import { ContentRowActions, NewContentButton } from './ContentForm';
import { NewNoticeButton, NoticeRowActions } from './NoticeForm';
import { RemoveShiftSignupButton, SaturdayShiftEditor } from './CleaningShiftControls';
import { CLEANING_SHIFT_MAX, CLEANING_SHIFT_MIN, cleaningKindLabel, cleaningShiftStatus } from '@/lib/cleaning';
import { contentKindLabel, formatDuration, formatRelativeDate, noticeCategoryLabel } from '@/lib/notices';
import {
  FinanceEntryRowActions,
  FinanceExportButton,
  NewFinanceEntryButton,
} from './FinanceEntryForm';
import {
  buildMonthlySeries,
  currentMonthRange,
  expenseByCategory,
  financeCategoryLabel,
  formatBRL,
  formatEntryAmount,
  formatFinanceDate,
  summarizeMonth,
} from '@/lib/finance';
import type { Attendance, CleaningShiftDate, CleaningShiftSignup, FinanceEntry, Notice, PortalEvent, Profile, StudyContent } from '@/types';
import { AttendanceSheet } from './AttendanceSheet';

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewAttendanceMembers: Profile[] = [
  { id: 'preview-a1', full_name: 'Marina de Souza', phone: null, role: 'member', status: 'active', joined_at: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'preview-a2', full_name: 'Rafael Santos', phone: null, role: 'member', status: 'active', joined_at: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'preview-a3', full_name: 'Clara Oliveira', phone: null, role: 'member', status: 'active', joined_at: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 'preview-a4', full_name: 'João Pereira', phone: null, role: 'member', status: 'active', joined_at: null, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
];

const previewAttendanceEvents: PortalEvent[] = [
  { id: 'preview-ae1', title: 'Gira de Caboclos', entity: 'Caboclos', description: null, details: null, category: 'gira', event_date: '2026-07-10', event_time: '19:30:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-ae2', title: 'Estudo mediúnico', entity: 'Desenvolvimento', description: null, details: null, category: 'curso', event_date: '2026-07-17', event_time: '20:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-ae3', title: 'Gira de Pretos Velhos', entity: 'Pretos Velhos', description: null, details: null, category: 'gira', event_date: '2026-07-24', event_time: '19:30:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
];

const previewAttendanceRows: Attendance[] = [
  { id: 'pa1', event_id: 'preview-ae1', profile_id: 'preview-a1', present: true, justified: false, notes: null, marked_by: null, created_at: '2026-07-10T00:00:00Z', updated_at: '2026-07-10T00:00:00Z' },
  { id: 'pa2', event_id: 'preview-ae1', profile_id: 'preview-a2', present: true, justified: false, notes: null, marked_by: null, created_at: '2026-07-10T00:00:00Z', updated_at: '2026-07-10T00:00:00Z' },
  { id: 'pa3', event_id: 'preview-ae1', profile_id: 'preview-a3', present: true, justified: false, notes: null, marked_by: null, created_at: '2026-07-10T00:00:00Z', updated_at: '2026-07-10T00:00:00Z' },
  { id: 'pa4', event_id: 'preview-ae1', profile_id: 'preview-a4', present: false, justified: true, notes: null, marked_by: null, created_at: '2026-07-10T00:00:00Z', updated_at: '2026-07-10T00:00:00Z' },
  { id: 'pa5', event_id: 'preview-ae2', profile_id: 'preview-a1', present: true, justified: false, notes: null, marked_by: null, created_at: '2026-07-17T00:00:00Z', updated_at: '2026-07-17T00:00:00Z' },
  { id: 'pa6', event_id: 'preview-ae2', profile_id: 'preview-a2', present: false, justified: false, notes: null, marked_by: null, created_at: '2026-07-17T00:00:00Z', updated_at: '2026-07-17T00:00:00Z' },
  { id: 'pa7', event_id: 'preview-ae2', profile_id: 'preview-a3', present: true, justified: false, notes: null, marked_by: null, created_at: '2026-07-17T00:00:00Z', updated_at: '2026-07-17T00:00:00Z' },
  { id: 'pa8', event_id: 'preview-ae2', profile_id: 'preview-a4', present: false, justified: false, notes: null, marked_by: null, created_at: '2026-07-17T00:00:00Z', updated_at: '2026-07-17T00:00:00Z' },
];

type AdminOverviewProps = {
  basePath?: string;
  activeMembers?: number;
  pendingMembers?: number;
  upcomingEvents?: PortalEvent[];
  pendingProfiles?: Profile[];
  pinnedNotices?: Notice[];
  financeSummary?: { income: number; expense: number; balance: number };
  /** false para o papel editor (comunicação): esconde painéis sensíveis. */
  canSeeSensitive?: boolean;
};

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewOverviewEvents: PortalEvent[] = [
  { id: 'preview-o1', title: 'Estudo mediúnico', entity: 'Desenvolvimento', description: null, details: null, category: 'curso', event_date: '2026-07-24', event_time: '20:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-o2', title: 'Gira de Baianos', entity: 'Baianos', description: null, details: null, category: 'gira', event_date: '2026-07-28', event_time: '19:30:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
];

const previewOverviewPending: Profile[] = [
  { id: 'preview-op1', full_name: 'Marina de Souza', phone: null, role: 'member', status: 'pending', joined_at: null, created_at: '2026-07-21T00:00:00Z', updated_at: '2026-07-21T00:00:00Z' },
  { id: 'preview-op2', full_name: 'Rafael Santos', phone: null, role: 'member', status: 'pending', joined_at: null, created_at: '2026-07-20T00:00:00Z', updated_at: '2026-07-20T00:00:00Z' },
];

export function AdminOverview({ basePath = '/admin', activeMembers, pendingMembers, upcomingEvents, pendingProfiles, pinnedNotices, financeSummary, canSeeSensitive = true }: AdminOverviewProps) {
  const activeMembersLabel = activeMembers ?? 42;
  const pendingMembersLabel = pendingMembers ?? previewOverviewPending.length;
  const eventList = upcomingEvents ?? previewOverviewEvents;
  const pendingList = pendingProfiles ?? previewOverviewPending;
  const pinnedList = pinnedNotices ?? previewNotices.filter((notice) => notice.pinned);
  const finance = financeSummary ?? { income: 384000, expense: 256500, balance: 127500 };
  const nextEvent = eventList[0] ?? null;
  const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long' });
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
        <MetricCard icon={CalendarCheck} label="Próxima atividade" value={nextEvent ? `${eventDateParts(nextEvent.event_date).day} ${eventDateParts(nextEvent.event_date).month.toLowerCase()}` : '—'} detail={nextEvent ? `${nextEvent.title} · ${formatEventTime(nextEvent.event_time)}` : 'Nenhuma atividade futura'} tone="gold" />
        <MetricCard icon={WalletCards} label={`Recebido em ${currentMonthName}`} value={formatBRL(finance.income)} detail={`Saldo ${formatBRL(finance.balance)}`} tone="info" />
        <MetricCard icon={UserRoundCheck} label="Avisos e escalas" value="Portal" detail="Gestão completa no menu lateral" tone="neutral" />
      </section>

      <section className="portal-layout portal-layout--overview">
        <div className="portal-stack">
          <article className="portal-panel">
            <PanelHeader eyebrow="Próximas atividades" title="Agenda da casa" action={<Link href={`${basePath}/agenda`} className="portal-text-link">Ver agenda <ArrowRight size={14} /></Link>} />
            {eventList.length === 0 ? (
              <p className="portal-panel__copy">Nenhuma atividade futura cadastrada.</p>
            ) : (
              <div className="portal-event-list">
                {eventList.map((event) => {
                  const parts = eventDateParts(event.event_date);
                  return (
                    <div className="portal-event" key={event.id}>
                      <div className="portal-event__date"><strong>{parts.day}</strong><span>{parts.weekday}</span></div>
                      <div><h3>{event.title}</h3><p><Clock3 size={13} /> {formatEventTime(event.event_time)} · {event.entity ?? eventCategoryLabel(event.category)}</p></div>
                      <Link href={`${basePath}/agenda`} aria-label={`Abrir agenda para ${event.title}`}><ArrowRight size={19} /></Link>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          <article className="portal-panel">
            <PanelHeader eyebrow="Comunicados" title="Avisos fixados" action={<Link href={`${basePath}/avisos`} className="portal-text-link">Ver avisos <ArrowRight size={14} /></Link>} />
            {pinnedList.length === 0 ? (
              <p className="portal-panel__copy">Nenhum aviso fixado no momento.</p>
            ) : (
              <div className="portal-person-list">
                {pinnedList.map((notice) => (
                  <div className="portal-person" key={notice.id}>
                    <span><BellRing size={15} /></span>
                    <div><strong>{notice.title}</strong><small>{formatRelativeDate(notice.published_at)}</small></div>
                    <Link href={`${basePath}/avisos`} aria-label={`Abrir aviso ${notice.title}`}><ArrowRight size={16} /></Link>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <div className="portal-stack">
          {canSeeSensitive ? (
            <article className="portal-panel portal-panel--accent">
              <PanelHeader eyebrow="Atenção hoje" title={`${pendingMembersLabel} aprovaç${pendingMembersLabel === 1 ? 'ão pendente' : 'ões pendentes'}`} />
              {pendingList.length === 0 ? (
                <p className="portal-panel__copy">Nenhum cadastro aguardando aprovação.</p>
              ) : (
                <div className="portal-person-list">
                  {pendingList.map((profile) => (
                    <div className="portal-person" key={profile.id}>
                      <span>{profileInitial(profile)}</span>
                      <div><strong>{profileDisplayName(profile)}</strong><small>Recebido em {formatJoinedAt(profile.created_at)}</small></div>
                      <Link href={`${basePath}/membros`} aria-label={`Revisar cadastro de ${profileDisplayName(profile)}`}><ArrowRight size={16} /></Link>
                    </div>
                  ))}
                </div>
              )}
              <Link href={`${basePath}/membros`} className="portal-button portal-button--dark">Revisar cadastros</Link>
            </article>
          ) : null}

          {canSeeSensitive ? (
            <article className="portal-panel">
              <PanelHeader eyebrow="Financeiro" title={`Resumo de ${currentMonthName}`} />
              <dl className="portal-definition-list">
                <div><dt>Entradas</dt><dd>{formatBRL(finance.income)}</dd></div>
                <div><dt>Saídas</dt><dd>{formatBRL(finance.expense)}</dd></div>
                <div><dt>Saldo do mês</dt><dd>{formatBRL(finance.balance)}</dd></div>
              </dl>
              <Link href={`${basePath}/financeiro`} className="portal-text-link">Abrir financeiro <ArrowRight size={14} /></Link>
            </article>
          ) : (
            <article className="portal-panel">
              <PanelHeader eyebrow="Seu acesso" title="Comunicação da casa" />
              <p className="portal-panel__copy">Seu perfil administra agenda, avisos e conteúdos. Áreas de pessoas, frequência e finanças ficam com a administração.</p>
            </article>
          )}

          <article className="portal-privacy-card">
            <ShieldCheck size={20} />
            <div><strong>Dados protegidos</strong><p>Frequência e finanças possuem acesso restrito e histórico de alterações.</p></div>
          </article>
        </div>
      </section>
    </div>
  );
}

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewFinanceEntries: FinanceEntry[] = [
  { id: 'preview-f1', type: 'entrada', category: 'mensalidade', description: 'Mensalidade · Marina Souza', amount_cents: 9000, entry_date: '2026-07-21', status: 'pago', receipt_path: null, profile_id: null, created_by: null, created_at: '2026-07-21T00:00:00Z', updated_at: '2026-07-21T00:00:00Z' },
  { id: 'preview-f2', type: 'saida', category: 'material', description: 'Materiais de limpeza', amount_cents: 18640, entry_date: '2026-07-20', status: 'pago', receipt_path: null, profile_id: null, created_by: null, created_at: '2026-07-20T00:00:00Z', updated_at: '2026-07-20T00:00:00Z' },
  { id: 'preview-f3', type: 'saida', category: 'energia', description: 'Conta de energia', amount_cents: 34218, entry_date: '2026-07-18', status: 'pago', receipt_path: null, profile_id: null, created_by: null, created_at: '2026-07-18T00:00:00Z', updated_at: '2026-07-18T00:00:00Z' },
  { id: 'preview-f4', type: 'entrada', category: 'mensalidade', description: 'Mensalidade · Rafael Santos', amount_cents: 9000, entry_date: '2026-07-17', status: 'pago', receipt_path: null, profile_id: null, created_by: null, created_at: '2026-07-17T00:00:00Z', updated_at: '2026-07-17T00:00:00Z' },
];

type FinanceDashboardProps = {
  entries?: FinanceEntry[];
  members?: Profile[];
};

export function FinanceDashboard({ entries, members = [] }: FinanceDashboardProps) {
  const entryList = entries ?? previewFinanceEntries;
  const { start, end } = currentMonthRange();
  const summary = summarizeMonth(entryList, start, end);
  const trend = buildMonthlySeries(entryList, 6);
  const donutSlices = expenseByCategory(summary.entries).slice(0, 4);
  const donutTones = ['is-brand', 'is-gold', 'is-info', 'is-neutral'];
  const namesById = new Map(members.map((member) => [member.id, profileDisplayName(member)]));
  const pendingCount = entryList.filter((entry) => entry.status === 'pendente').length;
  const recentEntries = [...entryList]
    .sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1))
    .slice(0, 12);
  const expenseTotalFormatted = formatBRL(summary.expense);
  const monthName = new Date().toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Financeiro"
        title="Cuidado e transparência"
        description="Uma leitura clara das contribuições, despesas e necessidades da casa."
        action={<><FinanceExportButton entries={entryList} /><NewFinanceEntryButton members={members} /></>}
      />

      <section className="portal-metrics">
        <MetricCard icon={BadgeDollarSign} label={`Recebido em ${monthName}`} value={formatBRL(summary.income)} detail="Entradas confirmadas no mês" tone="info" />
        <MetricCard icon={CircleDollarSign} label={`Saídas em ${monthName}`} value={expenseTotalFormatted} detail="Despesas registradas no mês" tone="neutral" />
        <MetricCard icon={Clock3} label="Mensalidades no mês" value={formatBRL(summary.mensalidades)} detail="Contribuições dos filhos" tone="warning" />
        <MetricCard icon={Landmark} label="Saldo do mês" value={formatBRL(summary.balance)} detail="Entradas menos saídas" tone="gold" />
      </section>

      <section className="portal-layout portal-layout--charts">
        <FinanceTrendChart data={trend} />

        <article className="portal-panel">
          <PanelHeader eyebrow={monthName} title="Despesas por categoria" />
          <div className="portal-donut-wrap">
            <div className="portal-donut"><span><strong>{expenseTotalFormatted}</strong><small>Total</small></span></div>
            {donutSlices.length === 0 ? (
              <p className="portal-panel__copy">Nenhuma despesa registrada neste mês.</p>
            ) : (
              <ul className="portal-legend-list">
                {donutSlices.map((slice, index) => (
                  <li key={slice.label}>
                    <i className={donutTones[index % donutTones.length]} />
                    <span>{slice.label}</span>
                    <strong>{slice.percent}%</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </section>

      <article className="portal-panel">
        <PanelHeader eyebrow="Conciliação" title="Movimentações recentes" />
        {pendingCount > 0 ? (
          <p className="portal-panel__copy" role="status">
            <strong>{pendingCount} {pendingCount === 1 ? 'mensalidade aguarda' : 'mensalidades aguardam'} comprovante</strong> — entram nos totais quando ficam pagas.
          </p>
        ) : null}
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead><tr><th>Data</th><th>Descrição</th><th>Filho</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Ações</th></tr></thead>
            <tbody>
              {recentEntries.length === 0 ? (
                <tr><td colSpan={7}>Nenhum lançamento registrado.</td></tr>
              ) : (
                recentEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{formatFinanceDate(entry.entry_date)}</td>
                    <td><strong>{entry.description}</strong></td>
                    <td>{entry.profile_id ? (namesById.get(entry.profile_id) ?? '—') : '—'}</td>
                    <td>{financeCategoryLabel(entry.category)}</td>
                    <td>
                      <StatusPill tone={entry.status === 'pendente' ? 'warning' : entry.type === 'entrada' ? 'info' : 'neutral'}>
                        {entry.status === 'pendente' ? 'Pendente' : entry.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </StatusPill>
                    </td>
                    <td className={entry.type === 'entrada' ? 'is-positive' : 'is-negative'}>{formatEntryAmount(entry)}</td>
                    <td><FinanceEntryRowActions entry={entry} members={members} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

type AttendanceDashboardProps = {
  events?: PortalEvent[];
  members?: Profile[];
  attendance?: Attendance[];
};

function attendanceTone(percent: number): { label: string; tone: 'info' | 'neutral' | 'warning' | 'danger' } {
  if (percent >= 85) return { label: 'Presença constante', tone: 'info' };
  if (percent >= 65) return { label: 'Dentro do esperado', tone: 'neutral' };
  if (percent >= 45) return { label: 'Conversar com cuidado', tone: 'warning' };
  return { label: 'Atenção necessária', tone: 'danger' };
}

export function AttendanceDashboard({ events, members, attendance }: AttendanceDashboardProps) {
  const eventList = events ?? previewAttendanceEvents;
  const memberList = members ?? previewAttendanceMembers;
  const attendanceList = attendance ?? previewAttendanceRows;
  const hasRealData = events !== undefined;

  const eventsById = new Map(eventList.map((event) => [event.id, event]));

  // Últimas 6 atividades com chamada registrada (mais antiga primeiro).
  const eventsWithMarks = [...new Set(attendanceList.map((row) => row.event_id))]
    .map((eventId) => eventsById.get(eventId))
    .filter((event): event is PortalEvent => Boolean(event))
    .sort((a, b) => (a.event_date < b.event_date ? -1 : 1));
  const bars = eventsWithMarks.slice(-6).map((event) => {
    const rows = attendanceList.filter((row) => row.event_id === event.id);
    const present = rows.filter((row) => row.present).length;
    const percent = rows.length > 0 ? Math.round((present / rows.length) * 100) : 0;
    return { id: event.id, title: event.title, date: event.event_date, percent, present, total: rows.length };
  });

  const totalMarks = attendanceList.length;
  const totalPresent = attendanceList.filter((row) => row.present).length;
  const totalJustified = attendanceList.filter((row) => !row.present && row.justified).length;
  const overallPercent = totalMarks > 0 ? Math.round((totalPresent / totalMarks) * 100) : 0;

  const { start: monthStart, end: monthEnd } = currentMonthRange();
  const monthEventIds = new Set(
    eventList.filter((event) => event.event_date >= monthStart && event.event_date <= monthEnd).map((event) => event.id),
  );
  const monthPresences = attendanceList.filter((row) => row.present && monthEventIds.has(row.event_id)).length;
  const monthEventsWithMarks = eventsWithMarks.filter((event) => event.event_date >= monthStart && event.event_date <= monthEnd).length;

  const memberRows = memberList.map((member) => {
    const rows = attendanceList.filter((row) => row.profile_id === member.id);
    const present = rows.filter((row) => row.present).length;
    const percent = rows.length > 0 ? Math.round((present / rows.length) * 100) : 0;
    return { member, present, total: rows.length, percent, ...attendanceTone(percent) };
  }).sort((a, b) => b.percent - a.percent || b.total - a.total);

  const sheetExisting: Record<string, Record<string, { present: boolean; justified: boolean }>> = {};
  for (const row of attendanceList) {
    sheetExisting[row.event_id] ??= {};
    sheetExisting[row.event_id][row.profile_id] = { present: row.present, justified: row.justified };
  }
  const sheetEvents = [...eventList].sort((a, b) => (a.event_date < b.event_date ? 1 : -1));

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Frequência"
        title="Presença é vínculo"
        description="Acompanhe a participação com contexto, acolhimento e respeito ao caminho de cada filho."
      />

      <section className="portal-metrics">
        <MetricCard icon={UserCheck} label="Frequência geral" value={`${overallPercent}%`} detail={`${totalPresent} presenças em ${totalMarks} registros`} tone="brand" />
        <MetricCard icon={CalendarCheck} label="Presenças no mês" value={String(monthPresences)} detail={`Em ${monthEventsWithMarks} ${monthEventsWithMarks === 1 ? 'atividade realizada' : 'atividades realizadas'}`} tone="info" />
        <MetricCard icon={MessageSquareText} label="Ausências justificadas" value={String(totalJustified)} detail="Registros acolhidos pela casa" tone="neutral" />
        <MetricCard icon={TrendingUp} label="Atividades com chamada" value={String(eventsWithMarks.length)} detail="Histórico completo" tone="gold" />
      </section>

      <article className="portal-panel">
        <PanelHeader eyebrow="Chamada" title="Registrar presença" />
        <AttendanceSheet events={sheetEvents} members={memberList} existing={sheetExisting} />
      </article>

      <section className="portal-layout portal-layout--charts">
        <article className="portal-panel">
          <PanelHeader eyebrow="Últimas atividades" title="Presença por atividade" />
          {bars.length === 0 ? (
            <p className="portal-panel__copy">Nenhuma chamada registrada ainda.</p>
          ) : (
            <div className="portal-line-bars" aria-label="Presença por atividade">
              {bars.map((bar) => (
                <div key={bar.id} title={`${bar.title} · ${bar.present}/${bar.total} presentes`}>
                  <strong>{bar.percent}%</strong>
                  <span><i style={{ height: `${bar.percent}%` }} /></span>
                  <small>{eventDateParts(bar.date).day}/{eventDateParts(bar.date).month}</small>
                </div>
              ))}
            </div>
          )}
        </article>
        <article className="portal-panel">
          <PanelHeader eyebrow="Acompanhamento" title="Como ler estes números" />
          <div className="portal-note-card">
            <Sparkles size={22} />
            <p>A frequência mostra vínculo, não cobrança. Use os números para acolher quem está se afastando.</p>
            <span>{hasRealData ? 'Dados reais da casa' : 'Dados demonstrativos'}</span>
          </div>
        </article>
      </section>

      <article className="portal-panel">
        <PanelHeader eyebrow="Acompanhamento individual" title="Frequência dos filhos" />
        <div className="portal-table-wrap">
          <table className="portal-table portal-table--attendance">
            <thead><tr><th>Filho da casa</th><th>Presenças</th><th>Atividades</th><th>Geral</th><th>Acompanhamento</th></tr></thead>
            <tbody>
              {memberRows.length === 0 ? (
                <tr><td colSpan={5}>Nenhum filho ativo cadastrado.</td></tr>
              ) : (
                memberRows.map(({ member, present, total, percent, label, tone }) => (
                  <tr key={member.id}>
                    <td><div className="portal-table-person"><span>{profileInitial(member)}</span><strong>{profileDisplayName(member)}</strong></div></td>
                    <td>{present}</td>
                    <td>{total}</td>
                    <td><strong>{percent}%</strong></td>
                    <td><StatusPill tone={tone}>{label}</StatusPill></td>
                  </tr>
                ))
              )}
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

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewContents: StudyContent[] = [
  { id: 'preview-c1', title: 'Fundamentos da mediunidade', description: null, kind: 'video', url: 'https://example.com', module: 'Estudos mediúnicos', duration_minutes: 42, published: true, sort_order: 0, created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-c2', title: 'Orientações para a corrente', description: null, kind: 'documento', url: 'https://example.com', module: 'Documentos da casa', duration_minutes: null, published: true, sort_order: 0, created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-c3', title: 'Ervas de proteção', description: null, kind: 'documento', url: 'https://example.com', module: 'Ervas e fundamentos', duration_minutes: null, published: false, sort_order: 1, created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
];

const contentKindIcons = { video: Play, artigo: BookOpen, documento: FileText } as const;

export function ContentManagement({ contents }: { contents?: StudyContent[] }) {
  const contentList = contents ?? previewContents;
  const publishedCount = contentList.filter((content) => content.published).length;
  const modules = new Set(contentList.map((content) => content.module ?? 'Biblioteca geral'));
  const draftCount = contentList.length - publishedCount;
  const sorted = [...contentList].sort((a, b) =>
    (a.module ?? 'Biblioteca geral').localeCompare(b.module ?? 'Biblioteca geral', 'pt-BR') || a.sort_order - b.sort_order || a.title.localeCompare(b.title, 'pt-BR'),
  );

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Conteúdos" title="Estudos e comunicados" description="Materiais da casa organizados para chegar às pessoas certas, no momento certo." action={<NewContentButton />} />
      <section className="portal-content-categories">
        {[
          ['Publicados', `${publishedCount} ${publishedCount === 1 ? 'material' : 'materiais'}`, BookOpen],
          ['Rascunhos', `${draftCount} ${draftCount === 1 ? 'item' : 'itens'}`, FileText],
          ['Percursos', `${modules.size} ${modules.size === 1 ? 'módulo' : 'módulos'}`, BellRing],
        ].map(([title, count, Icon]) => { const ContentIcon = Icon as typeof BookOpen; return <article key={String(title)}><ContentIcon size={21} /><div><h2>{String(title)}</h2><p>{String(count)}</p></div><ArrowRight size={17} /></article>; })}
      </section>
      <article className="portal-panel"><PanelHeader eyebrow="Biblioteca" title="Materiais da casa" /><div className="portal-library-list">
        {sorted.length === 0 ? (
          <p className="portal-panel__copy">Nenhum conteúdo cadastrado. Adicione o primeiro material de estudo.</p>
        ) : (
          sorted.map((content) => {
            const KindIcon = contentKindIcons[content.kind] ?? FileText;
            return (
              <div className="portal-library-item" key={content.id}>
                <div className="portal-library-item__icon"><KindIcon size={19} /></div>
                <div>
                  <span>{content.module ?? 'Biblioteca geral'}</span>
                  <h3>{content.title}</h3>
                  <p>{contentKindLabel(content.kind)}{content.duration_minutes ? ` · ${formatDuration(content.duration_minutes)}` : ''}</p>
                </div>
                <StatusPill tone={content.published ? 'info' : 'neutral'}>{content.published ? 'Publicado' : 'Rascunho'}</StatusPill>
                <ContentRowActions content={content} />
              </div>
            );
          })
        )}
      </div></article>
    </div>
  );
}

type AdminSettingsProps = {
  counts?: { admins: number; developers: number; members: number; editors: number; pending: number };
};

export function AdminSettings({ counts }: AdminSettingsProps) {
  const resolved = counts ?? { admins: 2, developers: 1, members: 42, editors: 1, pending: 3 };
  const plural = (n: number) => (n === 1 ? '1 pessoa' : `${n} pessoas`);
  const roles = [
    ['Iyás administradoras', 'Gestão completa da casa', plural(resolved.admins), 'Administração'],
    ['Comunicação', 'Agenda, avisos e conteúdos; sem dados sensíveis', plural(resolved.editors), 'Editor'],
    ['Filhos da casa', 'Acesso somente aos próprios dados', plural(resolved.members), 'Membro'],
    ['Acesso técnico', 'Configuração sem dados sensíveis por padrão', plural(resolved.developers), 'Técnico'],
  ];
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Configurações" title="Permissões e segurança" description="Defina quem pode ver, criar e alterar cada parte do sistema." />
      <section className="portal-layout portal-layout--settings">
        <article className="portal-panel"><PanelHeader eyebrow="Papéis do sistema" title="Níveis de acesso" /><div className="portal-role-list">{roles.map(([title, desc, people, badge]) => <div key={title}><div className="portal-role-list__icon"><ShieldCheck size={19} /></div><div><h3>{title}</h3><p>{desc}</p></div><span>{people}</span><StatusPill tone={badge === 'Administração' ? 'gold' : 'neutral'}>{badge}</StatusPill></div>)}</div></article>
        <div className="portal-stack"><article className="portal-panel portal-panel--accent"><PanelHeader eyebrow="Proteção" title="Boas práticas ativas" /><ul className="portal-check-list"><li><CheckCircle2 size={17} /> Regras por perfil</li><li><CheckCircle2 size={17} /> Dados sensíveis restritos</li><li><CheckCircle2 size={17} /> Sessões protegidas</li><li><Clock3 size={17} /> Auditoria detalhada na próxima etapa</li></ul></article><article className="portal-panel"><PanelHeader eyebrow="Sessão" title="Políticas de acesso" /><dl className="portal-definition-list"><div><dt>Cadastros pendentes</dt><dd>{resolved.pending}</dd></div><div><dt>Aprovação</dt><dd>Manual, pela administração</dd></div></dl><p className="portal-panel__copy">Contas suspensas perdem acesso imediatamente. Alterações de papel exigirão confirmação administrativa.</p></article></div>
      </section>
    </div>
  );
}

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewNotices: Notice[] = [
  { id: 'preview-n1', title: 'Mudança no horário da gira interna', body: 'A atividade do dia 2 de agosto começará às 19h. Pedimos que a corrente chegue com 30 minutos de antecedência.', category: 'operacional', pinned: true, published_at: '2026-07-22T12:00:00Z', created_by: null, created_at: '2026-07-22T12:00:00Z', updated_at: '2026-07-22T12:00:00Z' },
  { id: 'preview-n2', title: 'Nova escala de cuidados disponível', body: 'As equipes de agosto já estão organizadas. Consulte sua próxima data e confirme a participação.', category: 'geral', pinned: false, published_at: '2026-07-21T12:00:00Z', created_by: null, created_at: '2026-07-21T12:00:00Z', updated_at: '2026-07-21T12:00:00Z' },
];

export function NoticesManagement({ notices }: { notices?: Notice[] }) {
  const noticeList = notices ?? previewNotices;
  const sorted = [...noticeList].sort((a, b) =>
    Number(b.pinned) - Number(a.pinned) || (a.published_at < b.published_at ? 1 : -1),
  );
  const pinnedCount = noticeList.filter((notice) => notice.pinned).length;

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Avisos" title="Comunicados da casa" description="Publique orientações e novidades para toda a corrente." action={<NewNoticeButton />} />
      <section className="portal-metrics portal-metrics--compact">
        <MetricCard icon={BellRing} label="Avisos publicados" value={String(noticeList.length)} detail="Visíveis na área dos filhos" tone="brand" />
        <MetricCard icon={Pin} label="Fixados" value={String(pinnedCount)} detail="Aparecem em destaque" tone="gold" />
      </section>

      <article className="portal-panel">
        <PanelHeader eyebrow="Caixa de entrada da corrente" title="Todos os avisos" />
        {sorted.length === 0 ? (
          <p className="portal-panel__copy">Nenhum aviso publicado ainda.</p>
        ) : (
          <div className="portal-stack">
            {sorted.map((notice) => (
              <article className={`member-notice${notice.pinned ? ' is-featured' : ''}`} key={notice.id}>
                <div><BellRing size={18} /></div>
                <div>
                  <StatusPill tone={notice.pinned ? 'gold' : 'neutral'}>{notice.pinned ? 'Fixado' : noticeCategoryLabel(notice.category)}</StatusPill>
                  <h2>{notice.title}</h2>
                  <p>{notice.body}</p>
                  <span>{formatRelativeDate(notice.published_at)} · {noticeCategoryLabel(notice.category)}</span>
                </div>
                <NoticeRowActions notice={notice} />
              </article>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewShiftDates: CleaningShiftDate[] = [
  { id: 'preview-d1', shift_date: '2026-07-23', kind: 'thursday', created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-d2', shift_date: '2026-07-25', kind: 'saturday', created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-d3', shift_date: '2026-07-30', kind: 'thursday', created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
];

const previewShiftSignups: CleaningShiftSignup[] = [
  { id: 'preview-s1', shift_date_id: 'preview-d1', profile_id: 'preview-a1', created_at: '2026-07-10T00:00:00Z' },
  { id: 'preview-s2', shift_date_id: 'preview-d1', profile_id: 'preview-a2', created_at: '2026-07-10T00:00:00Z' },
  { id: 'preview-s3', shift_date_id: 'preview-d1', profile_id: 'preview-a3', created_at: '2026-07-11T00:00:00Z' },
  { id: 'preview-s4', shift_date_id: 'preview-d2', profile_id: 'preview-a4', created_at: '2026-07-11T00:00:00Z' },
];

type ChoresManagementProps = {
  dates?: CleaningShiftDate[];
  signups?: CleaningShiftSignup[];
  /** Perfis dos inscritos, para exibir nomes (administração lê todos). */
  profiles?: Profile[];
};

export function ChoresManagement({ dates, signups, profiles }: ChoresManagementProps) {
  const dateList = dates ?? previewShiftDates;
  const signupList = signups ?? previewShiftSignups;
  const profileList = profiles ?? previewAttendanceMembers;
  const namesById = new Map(profileList.map((profile) => [profile.id, profileDisplayName(profile)]));

  const signupsByDate = new Map<string, CleaningShiftSignup[]>();
  for (const signup of signupList) {
    const list = signupsByDate.get(signup.shift_date_id) ?? [];
    list.push(signup);
    signupsByDate.set(signup.shift_date_id, list);
  }

  const next = dateList[0] ?? null;
  const needingPeople = dateList.filter((date) => (signupsByDate.get(date.id)?.length ?? 0) < CLEANING_SHIFT_MIN).length;
  const totalSignups = signupList.length;

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Cuidados da casa"
        title="Escala de cuidados"
        description="Os próprios filhos se inscrevem nas datas. Cada dia precisa de pelo menos 7 pessoas e tem no máximo 9."
      />

      <section className="portal-metrics portal-metrics--compact">
        <MetricCard icon={CalendarCheck} label="Próxima data" value={next ? `${eventDateParts(next.shift_date).day} ${eventDateParts(next.shift_date).month}` : '—'} detail={next ? formatEventDateLong(next.shift_date) : 'Nenhuma data futura'} tone="gold" />
        <MetricCard icon={UsersRound} label="Inscrições" value={String(totalSignups)} detail="Nas próximas datas" tone="brand" />
        <MetricCard icon={ListChecks} label="Datas em aberto" value={String(needingPeople)} detail={needingPeople > 0 ? 'Ainda sem equipe mínima' : 'Todas com equipe completa'} tone={needingPeople > 0 ? 'warning' : 'info'} />
      </section>

      <section className="portal-layout portal-layout--overview">
        <div className="portal-stack">
          {dateList.length === 0 ? (
            <article className="portal-panel"><PanelHeader eyebrow="Datas" title="Cuidado da casa" /><p className="portal-panel__copy">Nenhuma data futura. As datas são geradas automaticamente ao abrir a página.</p></article>
          ) : (
            dateList.map((date) => {
              const parts = eventDateParts(date.shift_date);
              const roster = signupsByDate.get(date.id) ?? [];
              const status = cleaningShiftStatus(roster.length);
              return (
                <article className="portal-panel" key={date.id}>
                  <PanelHeader
                    eyebrow={`${parts.weekday} · ${cleaningKindLabel(date.kind)}`}
                    title={formatEventDateLong(date.shift_date)}
                    action={<StatusPill tone={status.tone}>{status.label}</StatusPill>}
                  />
                  <p className="portal-panel__copy">
                    {roster.length === 0
                      ? 'Nenhuma inscrição até agora.'
                      : `${roster.length} de ${CLEANING_SHIFT_MAX} ${roster.length === 1 ? 'pessoa inscrita' : 'pessoas inscritas'}.`}
                  </p>
                  {roster.length > 0 ? (
                    <ul className="portal-roster">
                      {roster.map((signup) => {
                        const name = namesById.get(signup.profile_id) ?? 'Membro';
                        return (
                          <li key={signup.id}>
                            <span>{name}</span>
                            <RemoveShiftSignupButton shiftDateId={date.id} profileId={signup.profile_id} name={name} />
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  {date.kind === 'saturday' ? (
                    <SaturdayShiftEditor month={date.shift_date.slice(0, 7)} currentDate={date.shift_date} />
                  ) : null}
                </article>
              );
            })
          )}
        </div>

        <div className="portal-stack">
          <article className="portal-note-card portal-note-card--light"><Sparkles size={22} /><p>As datas são geradas automaticamente: todas as quintas-feiras e um sábado por mês. O sábado padrão é o último do mês, mas você pode ajustá-lo em cada cartão.</p><span>Geração automática</span></article>
          <article className="portal-note-card portal-note-card--light"><UsersRound size={22} /><p>Datas com menos de 7 inscritos aparecem com o aviso "Faltam N pessoas" também para os membros.</p><span>Equipe mínima</span></article>
        </div>
      </section>
    </div>
  );
}
