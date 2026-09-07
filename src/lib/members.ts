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
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR');
}

export function profileDisplayName(profile: Profile): string {
  return profile.full_name?.trim() || 'Sem nome';
}

export function profileInitial(profile: Profile): string {
  return profileDisplayName(profile).charAt(0).toUpperCase();
}
