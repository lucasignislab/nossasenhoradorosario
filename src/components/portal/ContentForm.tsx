'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Check, Eye, EyeOff, FileText, Pencil, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import {
  createContent,
  deleteContent,
  toggleContentPublished,
  updateContent,
  type ContentFormInput,
} from '@/app/(auth)/admin/conteudos/actions';
import { CONTENT_KIND_OPTIONS } from '@/lib/notices';
import { createClient } from '@/lib/supabase/client';
import type { StudyContent } from '@/types';

const MATERIAL_MAX_SIZE = 10 * 1024 * 1024;

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'material';
}

function emptyForm(): ContentFormInput {
  return { title: '', description: '', kind: 'video', url: '', module: '', duration_minutes: '', published: false };
}

function formFromContent(content: StudyContent): ContentFormInput {
  return {
    title: content.title,
    description: content.description ?? '',
    kind: content.kind,
    url: content.url,
    module: content.module ?? '',
    duration_minutes: content.duration_minutes ? String(content.duration_minutes) : '',
    published: content.published,
  };
}

type ContentFormModalProps = {
  content: StudyContent | null; // null = criação
  onClose: () => void;
};

function ContentFormModal({ content, onClose }: ContentFormModalProps) {
  const [form, setForm] = useState<ContentFormInput>(content ? formFromContent(content) : emptyForm());
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const materialInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (field: keyof ContentFormInput) => (
    change: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((current) => ({ ...current, [field]: change.target.value }));

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setError(null);
    startTransition(async () => {
      let nextForm = form;
      if (form.kind === 'material' && materialFile) {
        const supabase = createClient();
        const path = `${Date.now()}-${slugify(materialFile.name)}.pdf`;
        const { error: uploadError } = await supabase.storage.from('materiais').upload(path, materialFile);
        if (uploadError) {
          setError('Não foi possível enviar o PDF. Tente novamente.');
          return;
        }
        const { data } = supabase.storage.from('materiais').getPublicUrl(path);
        nextForm = { ...form, url: data.publicUrl };
        setForm(nextForm);
      }
      if (form.kind === 'material' && !materialFile && !form.url.trim()) {
        setError('Envie o PDF do material.');
        return;
      }
      const result = content ? await updateContent(content.id, nextForm) : await createContent(nextForm);
      if (result.ok) onClose();
      else setError(result.error);
    });
  };

  const pickMaterial = (picked: File | null) => {
    if (!picked) return;
    if (picked.type !== 'application/pdf') {
      setError('Envie o material em PDF.');
      return;
    }
    if (picked.size > MATERIAL_MAX_SIZE) {
      setError('O PDF pode ter no máximo 10 MB.');
      return;
    }
    setError(null);
    setMaterialFile(picked);
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-label={content ? `Editar ${content.title}` : 'Novo conteúdo'} onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <h2>{content ? 'Editar conteúdo' : 'Novo conteúdo'}</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}><X size={17} /></button>
        </div>

        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Título *</span>
            <input required minLength={3} value={form.title} onChange={set('title')} placeholder="Ex.: Fundamentos da mediunidade" />
          </label>

          <label className="portal-field">
            <span>Descrição</span>
            <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Sobre o que é este material" />
          </label>

          <div className="portal-form__row">
            <label className="portal-field">
              <span>Tipo *</span>
              <select value={form.kind} onChange={set('kind')}>
                {CONTENT_KIND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="portal-field">
              <span>Duração (min)</span>
              <input inputMode="numeric" value={form.duration_minutes} onChange={set('duration_minutes')} placeholder="42" />
            </label>
          </div>

          {form.kind === 'material' ? (
            <div className="portal-field">
              <span>PDF do material *</span>
              <div
                className={`portal-dropzone${isPending ? ' is-disabled' : ''}`}
                role="button"
                tabIndex={0}
                aria-label="Enviar PDF do material"
                onClick={() => !isPending && materialInputRef.current?.click()}
                onKeyDown={(key) => { if (key.key === 'Enter' || key.key === ' ') materialInputRef.current?.click(); }}
                onDragOver={(dragEvent) => dragEvent.preventDefault()}
                onDrop={(dropEvent) => { dropEvent.preventDefault(); pickMaterial(dropEvent.dataTransfer.files?.[0] ?? null); }}
              >
                <input
                  ref={materialInputRef}
                  type="file"
                  accept="application/pdf"
                  className="portal-file-input"
                  onChange={(change) => { pickMaterial(change.target.files?.[0] ?? null); change.target.value = ''; }}
                />
                {materialFile ? (
                  <><FileText size={22} /><strong>{materialFile.name}</strong><small>Clique ou arraste outro PDF para substituir</small></>
                ) : form.url ? (
                  <><FileText size={22} /><strong>PDF atual mantido</strong><small>Clique ou arraste um novo PDF para substituir</small></>
                ) : (
                  <><UploadCloud size={22} /><strong>Clique para escolher ou arraste o PDF aqui</strong><small>PDF · até 10 MB</small></>
                )}
              </div>
            </div>
          ) : (
            <label className="portal-field">
              <span>Link *</span>
              <input required type="url" value={form.url} onChange={set('url')} placeholder="https://youtube.com/..." />
            </label>
          )}

          <label className="portal-field">
            <span>Módulo / percurso</span>
            <input value={form.module} onChange={set('module')} placeholder="Ex.: Fundamentos" />
          </label>

          <label className="portal-field portal-field--checkbox">
            <input type="checkbox" checked={form.published} onChange={(change) => setForm((current) => ({ ...current, published: change.target.checked }))} />
            <span>Publicado (visível para os filhos)</span>
          </label>

          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}

          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>Cancelar</button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              <Check size={15} /> {content ? 'Salvar alterações' : 'Criar conteúdo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewContentButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="portal-button portal-button--primary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Novo conteúdo
      </button>
      {open ? <ContentFormModal content={null} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function ContentRowActions({ content }: { content: StudyContent }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleContentPublished(content.id, !content.published);
      if (!result.ok) setError(result.error);
    });
  };

  const handleDelete = () => {
    if (!window.confirm(`Excluir o conteúdo "${content.title}"? O progresso dos filhos neste material também será removido.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteContent(content.id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-icon-button" aria-label={content.published ? `Despublicar ${content.title}` : `Publicar ${content.title}`} disabled={isPending} onClick={handleToggle}>
        {content.published ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <button type="button" className="portal-icon-button" aria-label={`Editar ${content.title}`} disabled={isPending} onClick={() => setEditing(true)}>
        <Pencil size={15} />
      </button>
      <button type="button" className="portal-icon-button" aria-label={`Excluir ${content.title}`} disabled={isPending} onClick={handleDelete}>
        <Trash2 size={15} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
      {editing ? <ContentFormModal content={content} onClose={() => setEditing(false)} /> : null}
    </span>
  );
}
