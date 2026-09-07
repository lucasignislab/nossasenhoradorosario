import type { EventCardProps } from '@/components/features/event-card';
import type { EventCategory, PortalEvent } from '@/types';

const MONTHS_PT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export const EVENT_CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: 'gira', label: 'Gira' },
  { value: 'festividade', label: 'Festividade' },
  { value: 'acao-social', label: 'Ação Social' },
  { value: 'curso', label: 'Curso & Doutrina' },
];

export function eventCategoryLabel(category: EventCategory): string {
  return EVENT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

/** '2026-07-24' -> { day: '24', month: 'JUL' } sem problemas de fuso horário. */
export function eventDateParts(isoDate: string): { day: string; month: string; weekday: string } {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date
    .toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' })
    .replace('.', '')
    .toUpperCase();
  return { day: String(day).padStart(2, '0'), month: MONTHS_PT[month - 1], weekday };
}

export function formatEventDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/** '19:30:00' -> '19:30'. */
export function formatEventTime(value: string | null): string {
  if (!value) return '—';
  return value.slice(0, 5);
}

export function formatEventDateLong(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

export function toEventCardProps(event: PortalEvent): EventCardProps {
  return {
    title: event.title,
    entity: event.entity ?? eventCategoryLabel(event.category),
    date: formatEventDate(event.event_date),
    time: formatEventTime(event.event_time),
    status: event.status,
    description: event.description ?? undefined,
    imageUrl: event.image_url ?? undefined,
  };
}

/** Data local de hoje no formato YYYY-MM-DD, para comparação com event_date. */
export function todayISODate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
