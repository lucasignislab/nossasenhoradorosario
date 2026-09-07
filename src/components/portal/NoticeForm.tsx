'use client';

import { useEffect, useState, useTransition } from 'react';
import { Check, Pencil, Pin, PinOff, Plus, Trash2, X } from 'lucide-react';
import {
  createNotice,
  deleteNotice,
  toggleNoticePinned,
  updateNotice,
  type NoticeFormInput,
} from '@/app/(auth)/admin/avisos/actions';
import { NOTICE_CATEGORY_OPTIONS } from '@/lib/notices';
import type { Notice } from '@/types';

function emptyForm(): NoticeFormInput {
  return { title: '', body: '', category: 'geral', pinned: false };
}

function formFromNotice(notice: Notice): NoticeFormInput {
  return { title: notice.title, body: notice.body, category: notice.category, pinned: notice.pinned };
}

type NoticeFormModalProps = {
  notice: Notice | null; // null = criação
  onClose: () => void;
};

function NoticeFormModal({ notice, onClose }: NoticeFormModalProps) {
  const [form, setForm] = useState<NoticeFormInput>(notice ? formFromNotice(notice) : emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = notice ? await updateNotice(notice.id, form) : await createNotice(form);
      if (result.ok) onClose();
      else setError(result.error);
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-label={notice ? `Editar ${notice.title}` : 'Novo aviso'} onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <h2>{notice ? 'Editar aviso' : 'Novo aviso'}</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}><X size={17} /></button>
        </div>

        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Título *</span>
            <input required minLength={3} value={form.title} onChange={(change) => setForm((current) => ({ ...current, title: change.target.value }))} placeholder="Ex.: Mudança no horário da gira" />
          </label>

          <label className="portal-field">
            <span>Texto do aviso *</span>
            <textarea required rows={5} value={form.body} onChange={(change) => setForm((current) => ({ ...current, body: change.target.value }))} placeholder="Escreva o comunicado com clareza e acolhimento..." />
          </label>

          <div className="portal-form__row">
            <label className="portal-field">
              <span>Categoria</span>
              <select value={form.category} onChange={(change) => setForm((current) => ({ ...current, category: change.target.value }))}>
                {NOTICE_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="portal-field portal-field--checkbox">
              <input type="checkbox" checked={form.pinned} onChange={(change) => setForm((current) => ({ ...current, pinned: change.target.checked }))} />
              <span>Fixar no topo</span>
            </label>
          </div>

          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}

          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>Cancelar</button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              <Check size={15} /> {notice ? 'Salvar alterações' : 'Publicar aviso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewNoticeButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="portal-button portal-button--primary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Novo aviso
      </button>
      {open ? <NoticeFormModal notice={null} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function NoticeRowActions({ notice }: { notice: Notice }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleNoticePinned(notice.id, !notice.pinned);
      if (!result.ok) setError(result.error);
    });
  };

  const handleDelete = () => {
    if (!window.confirm(`Excluir o aviso "${notice.title}"? Esta ação não pode ser desfeita.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteNotice(notice.id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-icon-button" aria-label={notice.pinned ? `Desafixar ${notice.title}` : `Fixar ${notice.title}`} disabled={isPending} onClick={handleToggle}>
        {notice.pinned ? <PinOff size={15} /> : <Pin size={15} />}
      </button>
      <button type="button" className="portal-icon-button" aria-label={`Editar ${notice.title}`} disabled={isPending} onClick={() => setEditing(true)}>
        <Pencil size={15} />
      </button>
      <button type="button" className="portal-icon-button" aria-label={`Excluir ${notice.title}`} disabled={isPending} onClick={handleDelete}>
        <Trash2 size={15} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
      {editing ? <NoticeFormModal notice={notice} onClose={() => setEditing(false)} /> : null}
    </span>
  );
}
