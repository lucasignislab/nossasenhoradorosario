import type { PortalEvent } from '@/types';

/** Janela de auto-registro: das 00h do dia da atividade até 24h após o início. */
export function attendanceWindowOpen(event: Pick<PortalEvent, 'event_date' | 'event_time'>, now = new Date()): boolean {
  const [year, month, day] = event.event_date.split('-').map(Number);
  const dayStart = new Date(year, month - 1, day, 0, 0, 0);
  const [hours = 0, minutes = 0] = (event.event_time ?? '00:00').split(':').map(Number);
  const eventStart = new Date(year, month - 1, day, hours, minutes);
  const windowEnd = new Date(eventStart.getTime() + 24 * 60 * 60 * 1000);
  return now >= dayStart && now <= windowEnd;
}

export function attendanceStatusLabel(record: { present: boolean; justified: boolean }): string {
  if (record.present) return 'Presença registrada';
  return record.justified ? 'Falta justificada' : 'Falta registrada';
}
