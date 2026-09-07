import type { Tone } from '@/components/portal/PortalUI';
import type { CleaningShiftKind } from '@/types';

export const CLEANING_SHIFT_MIN = 7;
export const CLEANING_SHIFT_MAX = 9;

export function cleaningKindLabel(kind: CleaningShiftKind): string {
  return kind === 'saturday' ? 'Sábado' : 'Quinta';
}

/** Situação da escala conforme o número de inscritos. */
export function cleaningShiftStatus(count: number): { label: string; tone: Tone } {
  if (count >= CLEANING_SHIFT_MAX) return { label: 'Lotada', tone: 'neutral' };
  if (count >= CLEANING_SHIFT_MIN) return { label: 'Completa', tone: 'info' };
  const missing = CLEANING_SHIFT_MIN - count;
  return { label: missing === 1 ? 'Falta 1 pessoa' : `Faltam ${missing} pessoas`, tone: 'warning' };
}

/** Último sábado do mês (YYYY-MM → YYYY-MM-DD), para sugerir no ajuste da administração. */
export function lastSaturdayOfMonth(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year, monthNumber, 0));
  const weekday = lastDay.getUTCDay(); // 6 = sábado
  lastDay.setUTCDate(lastDay.getUTCDate() - ((weekday + 1) % 7));
  return lastDay.toISOString().slice(0, 10);
}
