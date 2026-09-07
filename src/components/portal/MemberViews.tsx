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
  ReceiptText,
  Sparkles,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import { MetricCard, PageHeader, PanelHeader, ProgressBar, StatusPill } from './PortalUI';
import { EventConfirmationButton } from './EventConfirmationButton';
import { eventDateParts, formatEventDateLong, formatEventTime } from '@/lib/events';
import { currentMonthRange, formatBRL, formatFinanceDate } from '@/lib/finance';
import type { FinanceEntry, PortalEvent } from '@/types';

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewMemberEvents: PortalEvent[] = [
  { id: 'preview-m1', title: 'Estudo mediúnico', entity: 'Desenvolvimento', description: null, details: null, category: 'curso', event_date: '2026-07-24', event_time: '20:00:00', location: 'Salão principal', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-m2', title: 'Cuidado da casa', entity: 'Equipe Dourada', description: null, details: null, category: 'acao-social', event_date: '2026-07-26', event_time: '09:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
  { id: 'preview-m3', title: 'Gira interna', entity: 'Corrente completa', description: null, details: null, category: 'gira', event_date: '2026-08-02', event_time: '19:00:00', location: 'T. U. Senhora do Rosário', image_url: null, status: 'confirmada', created_by: null, created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-01T00:00:00Z' },
];

type MemberAgendaProps = {
  events?: PortalEvent[];
  confirmedEventIds?: string[];
};

export function MemberAgenda({ events, confirmedEventIds }: MemberAgendaProps) {
  const eventList = events ?? previewMemberEvents;
  const confirmed = new Set(confirmedEventIds ?? []);
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
                    <EventConfirmationButton eventId={event.id} confirmed={isConfirmed} />
                  </div>
                );
              })}
            </div>
          )}
        </article>
        <div className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Sua agenda" title="Resumo" /><dl className="portal-definition-list"><div><dt>Atividades</dt><dd>{eventList.length}</dd></div><div><dt>Confirmadas</dt><dd>{confirmed.size}</dd></div><div><dt>Aguardando você</dt><dd>{eventList.length - confirmed.size}</dd></div></dl></article><article className="portal-note-card portal-note-card--light"><HeartHandshake size={22} /><p>Se não puder comparecer, avise com antecedência para cuidarmos da organização.</p><span>Cuidado coletivo</span></article></div>
      </section>
    </div>
  );
}

export function MemberChores() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Cuidados" title="Cuidar da casa é parte do axé" description="Consulte sua equipe, confirme sua participação e acompanhe as próximas escalas." />
      <section className="portal-metrics portal-metrics--compact"><MetricCard icon={Sparkles} label="Próxima escala" value="26 jul" detail="Sábado · 9h" tone="gold" /><MetricCard icon={UsersRound} label="Sua equipe" value="Dourada" detail="6 pessoas confirmadas" tone="brand" /><MetricCard icon={CheckCircle2} label="Participação" value="4 de 4" detail="Escalas realizadas em 2026" tone="info" /></section>
      <section className="portal-layout portal-layout--overview">
        <article className="portal-panel"><PanelHeader eyebrow="Sábado · 26 de julho" title="Equipe Dourada" action={<StatusPill tone="warning">Confirmação pendente</StatusPill>} /><div className="member-team-grid">{['Ana Martins', 'Caio Almeida', 'Helena Rocha', 'Pedro Lima', 'Você', 'Marina Souza'].map((name, index) => <div key={name}><span>{name === 'Você' ? 'V' : name.charAt(0)}</span><strong>{name}</strong><small>{index < 4 ? 'Confirmado' : 'Aguardando'}</small></div>)}</div><div className="member-task-list"><h3>Cuidados deste dia</h3>{['Limpeza do salão principal', 'Organização da cozinha', 'Cuidados com o congá', 'Área externa e materiais'].map(item => <p key={item}><CheckCircle2 size={15} /> {item}</p>)}</div><button className="portal-button portal-button--primary">Confirmar minha participação</button></article>
        <div className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Calendário" title="Próximas escalas" /><div className="member-small-list"><div><strong>16 ago</strong><span>Equipe Vermelha</span></div><div><strong>30 ago</strong><span>Equipe Dourada</span></div><div><strong>13 set</strong><span>Equipe Branca</span></div></div></article><article className="portal-note-card portal-note-card--light"><Sparkles size={22} /><p>Precisa trocar sua escala? Solicite com antecedência para a administração.</p><span>Troca de equipe</span></article></div>
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

