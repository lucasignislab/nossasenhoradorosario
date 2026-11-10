'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Check, Eye, EyeOff, FileText, Loader2, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import {
  createHouseDocument,
  deleteHouseDocument,
  toggleHouseDocument,
} from '@/app/(auth)/admin/conteudos/house-actions';
import { createClient } from '@/lib/supabase/client';
import { StatusPill } from './PortalUI';
import type { HouseDocument } from '@/types';

const MAX_SIZE = 10 * 1024 * 1024;

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'documento';
}

export function documentUrl(filePath: string): string {
  return createClient().storage.from('documentos').getPublicUrl(filePath).data.publicUrl;
}

function DocumentModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const pickFile = (picked: File | null) => {
    if (!picked) return;
    if (picked.type !== 'application/pdf') {
      setError('Envie o documento em PDF.');
      return;
    }
    if (picked.size > MAX_SIZE) {
      setError('O PDF pode ter no máximo 10 MB.');
      return;
    }
    setError(null);
    setFile(picked);
    if (!title.trim()) setTitle(picked.name.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ').trim());
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Escolha o PDF do documento.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const path = `${Date.now()}-${slugify(file.name)}.pdf`;
      const { error: uploadError } = await supabase.storage.from('documentos').upload(path, file);
      if (uploadError) {
        setError('Não foi possível enviar o PDF. Tente novamente.');
        return;
      }
      const result = await createHouseDocument({ title, description, filePath: path, fileName: file.name });
      if (result.ok) onClose();
      else setError(result.error);
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-label="Novo documento" onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <h2>Novo documento da casa</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}><X size={17} /></button>
        </div>
        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Título *</span>
            <input required minLength={3} maxLength={160} value={title} onChange={(change) => setTitle(change.target.value)} placeholder="Ex.: Regras de convivência da corrente" autoFocus />
          </label>
          <label className="portal-field">
            <span>Descrição</span>
            <textarea rows={2} value={description} onChange={(change) => setDescription(change.target.value)} placeholder="Sobre o que é este documento" />
          </label>
          <div className="portal-field">
            <span>PDF do documento *</span>
            <div
              className={`portal-dropzone${isPending ? ' is-disabled' : ''}`}
              role="button"
              tabIndex={0}
              aria-label="Enviar PDF do documento"
              onClick={() => !isPending && inputRef.current?.click()}
              onKeyDown={(key) => { if (key.key === 'Enter' || key.key === ' ') inputRef.current?.click(); }}
              onDragOver={(dragEvent) => dragEvent.preventDefault()}
              onDrop={(dropEvent) => { dropEvent.preventDefault(); pickFile(dropEvent.dataTransfer.files?.[0] ?? null); }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="portal-file-input"
                onChange={(change) => { pickFile(change.target.files?.[0] ?? null); change.target.value = ''; }}
              />
              {file ? (
                <><FileText size={22} /><strong>{file.name}</strong><small>Clique ou arraste outro PDF para substituir</small></>
              ) : (
                <><UploadCloud size={22} /><strong>Clique para escolher ou arraste o PDF aqui</strong><small>PDF · até 10 MB</small></>
              )}
            </div>
          </div>
          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>Cancelar</button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              {isPending ? <Loader2 size={15} className="is-spinning" /> : <Check size={15} />} {isPending ? 'Enviando…' : 'Cadastrar documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Gestão dos documentos internos (Regras da Casa) — somente administração. */
export function HouseDocumentsManager({ documents }: { documents: HouseDocument[] }) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sorted = [...documents].sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title, 'pt-BR'));

  const handleToggle = (document: HouseDocument) => {
    setError(null);
    startTransition(async () => {
      const result = await toggleHouseDocument(document.id, !document.published);
      if (!result.ok) setError(result.error);
    });
  };

  const handleDelete = (document: HouseDocument) => {
    if (!window.confirm(`Excluir o documento "${document.title}"? O PDF também será removido.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteHouseDocument(document.id, document.file_path);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <article className="portal-panel">
      <div className="ponto-manager__head">
        <div>
          <p className="portal-eyebrow">Regras da casa</p>
          <h2>Documentos internos</h2>
          <p className="portal-panel__copy">Preceitos, normas de convivência e orientações oficiais — visíveis em Regras da Casa na área dos filhos.</p>
        </div>
        <button type="button" className="portal-button portal-button--primary" onClick={() => setCreating(true)}>
          <Plus size={16} /> Novo documento
        </button>
      </div>
      {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
      {sorted.length === 0 ? (
        <p className="portal-panel__copy">Nenhum documento cadastrado ainda.</p>
      ) : (
        <ul className="ponto-file-list">
          {sorted.map((document) => (
            <li key={document.id}>
              <FileText size={15} />
              <a href={documentUrl(document.file_path)} target="_blank" rel="noopener noreferrer">{document.title}</a>
              <span className="portal-row-actions portal-row-actions--inline">
                <StatusPill tone={document.published ? 'info' : 'neutral'}>{document.published ? 'Publicado' : 'Oculto'}</StatusPill>
                <button type="button" className="portal-icon-button" aria-label={document.published ? `Ocultar ${document.title}` : `Publicar ${document.title}`} disabled={isPending} onClick={() => handleToggle(document)}>
                  {document.published ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button type="button" className="portal-icon-button" aria-label={`Excluir ${document.title}`} disabled={isPending} onClick={() => handleDelete(document)}>
                  <Trash2 size={15} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {creating ? <DocumentModal onClose={() => setCreating(false)} /> : null}
    </article>
  );
}
