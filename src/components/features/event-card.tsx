'use client';

import React from 'react';
import { Calendar, Clock, Check, X } from 'lucide-react';

export interface EventCardProps {
  entity: string;
  title: string;
  date: string;
  time: string;
  status: 'confirmada' | 'cancelada';
  description?: string;
  imageUrl?: string; // Flyer background
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
  onClick,
}: EventCardProps) => {
  const isConfirmed = status === 'confirmada';

  return (
    <div
      onClick={onClick}
      className={`relative group overflow-hidden rounded-md border border-black/5 hover:border-[var(--color-sacred-gold)]/30 transition-all duration-500 ease-out shadow-md hover:shadow-2xl flex flex-col justify-between min-h-[350px] p-6 ${
        !isConfirmed ? 'opacity-60' : ''
      }`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="article"
    >
      {/* Background Image / Flyer */}
      {imageUrl ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
          {/* Dark gradient overlay for typography readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25 pointer-events-none" />
        </div>
      ) : (
        /* Fallback dark background if no image is present */
        <div className="absolute inset-0 bg-[#0D0B08] z-0" />
      )}

      {/* Top Bar (z-10) */}
      <div className="relative z-10 flex justify-between items-start w-full">
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-sacred-gold)] font-inter bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-white/5">
          {entity}
        </span>
        <span 
          className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm border backdrop-blur-xs ${
            isConfirmed 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {isConfirmed ? <Check size={10} /> : <X size={10} />}
          {isConfirmed ? 'Confirmada' : 'Cancelada'}
        </span>
      </div>

      {/* Bottom Content (z-10) */}
      <div className="relative z-10 w-full mt-auto">
        <h3 className="text-2xl md:text-3xl font-normal text-white font-[var(--font-heading)] leading-tight tracking-wide mb-3">
          {title}
        </h3>
        
        {description && (
          <p className="text-xs text-[#FAF5EC]/70 font-inter leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Separator */}
        <div className="w-full h-[1px] bg-white/10 mb-4" />

        {/* Footer Info */}
        <div className="flex gap-4 text-xs text-[#FAF5EC]/85 font-inter">
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
