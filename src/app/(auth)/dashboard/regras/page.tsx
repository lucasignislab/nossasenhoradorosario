import { FileDown, ScrollText } from 'lucide-react';
import { PageHeader } from '@/components/portal/PortalUI';
import { createClient } from '@/lib/supabase/server';
import type { HouseDocument } from '@/types';

export default async function RegrasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('house_documents')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });
  const documents = (data ?? []) as HouseDocument[];

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Área dos filhos · Regras da casa"
        title="Regras e preceitos da casa"
        description="Documentos oficiais da corrente: convivência, conduta e orientações. Leia com carinho e guarde no coração."
      />
      {documents.length === 0 ? (
        <p className="portal-panel__copy">Nenhum documento publicado no momento.</p>
      ) : (
        <section className="portal-panel">
          <ul className="ponto-file-list ponto-file-list--member">
            {documents.map((document) => {
              const url = supabase.storage.from('documentos').getPublicUrl(document.file_path).data.publicUrl;
              return (
                <li key={document.id}>
                  <ScrollText size={15} />
                  <span>
                    <strong>{document.title}</strong>
                    {document.description ? <small className="ponto-file-list__desc">{document.description}</small> : null}
                  </span>
                  <a className="portal-button portal-button--secondary portal-button--small" href={url} target="_blank" rel="noopener noreferrer">
                    <FileDown size={14} /> Abrir PDF
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
