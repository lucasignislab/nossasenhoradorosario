'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { Copy, HeartHandshake, Loader2, QrCode } from 'lucide-react';
import { buildPixPayload, PIX_KEY } from '@/lib/pix';
import { createClient } from '@/lib/supabase/client';

/** QR Code Pix (BR Code) com valor opcional, cópia da chave e aviso de doação. */
export function PixDonation({ allowNotify = false }: { allowNotify?: boolean }) {
  const [amountInput, setAmountInput] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<'key' | 'payload' | null>(null);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const amountCents = useMemo(() => {
    const normalized = amountInput.replace(/[^\d,\.]/g, '').replace('.', ',');
    const parts = normalized.split(',');
    const reais = parseInt(parts[0] || '0', 10);
    const centavos = parseInt((parts[1] ?? '0').padEnd(2, '0').slice(0, 2), 10);
    const total = reais * 100 + (Number.isNaN(centavos) ? 0 : centavos);
    return total > 0 ? total : null;
  }, [amountInput]);

  const payload = useMemo(
    () => buildPixPayload(amountCents ? { amount: amountCents / 100, txId: 'DOACAO' } : { txId: 'DOACAO' }),
    [amountCents],
  );

  useEffect(() => {
    let cancelled = false;
    import('qrcode').then((QRCode) =>
      QRCode.toDataURL(payload, { width: 320, margin: 1 }).then((url) => {
        if (!cancelled) setQrUrl(url);
      }),
    );
    return () => { cancelled = true; };
  }, [payload]);

  const copy = async (value: string, which: 'key' | 'payload') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      setCopied(null);
    }
  };

  const notify = (event: React.FormEvent) => {
    event.preventDefault();
    if (!amountCents) {
      setFeedback({ kind: 'error', message: 'Informe o valor da doação para avisar a casa.' });
      return;
    }
    setFeedback(null);
    startTransition(async () => {
      const supabase = createClient();
      const donor = name.trim() || 'Doador(a) anônimo(a)';
      const { error } = await supabase.from('finance_entries').insert({
        type: 'entrada',
        category: 'doacao',
        description: `Doação via Pix — ${donor}`,
        amount_cents: amountCents,
        entry_date: new Date().toISOString().slice(0, 10),
        status: 'pendente',
      });
      setFeedback(error
        ? { kind: 'error', message: 'Não foi possível registrar o aviso agora. Sua doação via Pix já vale — obrigado!' }
        : { kind: 'ok', message: 'Aviso enviado! A administração vai confirmar o recebimento. Axé!' });
      if (!error) setName('');
    });
  };

  return (
    <div className="pix-donation">
      <div className="pix-donation__qr" aria-label="QR Code Pix para doação">
        {qrUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrUrl} alt="QR Code Pix da casa" width={200} height={200} />
        ) : (
          <QrCode size={48} aria-hidden />
        )}
      </div>

      <label className="portal-field pix-donation__amount">
        <span>Valor da doação (opcional)</span>
        <input inputMode="decimal" placeholder="Ex.: 50,00" value={amountInput} onChange={(change) => setAmountInput(change.target.value)} />
      </label>

      <div className="portal-row-actions portal-row-actions--inline">
        <button type="button" className="portal-button portal-button--secondary" onClick={() => copy(PIX_KEY, 'key')}>
          <Copy size={14} /> {copied === 'key' ? 'Chave copiada' : 'Copiar chave Pix'}
        </button>
        <button type="button" className="portal-button portal-button--secondary" onClick={() => copy(payload, 'payload')}>
          <Copy size={14} /> {copied === 'payload' ? 'Código copiado' : 'Pix copia e cola'}
        </button>
      </div>

      {allowNotify ? (
        <form onSubmit={notify} className="portal-form pix-donation__notify">
          <label className="portal-field">
            <span>Seu nome (opcional)</span>
            <input maxLength={120} placeholder="Como devemos agradecer?" value={name} onChange={(change) => setName(change.target.value)} />
          </label>
          {feedback ? (
            <p className={feedback.kind === 'ok' ? 'portal-action-success' : 'portal-action-error'} role="status">{feedback.message}</p>
          ) : null}
          <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
            {isPending ? <Loader2 size={15} className="is-spinning" /> : <HeartHandshake size={15} />} {isPending ? 'Enviando…' : 'Avisar a casa sobre a doação'}
          </button>
        </form>
      ) : null}
    </div>
  );
}
