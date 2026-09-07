import type { ContentKind } from '@/types';

export const NOTICE_CATEGORY_OPTIONS = [
  { value: 'geral', label: 'Geral' },
  { value: 'espiritual', label: 'Espiritual' },
  { value: 'operacional', label: 'Operacional' },
  { value: 'evento', label: 'Evento' },
];

export function noticeCategoryLabel(category: string): string {
  return NOTICE_CATEGORY_OPTIONS.find((option) => option.value === category)?.label
    ?? category.charAt(0).toUpperCase() + category.slice(1);
}

export const CONTENT_KIND_OPTIONS: { value: ContentKind; label: string }[] = [
  { value: 'video', label: 'Vídeo' },
  { value: 'artigo', label: 'Artigo' },
  { value: 'documento', label: 'Documento' },
];

export function contentKindLabel(kind: ContentKind): string {
  return CONTENT_KIND_OPTIONS.find((option) => option.value === kind)?.label ?? kind;
}

/** Data relativa em pt-BR ('há 3 dias'); recua para data absoluta após 30 dias. */
export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays <= 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`;
  }
  return date.toLocaleDateString('pt-BR');
}

export function formatDuration(minutes: number | null): string {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours}h ${rest}min` : `${hours}h`;
}
