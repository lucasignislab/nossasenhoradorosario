import { redirect } from 'next/navigation';
import QRCode from 'qrcode';
import { UserRound } from 'lucide-react';
import { PageHeader } from '@/components/portal/PortalUI';
import { createClient } from '@/lib/supabase/server';

type Profile = {
  full_name: string;
  role: 'member' | 'admin' | 'developer' | 'editor';
  cargo: string | null;
  avatar_url: string | null;
  guia_frente: string | null;
  orixa_cabeca: string | null;
  adjunto: string | null;
  birth_date: string | null;
  joined_at: string | null;
};

const roleNames = { member: 'Filho(a) da casa', admin: 'Administração', developer: 'Acesso técnico', editor: 'Comunicação' };

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
}

export default async function CarteirinhaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('profiles')
    .select('full_name, role, cargo, avatar_url, guia_frente, orixa_cabeca, adjunto, birth_date, joined_at')
    .eq('id', user.id)
    .single();
  const profile = data as Profile | null;
  if (!profile) redirect('/dashboard');

  const qrUrl = await QRCode.toDataURL(user.id, { width: 240, margin: 0 });
  const memberCode = user.id.replace(/-/g, '').slice(0, 12).toUpperCase();

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Área dos filhos · Carteirinha"
        title="Sua carteirinha digital"
        description="Documento oficial de identificação de membro da casa — apresente na entrada das giras e atividades. Mantenha sua foto e ficha atualizadas em Meu perfil."
      />

      <div className="membership-card-wrap">
        <article className="membership-card" aria-label={`Carteirinha de ${profile.full_name}`}>
          <header className="membership-card__band">
            <span className="membership-card__seal" aria-hidden="true">SR</span>
            <div className="membership-card__issuer">
              <strong>Terreiro de Umbanda Senhora do Rosário</strong>
              <small>Carteirinha de Identificação de Membro da Corrente</small>
            </div>
            <div className="membership-card__doc-number">
              <span>Nº de registro</span>
              <strong>{memberCode}</strong>
            </div>
          </header>

          <div className="membership-card__body">
            <figure className="membership-card__photo">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={`Foto 3×4 de ${profile.full_name}`} />
              ) : (
                <UserRound size={44} aria-hidden />
              )}
            </figure>

            <dl className="membership-card__fields">
              <div className="membership-card__field membership-card__field--name">
                <dt>Nome completo</dt>
                <dd>{profile.full_name}</dd>
              </div>
              <div className="membership-card__field">
                <dt>Função na casa</dt>
                <dd>{profile.cargo ?? roleNames[profile.role]}</dd>
              </div>
              <div className="membership-card__field">
                <dt>Data de nascimento</dt>
                <dd>{formatDate(profile.birth_date)}</dd>
              </div>
              <div className="membership-card__field">
                <dt>Membro desde</dt>
                <dd>{formatDate(profile.joined_at)}</dd>
              </div>
            </dl>

            <div className="membership-card__side">
              <div className="membership-card__qr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR Code de verificação do documento" width={84} height={84} />
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

      <p className="portal-panel__copy">Dica: tire um print ou adicione esta página à tela inicial do celular para ter a carteirinha sempre à mão.</p>
    </div>
  );
}
