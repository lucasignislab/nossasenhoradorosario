'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Check, FileText, Folder, FolderPlus, Loader2, Pencil, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import {
  createPonto,
  createPontoFolder,
  deletePonto,
  deletePontoFolder,
  renamePontoFolder,
} from '@/app/(auth)/admin/conteudos/pontos-actions';
import { createClient } from '@/lib/supabase/client';
import type { Ponto, PontoFolder } from '@/types';

const MAX_SIZE = 10 * 1024 * 1024;

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'ponto';
}

function pontoUrl(filePath: string): string {
  return createClient().storage.from('pontos').getPublicUrl(filePath).data.publicUrl;
}

type FolderModalProps = {
  folder: PontoFolder | null; // null = criar
  parentId: string | null;
  parentName: string | null;
  onClose: () => void;
};

function FolderModal({ folder, parentId, parentName, onClose }: FolderModalProps) {
  const [name, setName] = useState(folder?.name ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = folder
        ? await renamePontoFolder(folder.id, name)
        : await createPontoFolder(name, parentId);
      if (result.ok) onClose();
      else setError(result.error);
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-label={folder ? `Renomear ${folder.name}` : 'Nova pasta'} onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <h2>{folder ? 'Renomear pasta' : parentName ? `Nova subpasta em ${parentName}` : 'Nova pasta raiz'}</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}><X size={17} /></button>
        </div>
        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Nome da pasta *</span>
            <input required minLength={2} maxLength={120} value={name} onChange={(change) => setName(change.target.value)} placeholder="Ex.: Exus Mirins" autoFocus />
          </label>
          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>Cancelar</button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              <Check size={15} /> {folder ? 'Salvar' : 'Criar pasta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PontoModal({ folder, onClose }: { folder: PontoFolder; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
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
      setError('Envie o ponto em PDF.');
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
      setError('Escolha o PDF do ponto.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const path = `${folder.id}/${Date.now()}-${slugify(file.name)}.pdf`;
      const { error: uploadError } = await supabase.storage.from('pontos').upload(path, file);
      if (uploadError) {
        setError('Não foi possível enviar o PDF. Tente novamente.');
        return;
      }
      const result = await createPonto({ folderId: folder.id, title, filePath: path, fileName: file.name });
      if (result.ok) onClose();
      else setError(result.error);
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-label={`Novo ponto em ${folder.name}`} onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <h2>Novo ponto em &ldquo;{folder.name}&rdquo;</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}><X size={17} /></button>
        </div>
        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Título do ponto *</span>
            <input required minLength={3} maxLength={160} value={title} onChange={(change) => setTitle(change.target.value)} placeholder="Ex.: Ponto de abertura da gira" autoFocus />
          </label>
          <div className="portal-field">
            <span>PDF do ponto *</span>
            <div
              className={`portal-dropzone${isPending ? ' is-disabled' : ''}`}
              role="button"
              tabIndex={0}
              aria-label="Enviar PDF do ponto"
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
              {isPending ? <Loader2 size={15} className="is-spinning" /> : <Check size={15} />} {isPending ? 'Enviando…' : 'Cadastrar ponto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FolderBlock({ folder, folders, pontos, depth }: { folder: PontoFolder; folders: PontoFolder[]; pontos: Ponto[]; depth: number }) {
  const [modal, setModal] = useState<'subfolder' | 'rename' | 'ponto' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const children = folders
    .filter((item) => item.parent_id === folder.id)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, 'pt-BR'));
  const folderPontos = pontos
    .filter((ponto) => ponto.folder_id === folder.id)
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));

  const handleDeleteFolder = () => {
    if (!window.confirm(`Excluir a pasta "${folder.name}"? Ela precisa estar vazia.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deletePontoFolder(folder.id);
      if (!result.ok) setError(result.error);
    });
  };

  const handleDeletePonto = (ponto: Ponto) => {
    if (!window.confirm(`Excluir o ponto "${ponto.title}"? O PDF também será removido.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deletePonto(ponto.id, ponto.file_path);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <div className="ponto-folder" data-depth={depth}>
      <div className="ponto-folder__header">
        <span className="ponto-folder__icon"><Folder size={17} /></span>
        <h3>{folder.name}</h3>
        <span className="ponto-folder__count">{folderPontos.length} {folderPontos.length === 1 ? 'ponto' : 'pontos'}</span>
        <span className="portal-row-actions portal-row-actions--inline">
          <button type="button" className="portal-icon-button" aria-label={`Nova subpasta em ${folder.name}`} title="Nova subpasta" onClick={() => setModal('subfolder')}><FolderPlus size={15} /></button>
          <button type="button" className="portal-icon-button" aria-label={`Subir PDF em ${folder.name}`} title="Subir PDF do ponto" onClick={() => setModal('ponto')}><UploadCloud size={15} /></button>
          <button type="button" className="portal-icon-button" aria-label={`Renomear ${folder.name}`} title="Renomear" onClick={() => setModal('rename')}><Pencil size={15} /></button>
          <button type="button" className="portal-icon-button" aria-label={`Excluir ${folder.name}`} title="Excluir (somente se vazia)" disabled={isPending} onClick={handleDeleteFolder}><Trash2 size={15} /></button>
        </span>
      </div>
      {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
      {folderPontos.length > 0 ? (
        <ul className="ponto-file-list">
          {folderPontos.map((ponto) => (
            <li key={ponto.id}>
              <FileText size={15} />
              <a href={pontoUrl(ponto.file_path)} target="_blank" rel="noopener noreferrer">{ponto.title}</a>
              <button type="button" className="portal-icon-button" aria-label={`Excluir ${ponto.title}`} disabled={isPending} onClick={() => handleDeletePonto(ponto)}><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      ) : null}
      {children.map((child) => (
        <FolderBlock key={child.id} folder={child} folders={folders} pontos={pontos} depth={depth + 1} />
      ))}
      {modal === 'subfolder' ? <FolderModal folder={null} parentId={folder.id} parentName={folder.name} onClose={() => setModal(null)} /> : null}
      {modal === 'rename' ? <FolderModal folder={folder} parentId={null} parentName={null} onClose={() => setModal(null)} /> : null}
      {modal === 'ponto' ? <PontoModal folder={folder} onClose={() => setModal(null)} /> : null}
    </div>
  );
}

/** Gestão da árvore de Pontos Cantados: pastas livres + PDF por pasta. */
export function PontosManager({ folders, pontos }: { folders: PontoFolder[]; pontos: Ponto[] }) {
  const [creating, setCreating] = useState(false);
  const roots = folders
    .filter((folder) => !folder.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, 'pt-BR'));

  return (
    <article className="portal-panel">
      <div className="ponto-manager__head">
        <div>
          <p className="portal-eyebrow">Pontos cantados</p>
          <h2>Pastas e PDFs dos pontos</h2>
          <p className="portal-panel__copy">Monte a árvore como a casa prefere — por exemplo, Esquerda &gt; Exus &gt; Pomba Giras &gt; Exus Mirins — e suba o PDF de cada ponto na subpasta correspondente.</p>
        </div>
        <button type="button" className="portal-button portal-button--primary" onClick={() => setCreating(true)}>
          <Plus size={16} /> Nova pasta raiz
        </button>
      </div>
      {roots.length === 0 ? (
        <p className="portal-panel__copy">Nenhuma pasta criada ainda. Comece pelas grandes linhas (ex.: Esquerda, Direita) e depois crie as subpastas.</p>
      ) : (
        <div className="ponto-tree">
          {roots.map((folder) => (
            <FolderBlock key={folder.id} folder={folder} folders={folders} pontos={pontos} depth={0} />
          ))}
        </div>
      )}
      {creating ? <FolderModal folder={null} parentId={null} parentName={null} onClose={() => setCreating(false)} /> : null}
    </article>
  );
}
