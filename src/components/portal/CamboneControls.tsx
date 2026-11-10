'use client';

import { useEffect, useState, useTransition } from 'react';
import { Check, Plus, Trash2, X, XCircle } from 'lucide-react';
import { respondCamboneAssignment } from '@/app/(auth)/dashboard/cambones/actions';
import { assignCambone, removeCamboneAssignment } from '@/app/(auth)/admin/cambones/actions';
import type { CamboneStatus, DirectoryMember } from '@/types';

export const camboneStatusTone: Record<CamboneStatus, 'warning' | 'info' | 'danger'> = {
  escalado: 'warning',
  confirmado: 'info',
  recusado: 'danger',
};

export const camboneStatusLabel: Record<CamboneStatus, string> = {
  escalado: 'Aguardando resposta',
  confirmado: 'Confirmado',
  recusado: 'Recusou',
};

// ---------- Cambone: responder à escala ----------

export function CamboneRespondActions({ assignmentId }: { assignmentId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const respond = (status: CamboneStatus) => {
    if (status === 'recusado' && !window.confirm('Recusar esta escala? A administração será avisada.')) return;
    setError(null);
    startTransition(async () => {
      const result = await respondCamboneAssignment(assignmentId, status);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-button portal-button--primary" onClick={() => respond('confirmado')} disabled={isPending}>
        <Check size={14} /> Confirmar
      </button>
      <button type="button" className="portal-button portal-button--secondary" onClick={() => respond('recusado')} disabled={isPending}>
        <XCircle size={14} /> Não posso
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}

// ---------- Gestão: escalar / remover ----------

export function AssignCamboneButton({ eventId, members }: { eventId: string; members: DirectoryMember[] }) {
  const [open, setOpen] = useState(false);
  const [profileId, setProfileId] = useState('');
  const [roleNote, setRoleNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await assignCambone(eventId, profileId, roleNote);
      if (result.ok) {
        setOpen(false);
        setProfileId('');
        setRoleNote('');
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <button type="button" className="portal-button portal-button--secondary" onClick={() => setOpen(true)}>
        <Plus size={14} /> Escalar cambone
      </button>
      {open ? (
        <div className="portal-modal-overlay" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Escalar cambone"
            onClick={(click) => click.stopPropagation()}
          >
            <div className="portal-modal__header">
              <h2>Escalar cambone</h2>
              <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={() => setOpen(false)}>
                <X size={17} />
              </button>
            </div>
            <form onSubmit={submit} className="portal-form">
              <label className="portal-field">
                <span>Filho da casa *</span>
                <select required autoFocus value={profileId} onChange={(change) => setProfileId(change.target.value)}>
                  <option value="">Selecione…</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>{member.full_name ?? 'Sem nome'}</option>
                  ))}
                </select>
              </label>
              <label className="portal-field">
                <span>Função / observação (opcional)</span>
                <input value={roleNote} onChange={(change) => setRoleNote(change.target.value)} maxLength={120} placeholder="Ex.: cambone da esquerda" />
              </label>
              {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
              <div className="portal-modal__actions">
                <button type="button" className="portal-button portal-button--secondary" onClick={() => setOpen(false)} disabled={isPending}>
                  Cancelar
                </button>
                <button type="submit" className="portal-button portal-button--primary" disabled={isPending || !profileId}>
                  <Check size={15} /> Escalar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function RemoveCamboneButton({ assignmentId, name }: { assignmentId: string; name: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handle = () => {
    if (!window.confirm(`Remover ${name} da escala desta gira?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await removeCamboneAssignment(assignmentId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-icon-button" aria-label={`Remover ${name}`} onClick={handle} disabled={isPending}>
        <Trash2 size={15} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}