export function MemberAttendance({ history }: { history?: MemberAttendanceItem[] }) {
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
      <article className="portal-panel"><PanelHeader eyebrow="Histórico pessoal" title="Atividades recentes" /><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Data</th><th>Atividade</th><th>Tipo</th><th>Situação</th></tr></thead><tbody>{sorted.length === 0 ? <tr><td colSpan={4}>Nenhum registro de presença ainda.</td></tr> : sorted.map(({ event, present: isPresent, justified: isJustified }) => <tr key={event.id}><td>{formatFinanceDate(event.event_date)}</td><td><strong>{event.title}</strong></td><td>{event.entity ?? 'Atividade'}</td><td><StatusPill tone={isPresent ? 'info' : isJustified ? 'warning' : 'danger'}>{isPresent ? 'Presente' : isJustified ? 'Justificada' : 'Faltou'}</StatusPill></td></tr>)}</tbody></table></div></article>
    </div>
  );
}

export function MemberStudies() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Estudos" title="Conhecimento que acompanha a prática" description="Estudos, materiais e orientações preparados pela casa para o seu desenvolvimento." />
      <section className="member-feature-card member-feature-card--study"><div><StatusPill tone="gold">Continue estudando</StatusPill><h2>Fundamentos da mediunidade</h2><p>Você concluiu 3 de 5 conteúdos deste percurso.</p><span className="member-inline-progress"><i><i style={{width:'60%'}} /></i><strong>60%</strong></span></div><button className="portal-button portal-button--primary"><Play size={15} /> Continuar</button></section>
      <div className="dashboard-home__section-heading"><div><p className="portal-eyebrow">Biblioteca da casa</p><h2>Percursos de estudo</h2></div><span>12 materiais disponíveis</span></div>
      <section className="member-course-grid">{[
        ['Desenvolvimento mediúnico','5 conteúdos','3 concluídos',BookOpen,60],['Ervas e fundamentos','4 conteúdos','1 concluído',Sparkles,25],['Cantigas da casa','8 conteúdos','Novo',Play,0],['Orientações da corrente','6 documentos','4 lidos',FileText,67],
      ].map(([title,count,detail,Icon,progress]) => { const CourseIcon=Icon as typeof BookOpen; return <article key={String(title)}><div className="member-course-card__icon"><CourseIcon size={21} /></div><StatusPill>{String(count)}</StatusPill><h3>{String(title)}</h3><p>{String(detail)}</p><span className="member-inline-progress"><i><i style={{width:`${progress}%`}} /></i><strong>{String(progress)}%</strong></span><button>Ver percurso <ArrowRight size={14} /></button></article>; })}</section>
    </div>
  );
}

