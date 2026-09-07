'use client';

import { useState, useTransition } from 'react';
import { Check, CheckCircle2, XCircle } from 'lucide-react';
import { cancelShiftSignup, signUpForShift } from '@/app/(auth)/dashboard/faxinas/actions';
import { removeShiftSignup, setCleaningSaturday } from '@/app/(auth)/admin/faxinas/actions';

/** Botão do membro: inscrever-se ou cancelar inscrição em uma data de cuidado. */
export function ShiftSignupButton({
  shiftDateId,
  signedUp,
  full,
}: {
  shiftDateId: string;
  signedUp: boolean;
  full: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = signedUp
        ? await cancelShiftSignup(shiftDateId)
        : await signUpForShift(shiftDateId);
      if (!result.ok) setError(result.error);
    });
  };

  if (!signedUp && full) {
    return <span className="portal-action-note">Equipe completa para esta data.</span>;
  }

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button
        type="button"
        className={`portal-button ${signedUp ? 'portal-button--secondary' : 'portal-button--primary'} portal-button--small`}
        disabled={isPending}
        onClick={handleClick}
      >
        {signedUp
          ? <><XCircle size={14} /> Cancelar participação</>
          : <><CheckCircle2 size={14} /> Quero participar</>}
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}

/** Ajuste da administração: escolhe qual sábado do mês terá cuidado da casa. */
export function SaturdayShiftEditor({ month, currentDate }: { month: string; currentDate: string }) {
  const [date, setDate] = useState(currentDate);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await setCleaningSaturday(month, date);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <form onSubmit={submit} className="portal-inline-form">
      <label className="portal-field portal-field--inline">
        <span>Sábado do mês</span>
        <input type="date" required value={date} onChange={(change) => setDate(change.target.value)} />
      </label>
      <button type="submit" className="portal-button portal-button--secondary portal-button--small" disabled={isPending || date === currentDate}>
        <Check size={14} /> Salvar sábado
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </form>
  );
}

/** Administração remove a inscrição de uma pessoa (ex.: pedido externo). */
export function RemoveShiftSignupButton({
  shiftDateId,
  profileId,
  name,
}: {
  shiftDateId: string;
  profileId: string;
  name: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!window.confirm(`Remover a participação de ${name} nesta data?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await removeShiftSignup(shiftDateId, profileId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button
        type="button"
        className="portal-icon-button"
        aria-label={`Remover ${name} desta data`}
        title={`Remover ${name} desta data`}
        disabled={isPending}
        onClick={handleClick}
      >
        <XCircle size={14} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}
