import { UserRound } from 'lucide-react';
import { PageHeader } from '@/components/portal/PortalUI';

/** Prévia da carteirinha (modo demonstração, sem dados reais). */
export default function CarteirinhaPreviewPage() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Área dos filhos · Carteirinha"
        title="Sua carteirinha digital"
        description="Documento oficial de identificação de membro da casa."
      />
      <div className="membership-card-wrap">
        <article className="membership-card" aria-label="Carteirinha de demonstração">
          <header className="membership-card__band">
            <span className="membership-card__seal" aria-hidden="true">SR</span>
            <div className="membership-card__issuer">
              <strong>Terreiro de Umbanda Senhora do Rosário</strong>
              <small>Carteirinha de Identificação de Membro da Corrente</small>
            </div>
            <div className="membership-card__doc-number">
              <span>Nº de registro</span>
              <strong>F25D97DC47A8</strong>
            </div>
          </header>
          <div className="membership-card__body">
            <figure className="membership-card__photo">
              <UserRound size={44} aria-hidden />
            </figure>
            <dl className="membership-card__fields">
              <div className="membership-card__field membership-card__field--name">
                <dt>Nome completo</dt>
                <dd>Lucas Coelho</dd>
              </div>
              <div className="membership-card__field">
                <dt>Função na casa</dt>
                <dd>Acesso técnico</dd>
              </div>
              <div className="membership-card__field">
                <dt>Data de nascimento</dt>
                <dd>20/05/1990</dd>
              </div>
              <div className="membership-card__field">
                <dt>Membro desde</dt>
                <dd>10/03/2024</dd>
              </div>
            </dl>
            <div className="membership-card__side">
              <div className="membership-card__qr">
                <span style={{ display: 'block', width: 74, height: 74, background: '#fff', border: '1px solid #7a6534', borderRadius: 3 }} />
                <small>Verificação digital</small>
              </div>
              <div className="membership-card__signature">
                <span className="membership-card__signature-line" aria-hidden="true" />
                <small>Assinatura do membro</small>
              </div>
            </div>
          </div>
          <footer className="membership-card__foot">
            <span>Emitida pela administração · Barão Geraldo — Campinas/SP</span>
            <span>Válida com foto e QR Code</span>
          </footer>
        </article>
      </div>
    </div>
  );
}
