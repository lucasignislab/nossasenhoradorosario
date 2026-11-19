/**
 * Padronização de telefone/WhatsApp: DDD sempre entre parênteses.
 * 11 dígitos → (19) 99999-0000 · 10 dígitos → (19) 3222-0000.
 * Valores fora desse padrão são devolvidos como estavam (apenas trim).
 */
export function formatPhone(value: string | null | undefined): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return value.trim();
}

/** Versão para exibição com fallback. */
export function formatPhoneOrDash(value: string | null | undefined): string {
  return formatPhone(value) || '—';
}
