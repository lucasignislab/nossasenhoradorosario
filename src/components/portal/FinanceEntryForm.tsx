'use client';

import { useEffect, useState, useTransition } from 'react';
import { Check, Download, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  createFinanceEntry,
  deleteFinanceEntry,
  updateFinanceEntry,
  type FinanceEntryInput,
} from '@/app/(auth)/admin/financeiro/actions';
import {
  FINANCE_EXPENSE_CATEGORIES,
  FINANCE_INCOME_CATEGORIES,
  financeCategoryLabel,
  formatBRL,
  formatFinanceDate,
} from '@/lib/finance';
import type { FinanceEntry, FinanceEntryType, Profile } from '@/types';

function emptyForm(): FinanceEntryInput {
  return {
    type: 'entrada',
    category: 'mensalidade',
    description: '',
    amount: '',
    entry_date: new Date().toISOString().slice(0, 10),
    profile_id: '',
  };
}

function formFromEntry(entry: FinanceEntry): FinanceEntryInput {
  return {
    type: entry.type,
    category: entry.category,
    description: entry.description,
    amount: (entry.amount_cents / 100).toFixed(2).replace('.', ','),
    entry_date: entry.entry_date,
    profile_id: entry.profile_id ?? '',
  };
}

type FinanceFormModalProps = {
  entry: FinanceEntry | null; // null = criação
  members: Profile[];
  onClose: () => void;
};

function FinanceFormModal({ entry, members, onClose }: FinanceFormModalProps) {
  const [form, setForm] = useState<FinanceEntryInput>(entry ? formFromEntry(entry) : emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (field: keyof FinanceEntryInput) => (
    change: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((current) => {
    const next = { ...current, [field]: change.target.value };
    if (field === 'type') {
      const defaults = next.type === 'entrada' ? FINANCE_INCOME_CATEGORIES : FINANCE_EXPENSE_CATEGORIES;
      next.category = defaults[0].value;
      if (next.type !== 'entrada') next.profile_id = '';
    }
    if (field === 'category' && next.category !== 'mensalidade') next.profile_id = '';
    return next;
  });

  const categories = form.type === 'entrada' ? FINANCE_INCOME_CATEGORIES : FINANCE_EXPENSE_CATEGORIES;
  const showMemberSelector = form.type === 'entrada' && form.category === 'mensalidade';

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = entry ? await updateFinanceEntry(entry.id, form) : await createFinanceEntry(form);
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
        aria-label={entry ? `Editar ${entry.description}` : 'Novo lançamento'}
        onClick={(click) => click.stopPropagation()}
      >
        <div className="portal-modal__header">
          <h2>{entry ? 'Editar lançamento' : 'Novo lançamento'}</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={submit} className="portal-form">
          <div className="portal-form__row">
            <label className="portal-field">
              <span>Tipo *</span>
              <select value={form.type} onChange={set('type')}>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </label>
            <label className="portal-field">
              <span>Categoria *</span>
              <select value={form.category} onChange={set('category')}>
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="portal-field">
            <span>Descrição *</span>
            <input required minLength={3} value={form.description} onChange={set('description')} placeholder="Ex.: Mensalidade · Ana Martins" />
          </label>

          <div className="portal-form__row">
            <label className="portal-field">
              <span>Valor (R$) *</span>
              <input required inputMode="decimal" value={form.amount} onChange={set('amount')} placeholder="90,00" />
            </label>
            <label className="portal-field">
              <span>Data *</span>
              <input required type="date" value={form.entry_date} onChange={set('entry_date')} />
            </label>
          </div>

          {showMemberSelector ? (
            <label className="portal-field">
              <span>Filho(a) da casa</span>
              <select value={form.profile_id} onChange={set('profile_id')}>
                <option value="">Não vincular</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name ?? 'Sem nome'}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}

          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>
              Cancelar
            </button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              <Check size={15} /> {entry ? 'Salvar alterações' : 'Criar lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewFinanceEntryButton({ members }: { members: Profile[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="portal-button portal-button--primary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Novo lançamento
      </button>
      {open ? <FinanceFormModal entry={null} members={members} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function FinanceEntryRowActions({ entry, members }: { entry: FinanceEntry; members: Profile[] }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Excluir o lançamento "${entry.description}"? Esta ação não pode ser desfeita.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteFinanceEntry(entry.id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-icon-button" aria-label={`Editar ${entry.description}`} disabled={isPending} onClick={() => setEditing(true)}>
        <Pencil size={15} />
      </button>
      <button type="button" className="portal-icon-button" aria-label={`Excluir ${entry.description}`} disabled={isPending} onClick={handleDelete}>
        <Trash2 size={15} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
      {editing ? <FinanceFormModal entry={entry} members={members} onClose={() => setEditing(false)} /> : null}
    </span>
  );
}

export function FinanceExportButton({ entries }: { entries: FinanceEntry[] }) {
  const handleExport = () => {
    const header = 'Data;Descrição;Categoria;Tipo;Valor';
    const rows = entries.map((entry) => [
      formatFinanceDate(entry.entry_date),
      `"${entry.description.replace(/"/g, '""')}"`,
      financeCategoryLabel(entry.category),
      entry.type === 'entrada' ? 'Entrada' : 'Saída',
      (entry.amount_cents / 100).toFixed(2).replace('.', ','),
    ].join(';'));
    const blob = new Blob([`﻿${[header, ...rows].join('\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financeiro-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" className="portal-button portal-button--secondary" onClick={handleExport}>
      <Download size={16} /> Exportar
    </button>
  );
}
