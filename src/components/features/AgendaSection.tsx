'use client';

import React from 'react';
import Link from 'next/link';
import { EventCard, type EventCardProps } from './event-card';
import { Calendar } from 'lucide-react';

export interface AgendaSectionProps {
  /** Lista de eventos a exibir (máximo 3) */
  events: EventCardProps[];
  /** Título da seção */
  title?: string;
  /** Callback ao clicar em um evento */
  onEventClick?: (event: EventCardProps) => void;
  /** Texto para empty state */
  emptyStateText?: string;
  /** Mostrar botão "Ver Todas as Giras" */
  showViewAllButton?: boolean;
  /** Callback para ver todas as giras */
  onViewAllClick?: () => void;
}

export const AgendaSection = ({
  events,
  title = 'Próximas Giras',
  onEventClick,
  emptyStateText = 'Nenhuma gira agendada no momento. Volte em breve!',
  showViewAllButton = true,
  onViewAllClick,
}: AgendaSectionProps) => {
  return (
    <section className="py-32 md:py-40 bg-[#FAF5EC]" id="agenda">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[#6F6F6F] mb-4 font-inter">
            Agenda de Trabalhos
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-8 font-[var(--font-heading)] leading-[0.95] tracking-tight">
            {title}
          </h2>
          {/* Divisor minimalista fino */}
          <div className="w-16 h-[1px] bg-black/15 mx-auto" />
        </div>

        {events && events.length > 0 ? (
          <>
            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
              {events.map((event, index) => (
                <div
                  key={`${event.title}-${event.date}-${index}`}
                  className="transition-transform duration-300 hover:-translate-y-1"
                  onClick={onEventClick ? () => onEventClick(event) : undefined}
                  role="listitem"
                >
                  {onEventClick ? (
                    <EventCard {...event} />
                  ) : (
                    <Link href="/agenda" className="block w-full h-full">
                      <EventCard {...event} onClick={undefined} />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Footer View All Button */}
            {showViewAllButton && (
              <div className="flex justify-center mt-16 pt-12 border-t border-black/5">
                {onViewAllClick ? (
                  <button
                    className="rounded-full px-8 py-3.5 text-xs font-semibold bg-black text-white hover:scale-[1.03] transition-all duration-300 font-inter uppercase tracking-[0.15em] shadow-md hover:shadow-lg cursor-pointer"
                    onClick={onViewAllClick}
                    type="button"
                  >
                    Ver Todas as Giras →
                  </button>
                ) : (
                  <Link
                    href="/agenda"
                    className="rounded-full px-8 py-3.5 text-xs font-semibold bg-black text-white hover:scale-[1.03] transition-all duration-300 font-inter uppercase tracking-[0.15em] shadow-md hover:shadow-lg cursor-pointer inline-block text-center"
                  >
                    Ver Todas as Giras →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-6 bg-white border border-dashed border-black/10 rounded-lg max-w-2xl mx-auto shadow-sm">
            <Calendar size={48} className="mx-auto mb-4 text-[var(--color-sacred-gold)] opacity-60" />
            <p className="text-base text-[#6F6F6F] font-inter leading-relaxed">{emptyStateText}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgendaSection;
