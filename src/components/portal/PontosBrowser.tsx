'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, FileDown, Folder, FolderOpen, Music2 } from 'lucide-react';
import { PageHeader } from './PortalUI';
import { createClient } from '@/lib/supabase/client';
import type { Ponto, PontoFolder } from '@/types';

function pontoUrl(filePath: string): string {
  return createClient().storage.from('pontos').getPublicUrl(filePath).data.publicUrl;
}

/** Navegação dos filhos pelos Pontos Cantados: pastas em camadas + PDFs. */
export function PontosBrowser({ folders, pontos }: { folders: PontoFolder[]; pontos: Ponto[] }) {
  const [currentId, setCurrentId] = useState<string | null>(null);

  const byId = useMemo(() => new Map(folders.map((folder) => [folder.id, folder])), [folders]);

  const path: PontoFolder[] = [];
  let cursor = currentId ? byId.get(currentId) ?? null : null;
  while (cursor) {
    path.unshift(cursor);
    cursor = cursor.parent_id ? byId.get(cursor.parent_id) ?? null : null;
  }

  const subfolders = folders
    .filter((folder) => (folder.parent_id ?? null) === currentId)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, 'pt-BR'));
  const currentPontos = pontos
    .filter((ponto) => ponto.folder_id === currentId)
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Área dos filhos · Pontos cantados"
        title="Pontos cantados da casa"
        description="Navegue pelas pastas e abra o PDF de cada ponto para acompanhar e estudar."
      />

      <nav className="ponto-breadcrumb" aria-label="Caminho das pastas">
        <button type="button" className={currentId === null ? 'is-current' : ''} onClick={() => setCurrentId(null)}>
          <Music2 size={14} /> Início
        </button>
        {path.map((folder) => (
          <span key={folder.id} className="ponto-breadcrumb__step">
            <ChevronRight size={13} aria-hidden />
            <button type="button" className={folder.id === currentId ? 'is-current' : ''} onClick={() => setCurrentId(folder.id)}>
              {folder.name}
            </button>
          </span>
        ))}
      </nav>

      {subfolders.length === 0 && currentPontos.length === 0 ? (
        <p className="portal-panel__copy">
          {folders.length === 0
            ? 'Nenhum ponto cadastrado ainda. Os PDFs aparecerão aqui assim que a comunicação da casa publicar.'
            : 'Esta pasta ainda está vazia.'}
        </p>
      ) : (
        <>
          {subfolders.length > 0 ? (
            <section className="ponto-folder-grid">
              {subfolders.map((folder) => {
                const directPontos = pontos.filter((ponto) => ponto.folder_id === folder.id).length;
                const childCount = folders.filter((item) => item.parent_id === folder.id).length;
                return (
                  <button key={folder.id} type="button" className="ponto-folder-card" onClick={() => setCurrentId(folder.id)}>
                    <span className="ponto-folder-card__icon"><Folder size={21} /></span>
                    <strong>{folder.name}</strong>
                    <small>
                      {[
                        childCount > 0 ? `${childCount} ${childCount === 1 ? 'subpasta' : 'subpastas'}` : '',
                        directPontos > 0 ? `${directPontos} ${directPontos === 1 ? 'ponto' : 'pontos'}` : '',
                      ].filter(Boolean).join(' · ') || 'Vazia'}
                    </small>
                    <ChevronRight size={16} aria-hidden />
                  </button>
                );
              })}
            </section>
          ) : null}

          {currentPontos.length > 0 ? (
            <section className="portal-panel">
              <div className="ponto-manager__head">
                <div>
                  <p className="portal-eyebrow">{path.length > 0 ? path.map((folder) => folder.name).join(' › ') : 'Pontos cantados'}</p>
                  <h2>PDFs desta pasta</h2>
                </div>
              </div>
              <ul className="ponto-file-list ponto-file-list--member">
                {currentPontos.map((ponto) => (
                  <li key={ponto.id}>
                    <FolderOpen size={15} />
                    <span>{ponto.title}</span>
                    <a className="portal-button portal-button--secondary portal-button--small" href={pontoUrl(ponto.file_path)} target="_blank" rel="noopener noreferrer">
                      <FileDown size={14} /> Abrir PDF
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
