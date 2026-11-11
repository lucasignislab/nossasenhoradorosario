'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  Check,
  Link2,
  Megaphone,
  MonitorPlay,
  Plus,
  RotateCcw,
  Ticket,
  TicketCheck,
  Trash2,
  X,
} from 'lucide-react';
import {
  callNextTicket,
  createAttendanceSession,
  deleteAttendanceSession,
  deleteTicket,
  setAttendanceSessionStatus,
  updateTicketStatus,
} from '@/app/(auth)/admin/atendimento/actions';
import { PageHeader, PanelHeader, StatusPill } from './PortalUI';
import type { AttendanceSession, AttendanceTicket, PortalEvent } from '@/types';

type EventOption = Pick<PortalEvent, 'id' | 'title' | 'event_date' | 'event_time' | 'category'>;

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
}

function SessionModal({ events, onClose }: { events: EventOption[]; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [eventId, setEventId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const pickEvent = (value: string) => {
    setEventId(value);
    const event = events.find((item) => item.id === value);
    if (event) {
      setTitle((current) => current || `Atendimento — ${event.title}`);
      setSessionDate(event.event_date);
    }
  };

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createAttendanceSession({ title, sessionDate, eventId: eventId || null });
      if (result.ok) onClose();
      else setError(result.error);
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-label="Novo atendimento" onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <h2>Novo atendimento</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}><X size={17} /></button>
        </div>
        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Vincular a uma gira (opcional)</span>
            <select value={eventId} onChange={(change) => pickEvent(change.target.value)}>
              <option value="">Sem vínculo</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {formatDate(event.event_date)} · {event.title}
                </option>
              ))}
            </select>
          </label>
          <label className="portal-field">
            <span>Nome do atendimento *</span>
            <input required minLength={3} maxLength={120} value={title} onChange={(change) => setTitle(change.target.value)} placeholder="Ex.: Atendimento — Gira de Esquerda" autoFocus />
          </label>
          <label className="portal-field">
            <span>Data *</span>
            <input required type="date" value={sessionDate} onChange={(change) => setSessionDate(change.target.value)} />
          </label>
          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>Cancelar</button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              <Check size={15} /> Criar atendimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AttendanceManager({ sessions, tickets, events }: { sessions: AttendanceSession[]; tickets: AttendanceTicket[]; events: EventOption[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(sessions[0]?.id ?? null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = sessions.find((session) => session.id === selectedId) ?? null;
  const sessionTickets = tickets.filter((ticket) => ticket.session_id === selectedId);
  const waiting = sessionTickets.filter((ticket) => ticket.status === 'aguardando');
  const called = sessionTickets.find((ticket) => ticket.status === 'chamado') ?? null;
  const attended = sessionTickets.filter((ticket) => ticket.status === 'atendido');

  const run = (action: () => Promise<{ ok: true } | { ok: false; error: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error);
    });
  };

  const copyLink = async (sessionId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/senha/${sessionId}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleDeleteSession = (session: AttendanceSession) => {
    if (!window.confirm(`Excluir o atendimento "${session.title}" e todas as senhas?`)) return;
    run(() => deleteAttendanceSession(session.id));
  };

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Atendimento"
        title="Senhas da gira"
        description="Distribua senhas por link público (o consulente não precisa de login), chame em tempo real e acompanhe no telão."
        action={<button type="button" className="portal-button portal-button--primary" onClick={() => setCreating(true)}><Plus size={16} /> Novo atendimento</button>}
      />

      <section className="portal-layout portal-layout--overview">
        <article className="portal-panel">
          <PanelHeader eyebrow="Sessões" title="Atendimentos" />
          {sessions.length === 0 ? (
            <p className="portal-panel__copy">Nenhum atendimento criado. Crie o primeiro para distribuir senhas.</p>
          ) : (
            <div className="portal-stack">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  className={`attendance-session${session.id === selectedId ? ' is-active' : ''}`}
                  onClick={() => setSelectedId(session.id)}
                >
                  <Ticket size={17} />
                  <div>
                    <strong>{session.title}</strong>
                    <small>{formatDate(session.session_date)}</small>
                  </div>
                  <StatusPill tone={session.status === 'aberta' ? 'info' : 'neutral'}>{session.status === 'aberta' ? 'Aberta' : 'Encerrada'}</StatusPill>
                </button>
              ))}
            </div>
          )}
        </article>

        <div className="portal-stack">
          {selected ? (
            <>
              <article className="portal-panel portal-panel--accent">
                <PanelHeader eyebrow={formatDate(selected.session_date)} title={selected.title} action={<StatusPill tone={selected.status === 'aberta' ? 'info' : 'neutral'}>{selected.status === 'aberta' ? 'Aberta' : 'Encerrada'}</StatusPill>} />
                <div className="attendance-call">
                  <div className="attendance-call__current">
                    <span>Chamando agora</span>
                    <strong>{called ? String(called.number).padStart(3, '0') : '—'}</strong>
                    <small>{called ? called.visitor_name : 'Nenhuma senha em atendimento'}</small>
                  </div>
                  <button
                    type="button"
                    className="portal-button portal-button--primary"
                    disabled={isPending || selected.status !== 'aberta' || waiting.length === 0}
                    onClick={() => run(() => callNextTicket(selected.id))}
                  >
                    <Megaphone size={16} /> Chamar próxima senha
                  </button>
                </div>
                <div className="portal-row-actions portal-row-actions--inline" style={{ marginTop: 12 }}>
                  <button type="button" className="portal-button portal-button--secondary portal-button--small" onClick={() => copyLink(selected.id)}>
                    <Link2 size={14} /> {copied ? 'Link copiado' : 'Copiar link público'}
                  </button>
                  <a className="portal-button portal-button--secondary portal-button--small" href={`/chamada/${selected.id}`} target="_blank" rel="noopener noreferrer">
                    <MonitorPlay size={14} /> Abrir telão
                  </a>
                  <button
                    type="button"
                    className="portal-button portal-button--secondary portal-button--small"
                    disabled={isPending}
                    onClick={() => run(() => setAttendanceSessionStatus(selected.id, selected.status === 'aberta' ? 'encerrada' : 'aberta'))}
                  >
                    <TicketCheck size={14} /> {selected.status === 'aberta' ? 'Encerrar sessão' : 'Reabrir sessão'}
                  </button>
                  <button type="button" className="portal-text-link" disabled={isPending} onClick={() => handleDeleteSession(selected)}>
                    <Trash2 size={13} /> Excluir
                  </button>
                </div>
                {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
              </article>

              <article className="portal-panel">
                <PanelHeader eyebrow={`${waiting.length} aguardando · ${attended.length} atendidos`} title="Senhas distribuídas" />
                {sessionTickets.length === 0 ? (
                  <p className="portal-panel__copy">Nenhuma senha retirada ainda. Compartilhe o link público com os consulentes.</p>
                ) : (
                  <div className="portal-table-wrap">
                    <table className="portal-table">
                      <thead><tr><th>Senha</th><th>Consulente</th><th>Situação</th><th>Ações</th></tr></thead>
                      <tbody>
                        {sessionTickets.map((ticket) => (
                          <tr key={ticket.id}>
                            <td><strong>{String(ticket.number).padStart(3, '0')}</strong></td>
                            <td>{ticket.visitor_name}</td>
                            <td>
                              <StatusPill tone={ticket.status === 'chamado' ? 'gold' : ticket.status === 'atendido' ? 'info' : ticket.status === 'ausente' ? 'danger' : 'neutral'}>
                                {ticket.status === 'aguardando' ? 'Aguardando' : ticket.status === 'chamado' ? 'Chamado' : ticket.status === 'atendido' ? 'Atendido' : 'Ausente'}
                              </StatusPill>
                            </td>
                            <td>
                              <span className="portal-row-actions portal-row-actions--inline">
                                {ticket.status !== 'atendido' ? (
                                  <button type="button" className="portal-icon-button" aria-label={`Marcar senha ${ticket.number} como atendida`} title="Atendido" disabled={isPending} onClick={() => run(() => updateTicketStatus(ticket.id, 'atendido'))}><Check size={14} /></button>
                                ) : null}
                                {ticket.status === 'aguardando' || ticket.status === 'chamado' ? (
                                  <button type="button" className="portal-icon-button" aria-label={`Marcar senha ${ticket.number} como ausente`} title="Ausente" disabled={isPending} onClick={() => run(() => updateTicketStatus(ticket.id, 'ausente'))}><X size={14} /></button>
                                ) : null}
                                {ticket.status !== 'aguardando' ? (
                                  <button type="button" className="portal-icon-button" aria-label={`Devolver senha ${ticket.number} à fila`} title="Voltar à fila" disabled={isPending} onClick={() => run(() => updateTicketStatus(ticket.id, 'aguardando'))}><RotateCcw size={14} /></button>
                                ) : null}
                                <button type="button" className="portal-icon-button" aria-label={`Remover senha ${ticket.number}`} title="Remover" disabled={isPending} onClick={() => { if (window.confirm(`Remover a senha ${ticket.number} de ${ticket.visitor_name}?`)) run(() => deleteTicket(ticket.id)); }}><Trash2 size={14} /></button>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            </>
          ) : (
            <article className="portal-panel">
              <PanelHeader eyebrow="Atendimento" title="Selecione uma sessão" />
              <p className="portal-panel__copy">Escolha um atendimento na lista ao lado para distribuir e chamar senhas.</p>
            </article>
          )}
        </div>
      </section>

      {creating ? <SessionModal events={events} onClose={() => setCreating(false)} /> : null}
    </div>
  );
}
