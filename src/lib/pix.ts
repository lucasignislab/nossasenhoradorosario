/** Geração de payload Pix "copia e cola" (BR Code / EMV) com CRC16-CCITT. */

export const PIX_KEY = 'tsenhoradorosario@gmail.com';
export const PIX_RECEIVER_NAME = 'TERREIRO SENHORA DO ROSARIO';
export const PIX_RECEIVER_CITY = 'CAMPINAS';

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function field(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

function sanitize(value: string, max: number): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9 ]/g, '').trim().slice(0, max).toUpperCase();
}

/** Monta o payload EMV do Pix. Valor em reais opcional (QR estático sem valor). */
export function buildPixPayload(options?: { amount?: number; txId?: string }): string {
  const gui = field('00', 'br.gov.bcb.pix') + field('01', PIX_KEY);
  const merchantAccount = field('26', gui);
  const parts = [
    field('00', '01'),
    merchantAccount,
    field('52', '0000'),
    field('53', '986'), // BRL
  ];
  if (options?.amount && options.amount > 0) {
    parts.push(field('54', options.amount.toFixed(2)));
  }
  parts.push(field('58', 'BR'));
  parts.push(field('59', sanitize(PIX_RECEIVER_NAME, 25)));
  parts.push(field('60', sanitize(PIX_RECEIVER_CITY, 15)));
  parts.push(field('62', field('05', (options?.txId ?? '***').replace(/[^A-Za-z0-9*]/g, '').slice(0, 25) || '***')));
  const withoutCrc = `${parts.join('')}6304`;
  return `${withoutCrc}${crc16(withoutCrc)}`;
}
