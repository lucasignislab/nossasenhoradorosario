import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  HeartHandshake,
  Play,
  Sparkles,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import { MetricCard, PageHeader, PanelHeader, ProgressBar, StatusPill } from './PortalUI';
import { EventConfirmationButton } from './EventConfirmationButton';
import { ContentProgressToggle } from './ContentProgressToggle';
import { ShiftSignupButton } from './CleaningShiftControls';
import { CopyPixKeyButton, ReceiptUploadButton, RegisterMensalidadeForm } from './MensalidadeControls';
import { SelfAttendanceControls, type SelfAttendanceRecord } from './SelfAttendanceControls';
import { eventDateParts, formatEventDateLong, formatEventTime } from '@/lib/events';
import { currentMonthRange, formatBRL, formatFinanceDate } from '@/lib/finance';
import { CLEANING_SHIFT_MAX, CLEANING_SHIFT_MIN, cleaningKindLabel, cleaningShiftStatus } from '@/lib/cleaning';
import { contentKindLabel, formatDuration, formatRelativeDate, noticeCategoryLabel } from '@/lib/notices';
import type { CleaningShiftDate, CleaningShiftSignup, FinanceEntry, Notice, PortalEvent, StudyContent } from '@/types';

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewMemberEvents: PortalEvent[] = [
  { id: 'preview-m1', title: 'Estudo mediúnico', entity: 'Desenvolvimento', description: null, details: null, category: 'curso', event_date: '2026-07-24', event_time: '20:00:00', location: 'Salão principal', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-m2', title: 'Cuidado da casa', entity: 'Equipe Dourada', description: null, details: null, category: 'acao-social', event_date: '2026-07-26', event_time: '09:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-m3', title: 'Gira interna', entity: 'Corrente completa', description: null, details: null, category: 'gira', event_date: '2026-08-02', event_time: '19:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
];

export type MemberSelfAttendanceMap = Record<string, { record: SelfAttendanceRecord | null; windowOpen: boolean }>;

type MemberAgendaProps = {
  events?: PortalEvent[];
  confirmedEventIds?: string[];
  /** Auto-registro de frequência do membro, por eventId, com janela aberta. */
  selfAttendance?: MemberSelfAttendanceMap;
};

export function MemberAgenda({ events, confirmedEventIds, selfAttendance }: MemberAgendaProps) {
  const eventList = events ?? previewMemberEvents;
  const confirmed = new Set(confirmedEventIds ?? []);
  const self = selfAttendance ?? {};
  const nextEvent = eventList[0] ?? null;

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Agenda" title="Nossa caminhada no mês" description="Giras, estudos, reuniões e compromissos internos organizados em um só lugar." />
      {nextEvent ? (
        <section className="member-feature-card">
          <div>
            <p className="portal-eyebrow">Próximo compromisso</p>
            <h2>{nextEvent.title}</h2>
            <p><CalendarDays size={15} /> {formatEventDateLong(nextEvent.event_date)} · {formatEventTime(nextEvent.event_time)}</p>
            <span>{nextEvent.entity ?? 'Corrente'} · {nextEvent.location}</span>
            {self[nextEvent.id] ? (
              <SelfAttendanceControls
                eventId={nextEvent.id}
                current={self[nextEvent.id].record}
                windowOpen={self[nextEvent.id].windowOpen}
              />
            ) : null}
            {self[nextEvent.id] && !self[nextEvent.id].windowOpen ? (
              <p className="portal-action-note">A frequência desta gira poderá ser registrada no dia {nextEvent.event_date.split('-').slice(1).reverse().join('/')}.</p>
            ) : null}
          </div>
          <EventConfirmationButton eventId={nextEvent.id} confirmed={confirmed.has(nextEvent.id)} />
        </section>
      ) : null}
      <section className="portal-layout portal-layout--overview">
        <article className="portal-panel"><PanelHeader eyebrow="Programação" title="Próximas atividades" />
          {eventList.length === 0 ? (
            <p className="portal-panel__copy">Nenhuma atividade agendada no momento. Volte em breve!</p>
          ) : (
            <div className="member-agenda-list">
              {eventList.map((event) => {
                const parts = eventDateParts(event.event_date);
                const isConfirmed = confirmed.has(event.id);
                return (
                  <div key={event.id}>
                    <span><strong>{parts.day}</strong><small>{parts.month}</small></span>
                    <div>
                      <StatusPill tone={isConfirmed ? 'info' : 'neutral'}>{isConfirmed ? 'Presença confirmada' : (event.entity ?? 'Corrente')}</StatusPill>
                      <h3>{event.title}</h3>
                      <p><Clock3 size={13} /> {formatEventTime(event.event_time)} · {event.location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
        <div className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Sua agenda" title="Resumo" /><dl className="portal-definition-list"><div><dt>Atividades</dt><dd>{eventList.length}</dd></div><div><dt>Confirmadas</dt><dd>{confirmed.size}</dd></div><div><dt>Aguardando você</dt><dd>{eventList.length - confirmed.size}</dd></div></dl></article><article className="portal-note-card portal-note-card--light"><HeartHandshake size={22} /><p>No dia da gira, registre sua presença por aqui mesmo — vale como frequência oficial. Se não puder vir, justifique por aqui também.</p><span>Frequência oficial</span></article></div>
      </section>
    </div>
  );
}

export type MemberChoresData = {
  dates: CleaningShiftDate[];
  signups: CleaningShiftSignup[];
  currentUserId: string;
};

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewMemberChores: MemberChoresData = {
  dates: [
    { id: 'preview-d1', shift_date: '2026-07-23', kind: 'thursday', created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
    { id: 'preview-d2', shift_date: '2026-07-25', kind: 'saturday', created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
    { id: 'preview-d3', shift_date: '2026-07-30', kind: 'thursday', created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  ],
  signups: [
    { id: 'preview-s1', shift_date_id: 'preview-d1', profile_id: 'preview-self', created_at: '2026-07-10T00:00:00Z' },
    { id: 'preview-s2', shift_date_id: 'preview-d1', profile_id: 'preview-a1', created_at: '2026-07-10T00:00:00Z' },
    { id: 'preview-s3', shift_date_id: 'preview-d1', profile_id: 'preview-a2', created_at: '2026-07-11T00:00:00Z' },
    { id: 'preview-s4', shift_date_id: 'preview-d2', profile_id: 'preview-a3', created_at: '2026-07-11T00:00:00Z' },
  ],
  currentUserId: 'preview-self',
};

export function MemberChores({ data }: { data?: MemberChoresData }) {
  const { dates, signups, currentUserId } = data ?? previewMemberChores;
  const countByDate = new Map<string, number>();
  for (const signup of signups) {
    countByDate.set(signup.shift_date_id, (countByDate.get(signup.shift_date_id) ?? 0) + 1);
  }
  const mySignupDateIds = new Set(
    signups.filter((signup) => signup.profile_id === currentUserId).map((signup) => signup.shift_date_id),
  );

  const next = dates[0] ?? null;
  const myNext = dates.find((date) => mySignupDateIds.has(date.id)) ?? null;
  const datesNeedingPeople = dates.filter((date) => (countByDate.get(date.id) ?? 0) < CLEANING_SHIFT_MIN).length;

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Área dos filhos · Cuidados"
        title="Cuidar da casa é parte do axé"
        description="Escolha as datas em que você pode ajudar. Cada dia precisa de pelo menos 7 pessoas e tem no máximo 9."
      />
      <section className="portal-metrics portal-metrics--compact">
        <MetricCard icon={Sparkles} label="Próxima data" value={next ? `${eventDateParts(next.shift_date).day} ${eventDateParts(next.shift_date).month}` : '—'} detail={next ? formatEventDateLong(next.shift_date) : 'Nenhuma data futura'} tone="gold" />
        <MetricCard icon={UserCheck} label="Sua participação" value={myNext ? `${eventDateParts(myNext.shift_date).day} ${eventDateParts(myNext.shift_date).month}` : '—'} detail={myNext ? formatEventDateLong(myNext.shift_date) : 'Você ainda não se inscreveu'} tone="brand" />
        <MetricCard icon={UsersRound} label="Datas abertas" value={String(dates.length)} detail={datesNeedingPeople > 0 ? `${datesNeedingPeople} ${datesNeedingPeople === 1 ? 'data precisa' : 'datas precisam'} de gente` : 'Todas completas'} tone="info" />
      </section>
      <section className="portal-layout portal-layout--overview">
        <div className="portal-stack">
          {dates.length === 0 ? (
            <article className="portal-panel"><PanelHeader eyebrow="Próximas datas" title="Cuidado da casa" /><p className="portal-panel__copy">Nenhuma data de cuidado disponível no momento.</p></article>
          ) : (
            dates.map((date) => {
              const parts = eventDateParts(date.shift_date);
              const count = countByDate.get(date.id) ?? 0;
              const status = cleaningShiftStatus(count);
              const signedUp = mySignupDateIds.has(date.id);
              return (
                <article className={`portal-panel${signedUp ? ' portal-panel--highlight' : ''}`} key={date.id}>
                  <PanelHeader
                    eyebrow={`${parts.weekday} · ${cleaningKindLabel(date.kind)}`}
                    title={formatEventDateLong(date.shift_date)}
                    action={<StatusPill tone={status.tone}>{status.label}</StatusPill>}
                  />
                  <p className="portal-panel__copy">
                    {count === 0
                      ? 'Ninguém inscrito ainda — seja a primeira pessoa.'
                      : `${count} de ${CLEANING_SHIFT_MAX} ${count === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'}.`}
                    {signedUp ? ' Você está nesta data.' : ''}
                  </p>
                  <ProgressBar value={Math.min(100, Math.round((count / CLEANING_SHIFT_MAX) * 100))} label="Vagas preenchidas" />
                  <ShiftSignupButton shiftDateId={date.id} signedUp={signedUp} full={count >= CLEANING_SHIFT_MAX} />
                </article>
              );
            })
          )}
        </div>
        <div className="portal-stack">
          <article className="portal-note-card portal-note-card--light"><Sparkles size={22} /><p>Cada dia de cuidado precisa de pelo menos 7 pessoas. Se puder, prefira as datas que ainda estão com vagas sobrando.</p><span>Mutirão do axé</span></article>
          <article className="portal-note-card portal-note-card--light"><CalendarDays size={22} /><p>Mudou de planos? Cancele sua participação com antecedência para abrir a vaga para outra pessoa.</p><span>Sem burocracia</span></article>
        </div>
      </section>
    </div>
  );
}

export type MemberAttendanceItem = {
  event: PortalEvent;
  present: boolean;
  justified: boolean;
};

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewMemberAttendance: MemberAttendanceItem[] = [
  { event: { id: 'pma1', title: 'Estudo mediúnico', entity: 'Desenvolvimento', description: null, details: null, category: 'curso', event_date: '2026-07-17', event_time: '20:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' }, present: true, justified: false },
  { event: { id: 'pma2', title: 'Gira interna', entity: 'Corrente completa', description: null, details: null, category: 'gira', event_date: '2026-07-12', event_time: '19:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' }, present: true, justified: false },
  { event: { id: 'pma3', title: 'Cuidado da casa', entity: 'Equipe Dourada', description: null, details: null, category: 'acao-social', event_date: '2026-07-05', event_time: '09:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' }, present: false, justified: true },
];

export type MemberUpcomingAttendance = {
  event: PortalEvent;
  current: SelfAttendanceRecord | null;
  windowOpen: boolean;
};

export function MemberAttendance({ history, upcoming }: { history?: MemberAttendanceItem[]; upcoming?: MemberUpcomingAttendance[] }) {
  const items = history ?? previewMemberAttendance;
  const total = items.length;
  const present = items.filter((item) => item.present).length;
  const justified = items.filter((item) => !item.present && item.justified).length;
  const absences = total - present;
  const percent = total > 0 ? Math.round((present / total) * 100) : 0;
  const sorted = [...items].sort((a, b) => (a.event.event_date < b.event.event_date ? 1 : -1));

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Frequência" title="Minha presença na casa" description="Um registro pessoal para acompanhar sua participação, sem comparações com outras pessoas." />
      <section className="portal-metrics portal-metrics--compact">
        <MetricCard icon={UserCheck} label="Frequência geral" value={`${percent}%`} detail={`${present} de ${total} atividades`} tone="brand" />
        <MetricCard icon={CalendarCheck} label="Presenças" value={String(present)} detail={`Em ${total} atividades registradas`} tone="info" />
        <MetricCard icon={Clock3} label="Justificadas" value={String(justified)} detail="Registros acolhidos pela casa" tone="neutral" />
        <MetricCard icon={CalendarDays} label="Faltas" value={String(absences)} detail="Ausências no período" tone="warning" />
      </section>
      {upcoming && upcoming.length > 0 ? (
        <article className="portal-panel"><PanelHeader eyebrow="Auto-registro" title="Próximas atividades" />
          <div className="member-agenda-list">
            {upcoming.map(({ event, current, windowOpen }) => {
              const parts = eventDateParts(event.event_date);
              return (
                <div key={event.id}>
                  <span><strong>{parts.day}</strong><small>{parts.month}</small></span>
                  <div>
                    <StatusPill tone={windowOpen ? 'gold' : 'neutral'}>{windowOpen ? 'Registro aberto hoje' : (event.entity ?? 'Atividade')}</StatusPill>
                    <h3>{event.title}</h3>
                    <p><Clock3 size={13} /> {formatEventTime(event.event_time)} · {event.location}</p>
                    <SelfAttendanceControls eventId={event.id} current={current} windowOpen={windowOpen} alwaysEnabled />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="portal-panel__copy">Você pode registrar ou corrigir sua frequência com antecedência — útil para giras com inscrição prévia, como as de Pedreira. O registro já vale como frequência oficial.</p>
        </article>
      ) : null}
      <article className="portal-panel"><PanelHeader eyebrow="Histórico pessoal" title="Atividades recentes" /><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Data</th><th>Atividade</th><th>Tipo</th><th>Situação</th></tr></thead><tbody>{sorted.length === 0 ? <tr><td colSpan={4}>Nenhum registro de presença ainda.</td></tr> : sorted.map(({ event, present: isPresent, justified: isJustified }) => <tr key={event.id}><td>{formatFinanceDate(event.event_date)}</td><td><strong>{event.title}</strong></td><td>{event.entity ?? 'Atividade'}</td><td><StatusPill tone={isPresent ? 'info' : isJustified ? 'warning' : 'danger'}>{isPresent ? 'Presente' : isJustified ? 'Justificada' : 'Faltou'}</StatusPill></td></tr>)}</tbody></table></div></article>
    </div>
  );
}

const studyKindIcons = { video: Play, artigo: BookOpen, documento: FileText } as const;

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewStudyContents: StudyContent[] = [
  { id: 'preview-s1', title: 'Fundamentos da mediunidade', description: null, kind: 'video', url: 'https://example.com', module: 'Desenvolvimento mediúnico', duration_minutes: 42, published: true, sort_order: 0, created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-s2', title: 'Ervas de proteção', description: null, kind: 'documento', url: 'https://example.com', module: 'Ervas e fundamentos', duration_minutes: null, published: true, sort_order: 0, created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-s3', title: 'Cantigas da casa', description: null, kind: 'video', url: 'https://example.com', module: 'Cantigas', duration_minutes: 18, published: true, sort_order: 0, created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
];

export function MemberStudies({ contents, completedIds }: { contents?: StudyContent[]; completedIds?: string[] }) {
  const contentList = contents ?? previewStudyContents;
  const completed = new Set(completedIds ?? []);

  const modules = new Map<string, StudyContent[]>();
  for (const content of contentList) {
    const name = content.module ?? 'Biblioteca geral';
    modules.set(name, [...(modules.get(name) ?? []), content]);
  }
  const moduleList = [...modules.entries()].map(([name, items]) => ({
    name,
    items: [...items].sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title, 'pt-BR')),
  }));

  const totalCompleted = contentList.filter((content) => completed.has(content.id)).length;
  const nextContent = contentList.find((content) => !completed.has(content.id)) ?? null;

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Estudos" title="Conhecimento que acompanha a prática" description="Estudos, materiais e orientações preparados pela casa para o seu desenvolvimento." />
      {nextContent ? (
        <section className="member-feature-card member-feature-card--study">
          <div>
            <StatusPill tone="gold">Continue estudando</StatusPill>
            <h2>{nextContent.title}</h2>
            <p>Você concluiu {totalCompleted} de {contentList.length} conteúdos da biblioteca.</p>
            <span className="member-inline-progress"><i><i style={{ width: `${contentList.length > 0 ? Math.round((totalCompleted / contentList.length) * 100) : 0}%` }} /></i><strong>{contentList.length > 0 ? Math.round((totalCompleted / contentList.length) * 100) : 0}%</strong></span>
          </div>
          <a className="portal-button portal-button--primary" href={nextContent.url} target="_blank" rel="noopener noreferrer"><Play size={15} /> Continuar</a>
        </section>
      ) : null}
      <div className="dashboard-home__section-heading"><div><p className="portal-eyebrow">Biblioteca da casa</p><h2>Percursos de estudo</h2></div><span>{contentList.length} {contentList.length === 1 ? 'material disponível' : 'materiais disponíveis'}</span></div>
      {moduleList.length === 0 ? (
        <p className="portal-panel__copy">Nenhum conteúdo publicado no momento. Novos materiais aparecem aqui.</p>
      ) : (
        <section className="member-course-grid">
          {moduleList.map(({ name, items }) => {
            const done = items.filter((item) => completed.has(item.id)).length;
            const percent = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
            return (
              <article key={name}>
                <div className="member-course-card__icon"><BookOpen size={21} /></div>
                <StatusPill>{items.length} {items.length === 1 ? 'conteúdo' : 'conteúdos'}</StatusPill>
                <h3>{name}</h3>
                <p>{done} de {items.length} concluídos</p>
                <span className="member-inline-progress"><i><i style={{ width: `${percent}%` }} /></i><strong>{percent}%</strong></span>
                <ul className="member-course-items">
                  {items.map((item) => {
                    const KindIcon = studyKindIcons[item.kind] ?? FileText;
                    return (
                      <li key={item.id}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="member-course-item__link">
                          <KindIcon size={15} />
                          <span><strong>{item.title}</strong><small>{contentKindLabel(item.kind)}{item.duration_minutes ? ` · ${formatDuration(item.duration_minutes)}` : ''}</small></span>
                        </a>
                        <ContentProgressToggle contentId={item.id} completed={completed.has(item.id)} />
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewMemberFinanceEntries: FinanceEntry[] = [
  { id: 'preview-mf1', type: 'entrada', category: 'mensalidade', description: 'Mensalidade — julho/2026', amount_cents: 9000, entry_date: '2026-07-10', status: 'pendente', receipt_path: null, profile_id: 'preview', created_by: null, created_at: '2026-07-10T00:00:00Z', updated_at: '2026-07-10T00:00:00Z' },
  { id: 'preview-mf2', type: 'entrada', category: 'mensalidade', description: 'Mensalidade — junho/2026', amount_cents: 9000, entry_date: '2026-06-08', status: 'pago', receipt_path: 'preview/junho.pdf', profile_id: 'preview', created_by: null, created_at: '2026-06-08T00:00:00Z', updated_at: '2026-06-08T00:00:00Z' },
  { id: 'preview-mf3', type: 'entrada', category: 'mensalidade', description: 'Mensalidade — maio/2026', amount_cents: 9000, entry_date: '2026-05-10', status: 'pago', receipt_path: 'preview/maio.pdf', profile_id: 'preview', created_by: null, created_at: '2026-05-10T00:00:00Z', updated_at: '2026-05-10T00:00:00Z' },
];

function monthReference(isoDate: string): string {
  const [year, month] = isoDate.split('-').map(Number);
  const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' });
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${year}`;
}

export function MemberFinance({ entries }: { entries?: FinanceEntry[] }) {
  const entryList = entries ?? previewMemberFinanceEntries;
  const { start, end } = currentMonthRange();
  const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthEntries = entryList.filter(
    (entry) => entry.type === 'entrada' && entry.category === 'mensalidade' && entry.entry_date >= start && entry.entry_date <= end,
  );
  const monthPayment = monthEntries.find((entry) => entry.status === 'pago');
  const monthPending = monthEntries.find((entry) => entry.status === 'pendente');
  const yearEntries = entryList.filter(
    (entry) => entry.type === 'entrada' && entry.category === 'mensalidade' && entry.status === 'pago' && entry.entry_date.startsWith(String(currentYear)),
  );
  const yearTotalCents = yearEntries.reduce((total, entry) => total + entry.amount_cents, 0);
  const history = [...entryList].sort((a, b) => (a.entry_date > b.entry_date ? 1 : -1));

  const heroStatus = monthPayment
    ? { title: 'Em dia', detail: `Contribuição registrada em ${formatFinanceDate(monthPayment.entry_date)}` }
    : monthPending
      ? { title: 'Comprovante pendente', detail: 'Mensalidade registrada — pague via Pix e envie o comprovante.' }
      : { title: 'Aguardando contribuição', detail: 'Nenhuma mensalidade registrada para este mês ainda.' };

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Mensalidades" title="Minha contribuição" description="Registre o mês, pague via Pix e envie o comprovante — tudo por aqui, sem burocracia." />
      <section className="member-finance-hero">
        <div>
          <span>Situação de {currentMonthName}</span>
          <strong>{heroStatus.title}</strong>
          <p>{heroStatus.detail}</p>
        </div>
        <CheckCircle2 size={48} />
        <div><small>Próximo vencimento</small><strong>Dia 10</strong><span>do mês seguinte</span></div>
      </section>
      <section className="portal-layout portal-layout--overview">
        <article className="portal-panel">
          <PanelHeader eyebrow="Passo a passo" title="Como contribuir" />
          <ol className="portal-steps">
            <li>Registre a mensalidade do mês com o valor que você vai pagar (R$ 70 a R$ 100).</li>
            <li>Faça o Pix para a chave da casa.</li>
            <li>Envie o comprovante no histórico abaixo — a mensalidade fica como paga na hora.</li>
          </ol>
          <RegisterMensalidadeForm defaultMonth={defaultMonth} />
        </article>
        <div className="portal-stack">
          <article className="portal-panel"><PanelHeader eyebrow="Forma de contribuição" title="Pagamento via Pix" /><div className="member-pix"><div><span>Chave Pix da casa</span><strong>tsenhoradorosario@gmail.com</strong></div><CopyPixKeyButton /></div><p className="portal-panel__copy">Depois do pagamento, envie o comprovante no histórico para a mensalidade constar como paga.</p></article>
          <div className="portal-panel"><PanelHeader eyebrow={`Ano de ${currentYear}`} title="Resumo" /><dl className="portal-definition-list"><div><dt>Mensalidades pagas</dt><dd>{yearEntries.length}</dd></div><div><dt>Total contribuído</dt><dd>{formatBRL(yearTotalCents)}</dd></div><div><dt>Pendências</dt><dd>{monthPayment ? 'Nenhuma' : monthPending ? 'Comprovante' : 'Mês atual'}</dd></div></dl></div>
        </div>
      </section>
      <article className="portal-panel member-history-panel"><PanelHeader eyebrow="Histórico" title="Minhas mensalidades" /><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Referência</th><th>Pagamento</th><th>Descrição</th><th>Valor</th><th>Situação</th><th>Comprovante</th></tr></thead><tbody>{history.length === 0 ? <tr><td colSpan={6}>Nenhuma contribuição registrada ainda.</td></tr> : history.map((entry) => <tr key={entry.id}><td><strong>{monthReference(entry.entry_date)}</strong></td><td>{formatFinanceDate(entry.entry_date)}</td><td>{entry.description}</td><td>{formatBRL(entry.amount_cents)}</td><td><StatusPill tone={entry.status === 'pago' ? 'info' : 'warning'}>{entry.status === 'pago' ? 'Pago' : 'Pendente'}</StatusPill></td><td>{entry.status === 'pendente' ? <ReceiptUploadButton entryId={entry.id} monthLabel={monthReference(entry.entry_date)} /> : <span className="portal-action-note">Enviado</span>}</td></tr>)}</tbody></table></div></article>
    </div>
  );
}

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewMemberNotices: Notice[] = [
  { id: 'preview-mn1', title: 'Mudança no horário da gira interna', body: 'A atividade do dia 2 de agosto começará às 19h. Pedimos que a corrente chegue com 30 minutos de antecedência.', category: 'operacional', pinned: true, published_at: new Date().toISOString(), created_by: null, created_at: '2026-07-22T12:00:00Z', updated_at: '2026-07-22T12:00:00Z' },
  { id: 'preview-mn2', title: 'Nova escala de cuidados disponível', body: 'As equipes de agosto já estão organizadas. Consulte sua próxima data e confirme a participação.', category: 'geral', pinned: false, published_at: new Date(Date.now() - 86_400_000).toISOString(), created_by: null, created_at: '2026-07-21T12:00:00Z', updated_at: '2026-07-21T12:00:00Z' },
  { id: 'preview-mn3', title: 'Material novo na biblioteca', body: 'O estudo Fundamentos da Mediunidade recebeu um novo vídeo e material complementar.', category: 'espiritual', pinned: false, published_at: new Date(Date.now() - 4 * 86_400_000).toISOString(), created_by: null, created_at: '2026-07-18T12:00:00Z', updated_at: '2026-07-18T12:00:00Z' },
];

export function MemberNotices({ notices }: { notices?: Notice[] }) {
  const noticeList = notices ?? previewMemberNotices;
  const sorted = [...noticeList].sort((a, b) =>
    Number(b.pinned) - Number(a.pinned) || (a.published_at < b.published_at ? 1 : -1),
  );
  const pinnedCount = noticeList.filter((notice) => notice.pinned).length;
  const monthStart = new Date();
  monthStart.setDate(1);
  const thisMonth = noticeList.filter((notice) => new Date(notice.published_at) >= monthStart).length;

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Avisos" title="Comunicados da casa" description="Orientações importantes, mudanças de agenda e notícias para a corrente." />
      <section className="member-notice-layout"><div className="portal-stack">{sorted.length === 0 ? <p className="portal-panel__copy">Nenhum aviso publicado no momento.</p> : sorted.map((notice) => <article className={`member-notice${notice.pinned ? ' is-featured' : ''}`} key={notice.id}><div><Bell size={18} /></div><div><StatusPill tone={notice.pinned ? 'gold' : 'neutral'}>{notice.pinned ? 'Importante' : noticeCategoryLabel(notice.category)}</StatusPill><h2>{notice.title}</h2><p>{notice.body}</p><span>{formatRelativeDate(notice.published_at)} · {noticeCategoryLabel(notice.category)}</span></div></article>)}</div><div className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Caixa de entrada" title="Resumo" /><dl className="portal-definition-list"><div><dt>Avisos ativos</dt><dd>{noticeList.length}</dd></div><div><dt>Este mês</dt><dd>{thisMonth}</dd></div><div><dt>Fixados</dt><dd>{pinnedCount}</dd></div></dl></article><article className="portal-note-card portal-note-card--light"><Bell size={22} /><p>Ative as notificações para não perder mudanças importantes.</p><span>Preferências</span></article></div></section>
    </div>
  );
}
