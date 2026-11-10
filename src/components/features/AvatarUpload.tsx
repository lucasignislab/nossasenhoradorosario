'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, Trash2, UserRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

/** Foto de perfil do membro: clique para escolher, preview circular e remoção. */
export function AvatarUpload({ value, onChange, name }: { value: string; onChange: (url: string) => void; name: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato não aceito. Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('A foto pode ter no máximo 5 MB.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Sessão expirada. Entre novamente.');
        return;
      }
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${user.id}/avatar-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file);
      if (uploadError) {
        setError('Não foi possível enviar a foto. Tente novamente.');
        return;
      }
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch {
      setError('Erro inesperado no envio. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <button
        type="button"
        className="avatar-upload__preview"
        aria-label={value ? `Trocar foto de ${name}` : `Adicionar foto de ${name}`}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={`Foto de ${name}`} />
        ) : (
          <UserRound size={34} aria-hidden />
        )}
        <span className="avatar-upload__badge">
          {uploading ? <Loader2 size={13} className="is-spinning" /> : <Camera size={13} />}
        </span>
      </button>
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
      <div className="avatar-upload__side">
        <strong>Foto de identificação</strong>
        <small>Aparece nas listas de presença, escalas e no cadastro de membros. JPG, PNG ou WebP · até 5 MB.</small>
        {value ? (
          <button type="button" className="portal-text-link" onClick={() => onChange('')} disabled={uploading}>
            <Trash2 size={13} /> Remover foto
          </button>
        ) : null}
        {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}
