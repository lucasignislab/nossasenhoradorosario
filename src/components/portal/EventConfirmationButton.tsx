'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cancelConfirmation, confirmPresence } from '@/app/(auth)/dashboard/agenda/actions';

export function EventConfirmationButton({ eventId, confirmed }: { eventId: string; confirmed: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = confirmed ? await cancelConfirmation(eventId) : await confirmPresence(eventId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button
        type="button"
        className={`portal-button ${confirmed ? 'portal-button--secondary' : 'portal-button--primary'} portal-button--small`}
        disabled={isPending}
        onClick={handleClick}
      >
        {confirmed ? <><XCircle size={14} /> Cancelar confirmação</> : <><CheckCircle2 size={14} /> Confirmar presença</>}
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}
