import { Save } from 'lucide-react';
import { PageHeader } from '@/components/portal/PortalUI';

export default function ProfilePreviewPage() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Perfil" title="Meu perfil" description="Dados pessoais e informações do seu vínculo com a casa." />
      <article className="portal-panel profile-classic-card">
        <form className="profile-page__form">
          <div className="profile-page__field">
            <label htmlFor="preview-name">Nome</label>
            <input id="preview-name" defaultValue="Lucas Coelho" />
          </div>
          <div className="profile-page__field">
            <label htmlFor="preview-email">E-mail</label>
            <input id="preview-email" type="email" value="preview@senhoradorosario.org" disabled />
          </div>
          <div className="profile-page__field">
            <label htmlFor="preview-access">Acesso</label>
            <input id="preview-access" value="Ativo · Acesso técnico" disabled />
          </div>
          <button type="button"><Save size={15} /> Salvar alterações</button>
        </form>
      </article>
    </div>
  );
}
