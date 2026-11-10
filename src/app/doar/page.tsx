import { HeartHandshake } from 'lucide-react';
import { Header } from '@/components/layout/header/Header';
import { Footer } from '@/components/layout/footer/footer';
import { PixDonation } from '@/components/features/PixDonation';

export const metadata = {
  title: 'Doe | Terreiro Senhora do Rosário',
  description: 'Apoie os trabalhos da casa com uma doação via Pix. Toda contribuição mantém as giras, as ações sociais e o cuidado com a comunidade.',
};

export default function DoarPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="donate-page">
        <div className="donate-page__inner">
          <p className="donate-page__eyebrow"><HeartHandshake size={16} aria-hidden /> Caridade</p>
          <h1>Apoie os trabalhos da casa</h1>
          <p className="donate-page__lead">
            Nenhum trabalho espiritual é cobrado. As doações mantêm as giras, as festividades,
            as ações sociais e o cuidado diário com quem procura a casa. Contribua com qualquer
            valor pelo Pix — aponte a câmera do celular para o QR Code ou use o copia e cola.
          </p>

          <div className="donate-page__card">
            <PixDonation allowNotify />
          </div>

          <p className="donate-page__note">
            Terreiro de Umbanda Senhora do Rosário · Rua Antônio Adami, 36 — Barão Geraldo, Campinas/SP.
            Se preferir, avise a casa sobre sua doação para recebemos com gratidão e registrarmos sua contribuição.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
