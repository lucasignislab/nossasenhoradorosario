import type { PortalEvent } from '@/types';

/** Janela de auto-registro: das 00h às 23h59 do próprio dia da atividade. */
export function attendanceWindowOpen(event: Pick<PortalEvent, 'event_date' | 'event_time'>, now = new Date()): boolean {
  const [year, month, day] = event.event_date.split('-').map(Number);
  const dayStart = new Date(year, month - 1, day, 0, 0, 0);
  const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999);
  return now >= dayStart && now <= dayEnd;
}

export function attendanceStatusLabel(record: { present: boolean; justified: boolean }): string {
  if (record.present) return 'Presença registrada';
  return record.justified ? 'Falta justificada' : 'Falta registrada';
}
