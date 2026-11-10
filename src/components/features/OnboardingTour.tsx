'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardCheck,
  Music2,
  PackageCheck,
  Settings,
  Sparkles,
  UserRound,
  UserRoundCheck,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { markOnboarded } from '@/app/(auth)/dashboard/onboarding-actions';

type TourStep = { icon: typeof Sparkles; title: string; body: string };

const memberSteps: TourStep[] = [
  { icon: Sparkles, title: 'Bem-vindo(a) à área dos filhos', body: 'Aqui você acompanha a vida da casa: giras, escalas, estudos, mensalidades e sua frequência. Este tour rápido apresenta cada função — você pode rever a qualquer momento no botão de ajuda, no topo da tela.' },
  { icon: CalendarDays, title: 'Calendário', body: 'Todas as giras e festividades do mês. Use "Pretendo ir" para avisar que vai; no dia da gira, o botão vira "Confirmar presença" e vale como frequência até 23h59.' },
  { icon: PackageCheck, title: 'Quem vai levar', body: 'A lista de itens que a casa precisa para cada gira (velas, flores, ervas…). Escolha o que você vai levar e acompanhe a cobertura de cada item.' },
  { icon: UserRoundCheck, title: 'Escala de cambone e Escala de cuidados', body: 'Veja os cambones de cada gira e confirme sua escala quando for chamado. Em Cuidados, inscreva-se nas faxinas: quintas-feiras e um sábado do mês, em equipes de 7 a 9 pessoas.' },
  { icon: ClipboardCheck, title: 'Minha frequência', body: 'Seu histórico de presenças gira a gira. Os botões ficam sempre ativos porque algumas giras pedem confirmação com até 2 semanas de antecedência.' },
  { icon: BookOpen, title: 'Estudos e Pontos cantados', body: 'Em Estudos ficam os materiais das Iyás (vídeos, artigos e PDFs). Em Pontos cantados, navegue pelas pastas (ex.: Esquerda › Exus) e abra o PDF de cada ponto.' },
  { icon: WalletCards, title: 'Mensalidades', body: 'Registre o valor que vai pagar (entre R$ 70 e R$ 100), pague via Pix com a chave da casa e envie o comprovante. Seu histórico fica sempre em ordem de datas.' },
  { icon: UserRound, title: 'Meu perfil', body: 'Sua ficha completa: nome, WhatsApp, foto de identificação e ficha espiritual (Guia de Frente, Orixá de Cabeça e Adjuntó). Mantenha tudo atualizado por aqui.' },
];

const editorSteps: TourStep[] = [
  { icon: Sparkles, title: 'Bem-vindo(a) à Comunicação', body: 'Você cuida das postagens e dos conteúdos do portal: agenda de giras, avisos, biblioteca e pontos cantados. Este tour mostra cada área — reabra quando quiser no botão de ajuda.' },
  { icon: CalendarDays, title: 'Agenda e giras', body: 'Cadastre as giras com título, data e horário. Suba a mesma arte do Instagram (1080×1350, formato do feed): ela aparece inteira nos cards, sem corte.' },
  { icon: Bell, title: 'Avisos', body: 'Publique comunicados para a corrente. Avisos fixados aparecem em destaque na área dos filhos.' },
  { icon: BookOpen, title: 'Conteúdos — Biblioteca', body: 'Suba materiais de estudo das Iyás em PDF (tipo "Material em PDF") ou cadastre vídeos e artigos por link. Tudo publicado aparece em Estudos para os filhos.' },
  { icon: Music2, title: 'Conteúdos — Pontos cantados', body: 'Monte a árvore de pastas como a casa prefere (ex.: Esquerda › Exus › Pomba Giras › Exus Mirins) e suba o PDF de cada ponto na subpasta correspondente.' },
  { icon: UserRound, title: 'Sua área de filho', body: 'Você também tem a área dos filhos: frequência, escalas, mensalidades e perfil. Alterne pelo botão "Ver minha área" no menu lateral.' },
];

