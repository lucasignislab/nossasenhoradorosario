import { PageHeader, StatusPill } from '@/components/portal/PortalUI';

export default function ProfilePreviewPage() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Perfil" title="Meu perfil" description="Dados pessoais e informações do seu vínculo com a casa." />
      <article className="portal-panel">
        <dl className="portal-definition-list">
          <div><dt>Nome</dt><dd>Lucas Coelho</dd></div>
          <div><dt>E-mail</dt><dd>preview@senhoradorosario.org</dd></div>
          <div><dt>Acesso</dt><dd><StatusPill tone="info">Ativo</StatusPill></dd></div>
        </dl>
      </article>
    </div>
  );
}
