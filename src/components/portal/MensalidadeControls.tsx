'use client';

import { useRef, useState, useTransition } from 'react';
import { CircleDollarSign, Copy, UploadCloud } from 'lucide-react';
import { registerMensalidade, submitMensalidadeReceipt } from '@/app/(auth)/dashboard/financeiro/actions';
import { MENSALIDADE_MAX_CENTS, MENSALIDADE_MIN_CENTS, parseBRLToCents } from '@/lib/finance';
import { createClient } from '@/lib/supabase/client';

/** Formulário do membro: registra a mensalidade do mês com o valor que vai pagar. */
export function RegisterMensalidadeForm({ defaultMonth }: { defaultMonth: string }) {
  const [month, setMonth] = useState(defaultMonth);
  const [amount, setAmount] = useState('');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cents = parseBRLToCents(amount);
    if (!cents || cents < MENSALIDADE_MIN_CENTS || cents > MENSALIDADE_MAX_CENTS) {
      setFeedback({ kind: 'error', message: 'O valor precisa estar entre R$ 70,00 e R$ 100,00.' });
      return;
    }
    setFeedback(null);
    startTransition(async () => {
      const result = await registerMensalidade(month, amount);
      setFeedback(result.ok
        ? { kind: 'ok', message: 'Mensalidade registrada. Agora pague via Pix e envie o comprovante.' }
        : { kind: 'error', message: result.error });
      if (result.ok) setAmount('');
    });
  };

  return (
    <form onSubmit={submit} className="portal-form">
      <label className="portal-field">
        <span>Mês de referência *</span>
        <input type="month" required value={month} onChange={(change) => setMonth(change.target.value)} />
      </label>
      <label className="portal-field">
        <span>Valor que você vai pagar (R$ 70 a R$ 100) *</span>
        <input required inputMode="decimal" placeholder="Ex.: 90,00" value={amount} onChange={(change) => setAmount(change.target.value)} />
      </label>
      {feedback ? (
        <p className={feedback.kind === 'ok' ? 'portal-action-success' : 'portal-action-error'} role="status">
          {feedback.message}
        </p>
      ) : null}
      <div className="portal-row-actions portal-row-actions--inline">
        <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
          <CircleDollarSign size={15} /> Registrar mensalidade
        </button>
      </div>
    </form>
  );
}

/** Envio do comprovante: sobe o arquivo no bucket e marca a mensalidade como paga. */
export function ReceiptUploadButton({ entryId, monthLabel }: { entryId: string; monthLabel: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('O comprovante pode ter no máximo 5 MB.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Sessão expirada. Entre novamente.');
        return;
      }
      const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const path = `${user.id}/${entryId}-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('comprovantes').upload(path, file);
      if (uploadError) {
        setError('Não foi possível enviar o arquivo. Tente novamente.');
        return;
      }
      const result = await submitMensalidadeReceipt(entryId, path);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="portal-file-input"
        aria-label={`Enviar comprovante de ${monthLabel}`}
        onChange={(change) => handleFile(change.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        className="portal-button portal-button--primary portal-button--small"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud size={14} /> {isPending ? 'Enviando…' : 'Enviar comprovante'}
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}

/** Copia a chave Pix da casa para a área de transferência. */
export function CopyPixKeyButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('tsenhoradorosario@gmail.com');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="portal-button portal-button--secondary" onClick={copy}>
      <Copy size={15} /> {copied ? 'Chave copiada' : 'Copiar chave'}
    </button>
  );
}
