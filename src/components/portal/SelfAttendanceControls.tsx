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
}: {
  eventId: string;
  current: SelfAttendanceRecord | null;
  windowOpen: boolean;
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

  // Fora da janela (antes do dia ou mais de 24h após o início): só consulta.
  if (!windowOpen) {
    return current ? <StatusPill tone={current.present ? 'info' : current.justified ? 'warning' : 'danger'}>{attendanceStatusLabel(current)}</StatusPill> : null;
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
      {current ? <span className="portal-action-note">Você pode corrigir até 24h após o início.</span> : null}
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}
