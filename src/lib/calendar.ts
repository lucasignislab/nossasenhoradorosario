import type { PortalEvent } from '@/types';

// ---------- Grade mensal ----------

export type CalendarDay = {
  /** 'YYYY-MM-DD' */
  iso: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  events: PortalEvent[];
};

const WEEKDAY_SHORT_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function calendarWeekdays(): string[] {
  return WEEKDAY_SHORT_PT;
}

export function calendarMonthTitle(year: number, month: number): string {
  const title = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/** Grade de semanas (segunda a domingo) do mês, com os eventos distribuídos por dia. */
export function buildCalendarWeeks(year: number, month: number, events: PortalEvent[]): CalendarDay[][] {
  const byDate = new Map<string, PortalEvent[]>();
  for (const event of events) {
    const list = byDate.get(event.event_date) ?? [];
    list.push(event);
    byDate.set(event.event_date, list);
  }

  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const first = new Date(year, month, 1);
  // Segunda-feira da semana que abre o mês (getDay: 0=dom … 6=sáb).
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);

  const weeks: CalendarDay[][] = [];
  const cursor = new Date(start);
  // Sempre 6 semanas para a grade não "pular" entre meses.
  for (let week = 0; week < 6; week += 1) {
    const days: CalendarDay[] = [];
    for (let weekday = 0; weekday < 7; weekday += 1) {
      const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      days.push({
        iso,
        day: cursor.getDate(),
        inMonth: cursor.getMonth() === month,
        isToday: iso === todayISO,
        events: byDate.get(iso) ?? [],
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(days);
  }
  return weeks;
}

// ---------- Exportar para o calendário pessoal ----------

function icsEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** '2026-09-11' + '19:30:00' → '20260911T223000Z' (São Paulo = UTC-3 fixo, sem horário de verão). */
export function toIcsUtc(eventDate: string, eventTime: string | null): string {
  const [year, month, day] = eventDate.split('-').map(Number);
  const [hour, minute] = (eventTime ?? '00:00:00').split(':').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, hour + 3, minute));
  return `${utc.getUTCFullYear()}${pad(utc.getUTCMonth() + 1)}${pad(utc.getUTCDate())}T${pad(utc.getUTCHours())}${pad(utc.getUTCMinutes())}00Z`;
}

export function buildGoogleCalendarUrl(event: PortalEvent): string {
  const start = toIcsUtc(event.event_date, event.event_time);
  // Duração padrão de 3h quando há horário; dia inteiro quando não há.
  const end = event.event_time
    ? toIcsUtc(event.event_date, `${pad(Number(event.event_time.split(':')[0]) + 3)}:${event.event_time.split(':')[1]}:00`)
    : toIcsUtc(event.event_date, null);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    location: event.location,
    details: [event.entity, event.description].filter(Boolean).join(' · '),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Feed ICS com todas as atividades confirmadas (assinatura Google/Apple). */
export function buildCalendarFeed(events: PortalEvent[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//T. U. Senhora do Rosário//Agenda//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:T. U. Senhora do Rosário',
    'X-WR-TIMEZONE:America/Sao_Paulo',
  ];
  for (const event of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@senhoradorosario`,
      `DTSTAMP:${toIcsUtc(event.created_at.slice(0, 10), event.created_at.slice(11, 19))}`,
      `DTSTART:${toIcsUtc(event.event_date, event.event_time)}`,
      `SUMMARY:${icsEscape(event.title)}`,
      `LOCATION:${icsEscape(event.location)}`,
      `DESCRIPTION:${icsEscape([event.entity, event.description].filter(Boolean).join(' · '))}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
