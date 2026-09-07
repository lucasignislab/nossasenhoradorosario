'use client';

import { useEffect, useState, useTransition } from 'react';
import { Check, Pencil, Plus, RotateCcw, Trash2, X, XCircle } from 'lucide-react';
import {
  cancelEvent,
  createEvent,
  deleteEvent,
  restoreEvent,
  updateEvent,
  type EventFormInput,
} from '@/app/(auth)/admin/agenda/actions';
import { EVENT_CATEGORY_OPTIONS, formatEventTime } from '@/lib/events';
import type { PortalEvent } from '@/types';

const DEFAULT_LOCATION = 'T. U. Senhora do Rosário';

function emptyForm(): EventFormInput {
  return {
    title: '',
    entity: '',
    category: 'gira',
    event_date: '',
    event_time: '19:30',
    location: DEFAULT_LOCATION,
    description: '',
    details: '',
    image_url: '',
  };
}

function formFromEvent(event: PortalEvent): EventFormInput {
  return {
    title: event.title,
    entity: event.entity ?? '',
    category: event.category,
    event_date: event.event_date,
    event_time: formatEventTime(event.event_time),
    location: event.location,
    description: event.description ?? '',
    details: event.details ?? '',
    image_url: event.image_url ?? '',
  };
}

type EventFormModalProps = {
  event: PortalEvent | null; // null = criação
  onClose: () => void;
};

function EventFormModal({ event, onClose }: EventFormModalProps) {
  const [form, setForm] = useState<EventFormInput>(event ? formFromEvent(event) : emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (field: keyof EventFormInput) => (
    change: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((current) => ({ ...current, [field]: change.target.value }));

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = event ? await updateEvent(event.id, form) : await createEvent(form);
      if (result.ok) {
        onClose();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="portal-modal"
        role="dialog"
        aria-modal="true"
        aria-label={event ? `Editar ${event.title}` : 'Novo evento'}
        onClick={(click) => click.stopPropagation()}
      >
        <div className="portal-modal__header">
          <h2>{event ? 'Editar evento' : 'Novo evento'}</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Título *</span>
            <input required minLength={3} value={form.title} onChange={set('title')} placeholder="Ex.: Gira de Caboclos" />
          </label>

          <div className="portal-form__row">
            <label className="portal-field">
              <span>Linha / Entidade</span>
              <input value={form.entity} onChange={set('entity')} placeholder="Ex.: Caboclos" />
            </label>
            <label className="portal-field">
              <span>Categoria *</span>
              <select value={form.category} onChange={set('category')}>
                {EVENT_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="portal-form__row">
            <label className="portal-field">
              <span>Data *</span>
              <input required type="date" value={form.event_date} onChange={set('event_date')} />
            </label>
            <label className="portal-field">
              <span>Horário</span>
              <input type="time" value={form.event_time} onChange={set('event_time')} />
            </label>
          </div>

          <label className="portal-field">
            <span>Local</span>
            <input value={form.location} onChange={set('location')} placeholder={DEFAULT_LOCATION} />
          </label>

          <label className="portal-field">
            <span>Descrição curta</span>
            <input value={form.description} onChange={set('description')} placeholder="Aparece nos cartões da agenda" />
          </label>

          <label className="portal-field">
            <span>Detalhes</span>
            <textarea rows={4} value={form.details} onChange={set('details')} placeholder="Orientações, o que levar, observações..." />
          </label>

          <label className="portal-field">
            <span>URL da imagem (flyer)</span>
            <input type="url" value={form.image_url} onChange={set('image_url')} placeholder="https://..." />
          </label>

          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}

          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>
              Cancelar
            </button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              <Check size={15} /> {event ? 'Salvar alterações' : 'Criar evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewEventButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="portal-button portal-button--primary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Criar atividade
      </button>
      {open ? <EventFormModal event={null} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function EventRowActions({ event }: { event: PortalEvent }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isCanceled = event.status === 'cancelada';

  const run = (action: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await action(event.id);
      if (!result.ok) setError(result.error);
    });
  };

  const handleStatus = () => {
    if (isCanceled) {
      run(restoreEvent);
      return;
    }
    if (window.confirm(`Cancelar "${event.title}"? O evento deixará de aparecer na agenda pública.`)) {
      run(cancelEvent);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Excluir definitivamente "${event.title}"? Esta ação não pode ser desfeita.`)) {
      run(deleteEvent);
    }
  };

  return (
    <div className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-icon-button" aria-label={`Editar ${event.title}`} disabled={isPending} onClick={() => setEditing(true)}>
        <Pencil size={16} />
      </button>
      <button
        type="button"
        className="portal-icon-button"
        aria-label={isCanceled ? `Reconfirmar ${event.title}` : `Cancelar ${event.title}`}
        disabled={isPending}
        onClick={handleStatus}
      >
        {isCanceled ? <RotateCcw size={16} /> : <XCircle size={16} />}
      </button>
      <button type="button" className="portal-icon-button" aria-label={`Excluir ${event.title}`} disabled={isPending} onClick={handleDelete}>
        <Trash2 size={16} />
      </button>
      {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
      {editing ? <EventFormModal event={event} onClose={() => setEditing(false)} /> : null}
    </div>
  );
}
