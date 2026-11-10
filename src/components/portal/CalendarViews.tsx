'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Copy } from 'lucide-react';
import { PanelHeader, StatusPill } from './PortalUI';
import { EventConfirmationButton } from './EventConfirmationButton';
import { SelfAttendanceControls } from './SelfAttendanceControls';
import type { MemberSelfAttendanceMap } from './MemberViews';
import {
  buildCalendarWeeks,
  buildGoogleCalendarUrl,
  calendarMonthTitle,
  calendarWeekdays,
} from '@/lib/calendar';
import { formatEventDateLong, formatEventTime } from '@/lib/events';
import type { PortalEvent } from '@/types';

const CATEGORY_LABEL: Record<string, string> = {
  gira: 'Gira',
  festividade: 'Festividade',
  'acao-social': 'Ação social',
  curso: 'Curso',
};

type MemberCalendarProps = {
  events: PortalEvent[];
  confirmedEventIds: string[];
  selfAttendance: MemberSelfAttendanceMap;
};

export function MemberCalendar({ events, confirmedEventIds, selfAttendance }: MemberCalendarProps) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState<string>(() => {
    // Dia de hoje, ou o dia da próxima atividade se hoje não tiver nada.
    const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return events.find((event) => event.event_date === todayISO)?.event_date
      ?? events.find((event) => event.event_date >= todayISO)?.event_date
      ?? todayISO;
  });
  const [copied, setCopied] = useState(false);

  const weeks = useMemo(
    () => buildCalendarWeeks(view.year, view.month, events),
    [view, events],
  );

  const confirmed = new Set(confirmedEventIds);
  const selectedEvents = events.filter((event) => event.event_date === selected);

  const move = (delta: number) => {
    setView((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const copyFeedUrl = async () => {
    const url = `${window.location.origin}/api/calendario`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copie o endereço do calendário:', url);
    }
  };

  return (
    <>
      <article className="portal-panel">
        <PanelHeader eyebrow="Calendário" title={calendarMonthTitle(view.year, view.month)} />
        <div className="portal-calendar__nav">
          <button type="button" className="portal-icon-button" aria-label="Mês anterior" onClick={() => move(-1)}>
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            className="portal-button portal-button--secondary"
            onClick={() => setView({ year: now.getFullYear(), month: now.getMonth() })}
          >
            Hoje
          </button>
          <button type="button" className="portal-icon-button" aria-label="Próximo mês" onClick={() => move(1)}>
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="portal-calendar" role="grid" aria-label={`Calendário de ${calendarMonthTitle(view.year, view.month)}`}>
          {calendarWeekdays().map((weekday) => (
            <span key={weekday} className="portal-calendar__weekday">{weekday}</span>
          ))}
          {weeks.flat().map((day) => (
            <button
              key={day.iso}
              type="button"
              role="gridcell"
              aria-selected={day.iso === selected}
              className={[
                'portal-calendar__day',
                day.inMonth ? '' : 'is-outside',
                day.isToday ? 'is-today' : '',
                day.iso === selected ? 'is-selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelected(day.iso)}
            >
              <span>{day.day}</span>
              {day.events.length > 0 ? (
                <i className="portal-calendar__dots">
                  {day.events.slice(0, 3).map((event) => (
                    <b key={event.id} className={`is-${event.category}`} title={event.title} />
                  ))}
                  {day.events.length > 3 ? <em>+{day.events.length - 3}</em> : null}
                </i>
              ) : null}
            </button>
          ))}
        </div>

        <div className="portal-calendar__legend">
          {Object.entries(CATEGORY_LABEL).map(([category, label]) => (
            <span key={label}><b className={`is-${category}`} /> {label}</span>
          ))}
        </div>
      </article>

      <article className="portal-panel">
        <PanelHeader eyebrow={formatEventDateLong(selected)} title="Atividades do dia" />
        {selectedEvents.length === 0 ? (
          <p className="portal-panel__copy">Nenhuma atividade neste dia.</p>
        ) : (
          <div className="member-agenda-list">
            {selectedEvents.map((event) => {
              const parts = event.event_date.split('-');
              return (
                <div key={event.id}>
                  <span><strong>{parts[2]}</strong><small>{formatEventDateLong(event.event_date).split(' de ')[1]?.slice(0, 3)}</small></span>
                  <div>
                    <StatusPill tone={confirmed.has(event.id) ? 'info' : 'neutral'}>
                      {confirmed.has(event.id) ? 'Presença confirmada' : CATEGORY_LABEL[event.category] ?? event.category}
                    </StatusPill>
                    <h3>{event.title}</h3>
                    <p><Clock3 size={13} /> {formatEventTime(event.event_time)} · {event.location}{event.entity ? ` · ${event.entity}` : ''}</p>
                    <div className="portal-calendar__day-actions">
                      <EventConfirmationButton eventId={event.id} confirmed={confirmed.has(event.id)} />
                      <a
                        className="portal-text-link"
                        href={buildGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CalendarDays size={13} /> Salvar no Google Agenda
                      </a>
                    </div>
                    {selfAttendance[event.id] ? (
                      <SelfAttendanceControls
                        eventId={event.id}
                        current={selfAttendance[event.id].record}
                        windowOpen={selfAttendance[event.id].windowOpen}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>

      <article className="portal-note-card portal-note-card--light">
        <CalendarDays size={22} />
        <p>
          Assine uma vez e as giras aparecem sozinhas no seu calendário pessoal: no <strong>Google Agenda</strong>,
          use &ldquo;Outros calendários → Adicionar por URL&rdquo;; no <strong>Apple Calendar</strong>, &ldquo;Arquivo → Nova assinatura de calendário&rdquo;.
        </p>
        <button type="button" className="portal-button portal-button--secondary" onClick={copyFeedUrl}>
          <Copy size={14} /> {copied ? 'Endereço copiado!' : 'Copiar endereço da assinatura'}
        </button>
        <span>Google Agenda · Apple Calendar</span>
      </article>
    </>
  );
}