const adminSteps: TourStep[] = [
  { icon: Sparkles, title: 'Bem-vindo(a) à Administração', body: 'Esta é a gestão completa da casa: membros, frequência, financeiro, escalas e conteúdos. Este tour apresenta cada área — reabra quando quiser no botão de ajuda.' },
  { icon: ChartNoAxesCombined, title: 'Visão geral', body: 'O painel resume cadastros aguardando aprovação, próximas giras e saúde financeira. Aprove um novo filho com um clique, já escolhendo o papel dele.' },
  { icon: UsersRound, title: 'Filhos da casa', body: 'Ficha completa de cada membro, com foto, contato e ficha espiritual (Guia de Frente, Orixá de Cabeça e Adjuntó). Você pode corrigir a ficha espiritual pelo botão dedicado.' },
  { icon: ClipboardCheck, title: 'Frequência', body: 'Acompanhe a presença gira a gira, faça a chamada e corrija registros quando necessário. A confirmação do próprio filho já conta automaticamente.' },
  { icon: CircleDollarSign, title: 'Financeiro', body: 'Mensalidades registradas pelos filhos entram automaticamente como receita. Acompanhe o Fundo do Terreiro, despesas do mês, doações e comprovantes.' },
  { icon: UserRoundCheck, title: 'Escalas', body: 'Monte a escala de cambones por gira e acompanhe as equipes de faxina (quintas e um sábado do mês, 7 a 9 pessoas por equipe).' },
  { icon: BookOpen, title: 'Agenda, avisos e conteúdos', body: 'Gerencie giras e artes, comunique a corrente e organize a Biblioteca (PDFs das Iyás) e a árvore de Pontos cantados.' },
  { icon: Settings, title: 'Configurações', body: 'Papéis do sistema e políticas de acesso. Contas suspensas perdem acesso imediatamente.' },
];

function stepsForRole(role: 'member' | 'admin' | 'developer' | 'editor'): TourStep[] {
  if (role === 'editor') return editorSteps;
  if (role === 'admin' || role === 'developer') return adminSteps;
  return memberSteps;
}

/** Tour de boas-vindas por perfil: abre no primeiro acesso e pelo botão de ajuda. */
export function OnboardingTour({
  role,
  open,
  onClose,
}: {
  role: 'member' | 'admin' | 'developer' | 'editor';
  open: boolean;
  onClose: () => void;
}) {
  const steps = stepsForRole(role);
  const [stepIndex, setStepIndex] = useState(0);
  const [, startTransition] = useTransition();

  // Reinicia no primeiro passo sempre que o tour abre (padrão de ajuste durante a renderização).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setStepIndex(0);
  }

  useEffect(() => {
    if (!open) return;
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const step = steps[stepIndex];
  const StepIcon = step.icon;
  const isLast = stepIndex === steps.length - 1;

  const finish = () => {
    startTransition(async () => { await markOnboarded(); });
    onClose();
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={finish}>
      <div className="portal-modal onboarding-tour" role="dialog" aria-modal="true" aria-label={`Boas-vindas — ${step.title}`} onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <span className="onboarding-tour__counter">Passo {stepIndex + 1} de {steps.length}</span>
          <button type="button" className="portal-icon-button" aria-label="Fechar tour" onClick={finish}><X size={17} /></button>
        </div>
        <div className="onboarding-tour__body">
          <span className="onboarding-tour__icon"><StepIcon size={26} /></span>
          <h2>{step.title}</h2>
          <p>{step.body}</p>
        </div>
        <div className="onboarding-tour__dots" aria-hidden="true">
          {steps.map((item, index) => (
            <i key={item.title} className={index === stepIndex ? 'is-current' : ''} />
          ))}
        </div>
        <div className="portal-modal__actions onboarding-tour__actions">
          {stepIndex > 0 ? (
            <button type="button" className="portal-button portal-button--secondary" onClick={() => setStepIndex((current) => current - 1)}>
              <ArrowLeft size={15} /> Anterior
            </button>
          ) : (
            <button type="button" className="portal-text-link" onClick={finish}>Pular tour</button>
          )}
          <button
            type="button"
            className="portal-button portal-button--primary"
            onClick={() => (isLast ? finish() : setStepIndex((current) => current + 1))}
          >
            {isLast ? <Check size={15} /> : <ArrowRight size={15} />} {isLast ? 'Começar' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
}
