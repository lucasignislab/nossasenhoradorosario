'use client';

import { Calendar, Clock, Check, X } from 'lucide-react';

export interface EventCardProps {
  entity: string;
  title: string;
  date: string;
  time: string;
  status: 'confirmada' | 'cancelada';
  description?: string;
  imageUrl?: string; // Flyer background
  /** Gira do mês corrente já realizada (data anterior a hoje). */
  past?: boolean;
  onClick?: () => void;
}

export const EventCard = ({
  entity,
  title,
  date,
  time,
  status,
  description,
  imageUrl,
  past = false,
  onClick,
}: EventCardProps) => {
  const isConfirmed = status === 'confirmada';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      className={`relative group overflow-hidden rounded-md border border-black/5 hover:border-[var(--color-sacred-gold)]/30 transition-all duration-500 ease-out shadow-md hover:shadow-2xl flex flex-col bg-white ${
        !isConfirmed ? 'opacity-60' : ''
      } ${onClick ? 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-sacred-gold)]' : ''}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : 'article'}
    >
      {/* Arte do evento — formato de post do feed do Instagram (4:5), sempre inteira */}
      {imageUrl ? (
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#0D0B08]">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] ${past ? 'opacity-80 saturate-[0.85]' : ''}`}
          />
        </div>
      ) : (
        /* Fallback dark background if no image is present */
        <div className="relative w-full aspect-[4/5] bg-[#0D0B08] flex items-center justify-center">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter">
            {entity}
          </span>
        </div>
      )}

      {/* Informações abaixo da arte — nada sobreposto à imagem */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex justify-between items-center gap-3">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter">
            {entity}
          </span>
          {past && isConfirmed ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm border bg-neutral-500/10 border-neutral-500/20 text-neutral-500">
              <Check size={10} />
              Realizada
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm border ${
                isConfirmed
                  ? 'bg-green-500/10 border-green-500/20 text-green-700'
                  : 'bg-red-500/10 border-red-500/20 text-red-700'
              }`}
            >
              {isConfirmed ? <Check size={10} /> : <X size={10} />}
              {isConfirmed ? 'Confirmada' : 'Cancelada'}
            </span>
          )}
        </div>

        <h3 className="text-xl md:text-2xl font-normal text-[#0D0B08] font-[var(--font-heading)] leading-tight tracking-wide">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-neutral-500 font-inter leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Separator */}
        <div className="w-full h-[1px] bg-black/8" />

        {/* Footer Info */}
        <div className="flex gap-4 text-xs text-neutral-600 font-inter">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={12} className="text-[var(--color-sacred-gold)]" /> {date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} className="text-[var(--color-sacred-gold)]" /> {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
