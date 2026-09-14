'use client';

import { useMemo, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { eventCategoryLabel, eventDateParts, formatEventTime } from '@/lib/events';
import { EventRowActions, NewEventButton } from './EventForm';
import { PanelHeader, StatusPill } from './PortalUI';
import type { PortalEvent } from '@/types';

/**
 * Linha do tempo da agenda administrativa com filtro por mês.
 * Abas: mês vigente + próximos 3 meses (sempre) + qualquer mês com atividade cadastrada.
 * O botão "Nova atividade" cria o evento já no mês selecionado.
 */
export function AgendaTimeline({ events }: { events: PortalEvent[] }) {
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthKeys = useMemo(() => {
    const keys = new Set<string>();
    for (let offset = 0; offset <= 3; offset += 1) {
      const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      keys.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    }
    for (const event of events) keys.add(event.event_date.slice(0, 7));
    return [...keys].sort();
  }, [events, now]);

  const [selected, setSelected] = useState(currentKey);
  const activeKey = monthKeys.includes(selected) ? selected : currentKey;
  const filtered = events.filter((event) => event.event_date.startsWith(activeKey));

  const monthLabel = (key: string) => {
    const [year, month] = key.split('-').map(Number);
    const name = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long' });
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return key === currentKey ? `${capitalized} ${year}` : capitalized;
  };

  return (
    <>
      <div className="portal-calendar-strip">
        {monthKeys.map((key) => (
          <button
            key={key}
            type="button"
            className={key === activeKey ? 'is-active' : ''}
            onClick={() => setSelected(key)}
          >
            {monthLabel(key)}
          </button>
        ))}
      </div>
      <PanelHeader
        eyebrow="Atividades cadastradas"
        title="Linha do tempo"
        action={<NewEventButton defaultMonth={activeKey} label={`Nova atividade em ${monthLabel(activeKey).toLowerCase()}`} />}
      />
      {filtered.length === 0 ? (
        <p className="portal-panel__copy">Nenhuma atividade em {monthLabel(activeKey).toLowerCase()} — use o botão acima para cadastrar a primeira.</p>
      ) : (
        <div className="portal-timeline">
          {filtered.map((event) => {
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
    </>
  );
}
