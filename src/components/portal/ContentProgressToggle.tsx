'use client';

import { useState, useTransition } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { markContentCompleted, unmarkContentCompleted } from '@/app/(auth)/dashboard/aulas/actions';

export function ContentProgressToggle({ contentId, completed }: { contentId: string; completed: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = completed ? await unmarkContentCompleted(contentId) : await markContentCompleted(contentId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button
        type="button"
        className={`portal-button ${completed ? 'portal-button--secondary' : 'portal-button--primary'} portal-button--small`}
        disabled={isPending}
        onClick={handleClick}
      >
        {completed ? <><CheckCircle2 size={14} /> Concluído</> : <><Check size={14} /> Marcar como concluído</>}
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}
