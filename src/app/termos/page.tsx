import { Header } from '@/components/layout/header/Header';
import { Footer } from '@/components/layout/footer/footer';

export const metadata = {
  title: 'Termos de Uso | Terreiro Senhora do Rosário',
  description: 'Termos de uso do portal e da área dos filhos do Terreiro de Umbanda Senhora do Rosário.',
};

const sections = [
  {
    title: '1. O que é este portal',
    body: 'Este portal é o canal oficial do Terreiro de Umbanda Senhora do Rosário (Barão Geraldo, Campinas/SP) para divulgar giras, festividades e conteúdos da casa, e para organizar a rotina dos filhos da corrente: frequência, escalas, mensalidades, estudos e comunicados internos.',
  },
  {
    title: '2. Quem pode usar',
    body: 'O site público (agenda, eventos, blog e doações) é aberto a todos. A área dos filhos é destinada a membros da corrente e da administração, mediante cadastro e aprovação da casa. Ao criar uma conta, você declara que as informações fornecidas são verdadeiras.',
  },
  {
    title: '3. Conduta na área interna',
    body: 'Os conteúdos internos (pontos cantados, regras da casa, materiais de estudo e avisos) são destinados ao uso pessoal dos membros. Não é permitido reproduzir ou compartilhar esses materiais fora da comunidade sem autorização da administração, nem utilizar o portal para fins diversos da vida da casa.',
  },
  {
    title: '4. Mensalidades e doações',
    body: 'As contribuições registradas no portal são organizadas pela administração da casa. O registro de mensalidade ou doação no sistema não substitui o pagamento via Pix; a confirmação acontece após a verificação do comprovante. Nenhum trabalho espiritual é cobrado.',
  },
  {
    title: '5. Responsabilidades',
    body: 'A casa se compromete a manter as informações do portal atualizadas e a proteger os dados dos membros conforme a Política de Privacidade. O membro é responsável por manter seus dados atualizados e sua senha em sigilo. Contas podem ser suspensas pela administração em caso de uso indevido.',
  },
  {
    title: '6. Alterações destes termos',
    body: 'Estes termos podem ser atualizados pela administração. Quando isso acontecer, um novo aceite será solicitado na área dos filhos. A versão vigente é a publicada nesta página (versão 2026-11-10).',
  },
  {
    title: '7. Contato',
    body: 'Dúvidas sobre estes termos: fale com a administração da casa durante as giras ou pelo Instagram @t.u.senhoradorosario. Endereço: Rua Antônio Adami, 36 — Barão Geraldo, Campinas/SP.',
  },
];

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="legal-page">
        <div className="legal-page__inner">
          <p className="legal-page__eyebrow">Documento oficial</p>
          <h1>Termos de Uso</h1>
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