// Dados demonstrativos usados apenas pela prévia visual (portal-preview / Storybook).
const previewMemberFinanceEntries: FinanceEntry[] = [
  { id: 'preview-mf1', type: 'entrada', category: 'mensalidade', description: 'Mensalidade · Julho', amount_cents: 9000, entry_date: '2026-07-10', profile_id: 'preview', created_by: null, created_at: '2026-07-10T00:00:00Z', updated_at: '2026-07-10T00:00:00Z' },
  { id: 'preview-mf2', type: 'entrada', category: 'mensalidade', description: 'Mensalidade · Junho', amount_cents: 9000, entry_date: '2026-06-08', profile_id: 'preview', created_by: null, created_at: '2026-06-08T00:00:00Z', updated_at: '2026-06-08T00:00:00Z' },
  { id: 'preview-mf3', type: 'entrada', category: 'mensalidade', description: 'Mensalidade · Maio', amount_cents: 9000, entry_date: '2026-05-10', profile_id: 'preview', created_by: null, created_at: '2026-05-10T00:00:00Z', updated_at: '2026-05-10T00:00:00Z' },
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

  const monthPayment = entryList.find(
    (entry) => entry.type === 'entrada' && entry.category === 'mensalidade' && entry.entry_date >= start && entry.entry_date <= end,
  );
  const yearEntries = entryList.filter(
    (entry) => entry.type === 'entrada' && entry.category === 'mensalidade' && entry.entry_date.startsWith(String(currentYear)),
  );
  const yearTotalCents = yearEntries.reduce((total, entry) => total + entry.amount_cents, 0);
  const history = [...entryList].sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1));

  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Mensalidades" title="Minha contribuição" description="Acompanhe sua situação, consulte o histórico e envie comprovantes com tranquilidade." />
      <section className="member-finance-hero">
        <div>
          <span>Situação de {currentMonthName}</span>
          <strong>{monthPayment ? 'Em dia' : 'Aguardando contribuição'}</strong>
          <p>{monthPayment ? `Contribuição registrada em ${formatFinanceDate(monthPayment.entry_date)}` : 'Nenhuma mensalidade registrada para este mês ainda.'}</p>
        </div>
        <CheckCircle2 size={48} />
        <div><small>Próximo vencimento</small><strong>Dia 10</strong><span>do mês seguinte</span></div>
      </section>
      <section className="portal-layout portal-layout--overview"><article className="portal-panel"><PanelHeader eyebrow="Forma de contribuição" title="Pagamento via Pix" /><div className="member-pix"><div><span>Chave Pix da casa</span><strong>tesouraria@senhoradorosario.org</strong></div><button className="portal-button portal-button--secondary">Copiar chave</button></div><p className="portal-panel__copy">Depois do pagamento, envie o comprovante para facilitar a conciliação da administração.</p><button className="portal-button portal-button--primary"><ReceiptText size={15} /> Enviar comprovante</button></article><div className="portal-panel"><PanelHeader eyebrow={`Ano de ${currentYear}`} title="Resumo" /><dl className="portal-definition-list"><div><dt>Mensalidades pagas</dt><dd>{yearEntries.length}</dd></div><div><dt>Total contribuído</dt><dd>{formatBRL(yearTotalCents)}</dd></div><div><dt>Pendências</dt><dd>{monthPayment ? 'Nenhuma' : 'Mês atual'}</dd></div></dl></div></section>
      <article className="portal-panel member-history-panel"><PanelHeader eyebrow="Histórico" title="Minhas mensalidades" /><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Referência</th><th>Pagamento</th><th>Descrição</th><th>Valor</th><th>Situação</th></tr></thead><tbody>{history.length === 0 ? <tr><td colSpan={5}>Nenhuma contribuição registrada ainda.</td></tr> : history.map((entry) => <tr key={entry.id}><td><strong>{monthReference(entry.entry_date)}</strong></td><td>{formatFinanceDate(entry.entry_date)}</td><td>{entry.description}</td><td>{formatBRL(entry.amount_cents)}</td><td><StatusPill tone="info">Confirmado</StatusPill></td></tr>)}</tbody></table></div></article>
    </div>
  );
}

export function MemberNotices() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Avisos" title="Comunicados da casa" description="Orientações importantes, mudanças de agenda e notícias para a corrente." />
      <section className="member-notice-layout"><div className="portal-stack">{[
        ['Importante','Mudança no horário da gira interna','A atividade do dia 2 de agosto começará às 19h. Pedimos que a corrente chegue com 30 minutos de antecedência.','Hoje · Iyá Pri','gold'],
        ['Organização','Nova escala de cuidados disponível','As equipes de agosto já estão organizadas. Consulte sua próxima data e confirme a participação.','Ontem · Administração','info'],
        ['Estudos','Material novo na biblioteca','O estudo Fundamentos da Mediunidade recebeu um novo vídeo e material complementar.','18 jul · Iyá Bru','neutral'],
      ].map(([type,title,body,meta,tone],index) => <article className={`member-notice ${index===0?'is-featured':''}`} key={title}><div><Bell size={18} /></div><div><StatusPill tone={tone as 'gold'|'info'|'neutral'}>{type}</StatusPill><h2>{title}</h2><p>{body}</p><span>{meta}</span></div></article>)}</div><div className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Caixa de entrada" title="Resumo" /><dl className="portal-definition-list"><div><dt>Não lidos</dt><dd>2</dd></div><div><dt>Este mês</dt><dd>7</dd></div><div><dt>Importantes</dt><dd>1</dd></div></dl></article><article className="portal-note-card portal-note-card--light"><Bell size={22} /><p>Ative as notificações para não perder mudanças importantes.</p><span>Preferências</span></article></div></section>
    </div>
  );
}
