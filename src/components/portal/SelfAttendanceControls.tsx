'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, PenLine } from 'lucide-react';
import { registerOwnAttendance } from '@/app/(auth)/dashboard/frequencia/actions';
import { StatusPill } from './PortalUI';
import { attendanceStatusLabel } from '@/lib/attendance';

export type SelfAttendanceRecord = {
  present: boolean;
  justified: boolean;
  notes?: string | null;
};

/** Auto-registro de frequência do próprio membro (vale como oficial). */
export function SelfAttendanceControls({
  eventId,
  current,
  windowOpen,
  showWhenClosed = false,
}: {
  eventId: string;
  current: SelfAttendanceRecord | null;
  windowOpen: boolean;
  /** Quando true, mostra os botões desabilitados fora da janela (para o membro já ver onde registrará). */
  showWhenClosed?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [justifying, setJustifying] = useState(false);
  const [note, setNote] = useState(current?.notes ?? '');

  const submit = (mark: 'present' | 'justified') => {
    setError(null);
    startTransition(async () => {
      const result = await registerOwnAttendance(eventId, mark, mark === 'justified' ? note : undefined);
      if (!result.ok) {
        setError(result.error);
      } else {
        setJustifying(false);
      }
    });
  };

  // Fora da janela (antes do dia ou após as 23h59 do dia): só consulta,
  // ou botões desabilitados quando showWhenClosed está ativo.
  if (!windowOpen) {
    if (current) return <StatusPill tone={current.present ? 'info' : current.justified ? 'warning' : 'danger'}>{attendanceStatusLabel(current)}</StatusPill>;
    if (!showWhenClosed) return null;
    return (
      <span className="portal-self-attendance">
        <span className="portal-row-actions portal-row-actions--inline">
          <button type="button" className="portal-button portal-button--primary portal-button--small" disabled>
            <CheckCircle2 size={14} /> Registrar presença
          </button>
          <button type="button" className="portal-button portal-button--secondary portal-button--small" disabled>
            <PenLine size={14} /> Justificar falta
          </button>
        </span>
        <span className="portal-action-note">Disponível no dia da atividade, até 23h59.</span>
      </span>
    );
  }

  if (justifying) {
    return (
      <span className="portal-self-attendance">
        <label className="portal-field">
          <span>Motivo da falta (opcional)</span>
          <textarea rows={2} value={note} onChange={(change) => setNote(change.target.value)} placeholder="Ex.: trabalho, saúde, viagem" />
        </label>
        <span className="portal-row-actions portal-row-actions--inline">
          <button type="button" className="portal-button portal-button--primary portal-button--small" disabled={isPending} onClick={() => submit('justified')}>
            <PenLine size={14} /> Salvar justificativa
          </button>
          <button type="button" className="portal-button portal-button--secondary portal-button--small" disabled={isPending} onClick={() => setJustifying(false)}>
            Voltar
          </button>
        </span>
        {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
      </span>
    );
  }

  return (
    <span className="portal-self-attendance">
      {current ? <StatusPill tone={current.present ? 'info' : 'warning'}>{attendanceStatusLabel(current)}</StatusPill> : null}
      <span className="portal-row-actions portal-row-actions--inline">
        <button
          type="button"
          className={`portal-button ${current?.present ? 'portal-button--secondary' : 'portal-button--primary'} portal-button--small`}
          disabled={isPending}
          onClick={() => submit('present')}
        >
          <CheckCircle2 size={14} /> {current?.present ? 'Presença registrada' : 'Registrar presença'}
        </button>
        <button
          type="button"
          className="portal-button portal-button--secondary portal-button--small"
          disabled={isPending}
          onClick={() => setJustifying(true)}
        >
          <PenLine size={14} /> {current && !current.present ? 'Editar justificativa' : 'Justificar falta'}
        </button>
      </span>
      {current ? <span className="portal-action-note">Você pode corrigir até às 23h59 de hoje.</span> : null}
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}
