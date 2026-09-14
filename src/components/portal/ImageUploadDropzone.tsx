'use client';

import { useRef, useState } from 'react';
import { ImageUp, Link2, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'arte';
}

/** Dropzone de arte do evento: clique para escolher ou arraste a imagem. */
export function ImageUploadDropzone({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlField, setShowUrlField] = useState(false);

  const upload = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato não aceito. Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('A imagem pode ter no máximo 5 MB.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${Date.now()}-${slugify(file.name)}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('artes').upload(path, file);
      if (uploadError) {
        setError('Não foi possível enviar a arte. Tente novamente.');
        return;
      }
      const { data } = supabase.storage.from('artes').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch {
      setError('Erro inesperado no envio. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (dropEvent: React.DragEvent) => {
    dropEvent.preventDefault();
    setDragOver(false);
    if (disabled || uploading) return;
    const file = dropEvent.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  return (
    <div className="portal-field">
      <span>Arte do evento (flyer)</span>
      <div
        className={`portal-dropzone${dragOver ? ' is-dragover' : ''}${disabled || uploading ? ' is-disabled' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Enviar arte do evento"
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onKeyDown={(key) => { if (key.key === 'Enter' || key.key === ' ') inputRef.current?.click(); }}
        onDragOver={(dragEvent) => { dragEvent.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="portal-file-input"
          onChange={(change) => {
            const file = change.target.files?.[0];
            if (file) void upload(file);
            change.target.value = '';
          }}
        />
        {uploading ? (
          <><Loader2 size={22} className="is-spinning" /><strong>Enviando arte…</strong><small>Aguarde um instante</small></>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Arte atual do evento" className="portal-dropzone__preview" />
            <strong>Arte selecionada</strong>
            <small>Clique ou arraste outra imagem para substituir</small>
          </>
        ) : (
          <><ImageUp size={22} /><strong>Clique para escolher ou arraste a imagem aqui</strong><small>JPG, PNG ou WebP · até 5 MB</small></>
        )}
      </div>
      {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
      <div className="portal-row-actions portal-row-actions--inline">
        <button
          type="button"
          className="portal-text-link"
          onClick={() => setShowUrlField((current) => !current)}
        >
          <Link2 size={13} /> {showUrlField ? 'Ocultar campo de URL' : 'Ou cole uma URL'}
        </button>
        {value ? (
          <button type="button" className="portal-text-link" onClick={() => onChange('')} disabled={disabled || uploading}>
            <Trash2 size={13} /> Remover arte
          </button>
        ) : null}
        {value ? (
          <button type="button" className="portal-text-link" onClick={() => inputRef.current?.click()} disabled={disabled || uploading}>
            <RefreshCw size={13} /> Substituir
          </button>
        ) : null}
      </div>
      {showUrlField ? (
        <label className="portal-field">
          <span>URL da imagem</span>
          <input type="url" value={value} onChange={(change) => onChange(change.target.value)} placeholder="https://..." />
        </label>
      ) : null}
    </div>
  );
}
