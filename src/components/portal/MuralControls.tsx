'use client';

import { useEffect, useState, useTransition } from 'react';
import { Check, PackageCheck, Pencil, Plus, Trash2, Undo2, X } from 'lucide-react';
import { cancelMuralPledge, pledgeMuralItem } from '@/app/(auth)/dashboard/levar/actions';
import {
  createMuralItem,
  deleteMuralItem,
  removeMuralPledge,
  setMuralPledgeDelivered,
  updateMuralItem,
  type MuralItemInput,
} from '@/app/(auth)/admin/mural/actions';
import { MURAL_ITEM_CATEGORIES, formatMuralQuantity } from '@/lib/mural';
import type { MuralItem } from '@/types';

// ---------- Filho: comprometer-se / desistir ----------

export function PledgeMuralButton({ item }: { item: MuralItem }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
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
      const result = await pledgeMuralItem(item.id, quantity, note);
      if (result.ok) {
        setOpen(false);
        setQuantity('');
        setNote('');
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <button type="button" className="portal-button portal-button--primary" onClick={() => setOpen(true)}>
        <PackageCheck size={15} /> Eu levo
      </button>
      {open ? (
        <div className="portal-modal-overlay" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Levar ${item.name}`}
            onClick={(click) => click.stopPropagation()}
          >
            <div className="portal-modal__header">
              <h2>Eu levo · {item.name}</h2>
              <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={() => setOpen(false)}>
                <X size={17} />
              </button>
            </div>
            <form onSubmit={submit} className="portal-form">
              <label className="portal-field">
                <span>Quantidade ({item.unit}) *</span>
                <input required autoFocus inputMode="decimal" value={quantity} onChange={(change) => setQuantity(change.target.value)} placeholder={item.quantity_total ? `Meta: ${formatMuralQuantity(Number(item.quantity_total), item.unit)}` : 'Ex.: 2'} />
              </label>
              <label className="portal-field">
                <span>Observação (opcional)</span>
                <input value={note} onChange={(change) => setNote(change.target.value)} placeholder="Ex.: levo na gira de sexta" maxLength={240} />
              </label>
              {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
              <div className="portal-modal__actions">
                <button type="button" className="portal-button portal-button--secondary" onClick={() => setOpen(false)} disabled={isPending}>
                  Cancelar
                </button>
                <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
                  <Check size={15} /> Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CancelPledgeButton({ pledgeId }: { pledgeId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handle = () => {
    if (!window.confirm('Desistir deste compromisso?')) return;
    setError(null);
    startTransition(async () => {
      const result = await cancelMuralPledge(pledgeId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-button portal-button--secondary" onClick={handle} disabled={isPending}>
        <Undo2 size={14} /> Desistir
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}

// ---------- Gestão: itens ----------

function emptyItemForm(): MuralItemInput {
  return { name: '', category: 'outros', quantity_total: '', unit: 'un', note: '' };
}

function formFromItem(item: MuralItem): MuralItemInput {
  return {
    name: item.name,
    category: item.category,
    quantity_total: item.quantity_total ? String(item.quantity_total).replace('.', ',') : '',
    unit: item.unit,
    note: item.note ?? '',
  };
}

function MuralItemFormModal({ item, onClose }: { item: MuralItem | null; onClose: () => void }) {
  const [form, setForm] = useState<MuralItemInput>(item ? formFromItem(item) : emptyItemForm());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (field: keyof MuralItemInput) => (
    change: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((current) => ({ ...current, [field]: change.target.value }));

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = item ? await updateMuralItem(item.id, form) : await createMuralItem(form);
      if (result.ok) onClose();
      else setError(result.error);
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="portal-modal"
        role="dialog"
        aria-modal="true"
        aria-label={item ? `Editar ${item.name}` : 'Novo item'}
        onClick={(click) => click.stopPropagation()}
      >
        <div className="portal-modal__header">
          <h2>{item ? 'Editar item' : 'Novo item da lista'}</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}>
            <X size={17} />
          </button>
        </div>
        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Item *</span>
            <input required minLength={2} autoFocus value={form.name} onChange={set('name')} placeholder="Ex.: Vela branca de 7 dias" />
          </label>
          <div className="portal-form__row">
            <label className="portal-field">
              <span>Categoria</span>
              <select value={form.category} onChange={set('category')}>
                {MURAL_ITEM_CATEGORIES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="portal-field">
              <span>Unidade</span>
              <input value={form.unit} onChange={set('unit')} placeholder="un, kg, pct, L" maxLength={12} />
            </label>
          </div>
          <div className="portal-form__row">
            <label className="portal-field">
              <span>Meta total (opcional)</span>
              <input inputMode="decimal" value={form.quantity_total} onChange={set('quantity_total')} placeholder="Ex.: 10" />
            </label>
            <label className="portal-field">
              <span>Observação (opcional)</span>
              <input value={form.note} onChange={set('note')} maxLength={240} placeholder="Ex.: pode ser de qualquer cor" />
            </label>
          </div>
          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>
              Cancelar
            </button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              <Check size={15} /> {item ? 'Salvar alterações' : 'Adicionar item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewMuralItemButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="portal-button portal-button--primary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Novo item
      </button>
      {open ? <MuralItemFormModal item={null} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function MuralItemRowActions({ item }: { item: MuralItem }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Excluir o item "${item.name}"? Os compromissos ligados a ele também saem.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteMuralItem(item.id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-icon-button" aria-label={`Editar ${item.name}`} disabled={isPending} onClick={() => setEditing(true)}>
        <Pencil size={15} />
      </button>
      <button type="button" className="portal-icon-button" aria-label={`Excluir ${item.name}`} disabled={isPending} onClick={handleDelete}>
        <Trash2 size={15} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
      {editing ? <MuralItemFormModal item={item} onClose={() => setEditing(false)} /> : null}
    </span>
  );
}

// ---------- Gestão: compromissos ----------

export function MuralPledgeAdminActions({ pledgeId, delivered }: { pledgeId: string; delivered: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleDelivered = () => {
    setError(null);
    startTransition(async () => {
      const result = await setMuralPledgeDelivered(pledgeId, !delivered);
      if (!result.ok) setError(result.error);
    });
  };

  const remove = () => {
    if (!window.confirm('Remover este compromisso?')) return;
    setError(null);
    startTransition(async () => {
      const result = await removeMuralPledge(pledgeId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button
        type="button"
        className={delivered ? 'portal-button portal-button--secondary' : 'portal-button portal-button--primary'}
        onClick={toggleDelivered}
        disabled={isPending}
      >
        {delivered ? <><Undo2 size={14} /> Desfazer entrega</> : <><Check size={14} /> Confirmar entrega</>}
      </button>
      <button type="button" className="portal-icon-button" aria-label="Remover compromisso" onClick={remove} disabled={isPending}>
        <Trash2 size={15} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}
