import { Header } from '@/components/layout/header/Header';
import { Footer } from '@/components/layout/footer/footer';

export const metadata = {
  title: 'Política de Privacidade | Terreiro Senhora do Rosário',
  description: 'Como o Terreiro de Umbanda Senhora do Rosário coleta, usa e protege os dados pessoais (LGPD — Lei nº 13.709/2018).',
};

const sections = [
  {
    title: '1. Quem é responsável pelos seus dados',
    body: 'O controlador dos dados é o Terreiro de Umbanda Senhora do Rosário (Rua Antônio Adami, 36 — Barão Geraldo, Campinas/SP). Esta política segue a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
  },
  {
    title: '2. Quais dados coletamos',
    body: 'No cadastro: nome completo, e-mail e WhatsApp. Na ficha do membro: foto de identificação, data de nascimento, data de entrada na casa e ficha espiritual (Guia de Frente, Orixá de Cabeça e Adjuntó). Na rotina: frequência nas giras, inscrições em escalas, registros de mensalidades e comprovantes de pagamento.',
  },
  {
    title: '3. Para que usamos',
    body: 'Os dados são usados exclusivamente para a organização da vida da casa: identificar membros, montar escalas, controlar frequência, organizar o financeiro (mensalidades e doações), comemorar aniversários e comunicar avisos. Não vendemos, alugamos nem compartilhamos dados com terceiros para fins comerciais.',
  },
  {
    title: '4. Base legal',
    body: 'O tratamento se baseia no legítimo interesse da organização religiosa sem fins lucrativos (art. 7º, IX, e art. 11 da LGPD, quanto a dados ligados à filiação religiosa, tratados no contexto das atividades da casa) e no consentimento registrado no cadastro.',
  },
  {
    title: '5. Onde os dados ficam e por quanto tempo',
    body: 'Os dados são armazenados com segurança na plataforma Supabase (servidores com criptografia), com acesso restrito por senha e regras de permissão por perfil. Enquanto você for membro, os dados são mantidos; após o desligamento, dados de frequência e financeiros podem ser retidos pelo prazo necessário a obrigações legais e contábeis.',
  },
  {
    title: '6. Quem acessa',
    body: 'Cada membro acessa somente os próprios dados. A administração acessa fichas, frequência e financeiro para a gestão da casa. A equipe de comunicação acessa apenas agenda, avisos e conteúdos. Fotos de perfil são visíveis aos demais membros ativos nas listas internas.',
  },
  {
    title: '7. Seus direitos',
    body: 'Você pode, a qualquer momento, solicitar confirmação, acesso, correção, anonimização ou eliminação dos seus dados, bem como revogar o consentimento, falando com a administração da casa. A eliminação de registros legais ou contábeis pode ser limitada por obrigações legais.',
  },
  {
    title: '8. Cookies e tecnologias',
    body: 'O portal usa apenas cookies estritamente necessários ao funcionamento (sessão de login). Não usamos cookies de publicidade ou rastreamento de terceiros.',
  },
  {
    title: '9. Contato do encarregado',
    body: 'Para exercer seus direitos ou tirar dúvidas sobre privacidade, procure a administração da casa durante as giras ou pelo Instagram @t.u.senhoradorosario.',
  },
];

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="legal-page">
        <div className="legal-page__inner">
          <p className="legal-page__eyebrow">Documento oficial · LGPD</p>
          <h1>Política de Privacidade</h1>
          <p className="legal-page__meta">Versão 2026-11-10 · Terreiro de Umbanda Senhora do Rosário</p>
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
