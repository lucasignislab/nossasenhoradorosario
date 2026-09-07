'use client';

import { useState, useTransition } from 'react';
import { Check, UserRoundX, UserRoundCheck, Ban } from 'lucide-react';
import {
  approveMember,
  reactivateMember,
  rejectMember,
  suspendMember,
} from '@/app/(auth)/admin/membros/actions';
import type { ProfileStatus } from '@/types';

type ServerAction = (profileId: string) => Promise<{ ok: true } | { ok: false; error: string }>;

function ActionError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="portal-action-error" role="alert">{message}</p>;
}

export function ApprovalActions({ profileId }: { profileId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (action: ServerAction) => {
    setError(null);
    startTransition(async () => {
      const result = await action(profileId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <div className="portal-approval-card__actions-wrap">
      <div className="portal-approval-card__actions">
        <button
          type="button"
          className="portal-button portal-button--danger"
          disabled={isPending}
          onClick={() => run(rejectMember)}
        >
          <UserRoundX size={15} /> Reprovar
        </button>
        <button
          type="button"
          className="portal-button portal-button--primary"
          disabled={isPending}
          onClick={() => run(approveMember)}
        >
          <Check size={15} /> Aprovar
        </button>
      </div>
      <ActionError message={error} />
    </div>
  );
}

export function MemberStatusActions({ profileId, status }: { profileId: string; status: ProfileStatus }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (action: ServerAction) => {
    setError(null);
    startTransition(async () => {
      const result = await action(profileId);
      if (!result.ok) setError(result.error);
    });
  };

  if (status === 'active') {
    return (
      <div className="portal-row-actions">
        <button
          type="button"
          className="portal-button portal-button--danger portal-button--small"
          disabled={isPending}
          onClick={() => run(suspendMember)}
        >
          <Ban size={14} /> Suspender
        </button>
        <ActionError message={error} />
      </div>
    );
  }

  if (status === 'suspended') {
    return (
      <div className="portal-row-actions">
        <button
          type="button"
          className="portal-button portal-button--secondary portal-button--small"
          disabled={isPending}
          onClick={() => run(reactivateMember)}
        >
          <UserRoundCheck size={14} /> Reativar
        </button>
        <ActionError message={error} />
      </div>
    );
  }

  return (
    <div className="portal-row-actions">
      <button
        type="button"
        className="portal-button portal-button--primary portal-button--small"
        disabled={isPending}
        onClick={() => run(approveMember)}
      >
        <Check size={14} /> Aprovar
      </button>
      <ActionError message={error} />
    </div>
  );
}
