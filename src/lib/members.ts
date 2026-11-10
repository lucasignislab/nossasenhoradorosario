import type { Profile, ProfileRole, ProfileStatus } from '@/types';

export function roleLabel(role: ProfileRole): string {
  if (role === 'admin') return 'Administração';
  if (role === 'developer') return 'Acesso técnico';
  if (role === 'editor') return 'Comunicação';
  return 'Filho(a) da casa';
}

export function statusPresentation(status: ProfileStatus): { label: string; tone: 'info' | 'warning' | 'danger' } {
  if (status === 'active') return { label: 'Ativo', tone: 'info' };
  if (status === 'pending') return { label: 'Aguardando', tone: 'warning' };
  return { label: 'Suspenso', tone: 'danger' };
}

export function formatJoinedAt(value: string | null): string {
  if (!value) return '—';
  // Datas 'YYYY-MM-DD' sem hora são interpretadas como UTC; ao meio-dia local
  // evita o recuo para o dia anterior no fuso de São Paulo.
  const raw = value.length === 10 ? `${value}T12:00:00` : value;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR');
}

export function profileDisplayName(profile: Profile): string {
  return profile.full_name?.trim() || 'Sem nome';
}

export function profileInitial(profile: Profile): string {
  return profileDisplayName(profile).charAt(0).toUpperCase();
}
