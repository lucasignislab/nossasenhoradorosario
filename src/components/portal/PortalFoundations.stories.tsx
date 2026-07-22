import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarDays, CircleDollarSign, ShieldAlert, UserCheck } from 'lucide-react';
import { MetricCard, PanelHeader, ProgressBar, StatusPill } from './PortalUI';

const meta = {
  title: 'Fundamentos/Portal corporativo',
  parameters: {
    docs: {
      description: {
        component: 'Padrões visuais e semânticos compartilhados pela administração e pela área dos filhos.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dashboard-layout portal-story-canvas">
        <div className="portal-page"><Story /></div>
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CoresSemanticas: Story = {
  render: () => (
    <section className="portal-panel">
      <PanelHeader eyebrow="Uso funcional" title="Cores semânticas" />
      <div className="portal-story-swatches">
        <article><span className="portal-story-swatch is-primary" /><strong>Azul</strong><span>Ações principais, entradas e informação</span></article>
        <article><span className="portal-story-swatch is-success" /><strong>Verde</strong><span>Confirmação, presença e sucesso</span></article>
        <article><span className="portal-story-swatch is-warning" /><strong>Âmbar</strong><span>Pendências e pontos de atenção</span></article>
        <article><span className="portal-story-swatch is-danger" /><strong>Vermelho</strong><span>Reprovação, cancelamento, erro e saída</span></article>
        <article><span className="portal-story-swatch is-neutral" /><strong>Neutro</strong><span>Estrutura, conteúdo secundário e repouso</span></article>
      </div>
    </section>
  ),
};

export const Botoes: Story = {
  render: () => (
    <section className="portal-panel">
      <PanelHeader eyebrow="Ações" title="Hierarquia de botões" />
      <div className="portal-story-row">
        <button className="portal-button portal-button--primary">Salvar alterações</button>
        <button className="portal-button portal-button--secondary">Ver detalhes</button>
        <button className="portal-button portal-button--danger">Reprovar cadastro</button>
        <button className="portal-button portal-button--dark">Ação em fundo escuro</button>
      </div>
    </section>
  ),
};

export const Status: Story = {
  render: () => (
    <section className="portal-panel">
      <PanelHeader eyebrow="Feedback" title="Estados do sistema" />
      <div className="portal-story-row">
        <StatusPill tone="info">Confirmado</StatusPill>
        <StatusPill tone="warning">Pendente</StatusPill>
        <StatusPill tone="danger">Cancelado</StatusPill>
        <StatusPill tone="gold">Destaque da casa</StatusPill>
        <StatusPill tone="neutral">Conciliado</StatusPill>
      </div>
    </section>
  ),
};

export const Indicadores: Story = {
  render: () => (
    <section className="portal-metrics portal-story-metrics">
      <MetricCard icon={UserCheck} label="Frequência geral" value="87%" detail="+6% em relação a junho" tone="brand" />
      <MetricCard icon={CircleDollarSign} label="Total recebido" value="R$ 3.840" detail="86% do valor previsto" tone="info" />
      <MetricCard icon={CalendarDays} label="Próxima atividade" value="24 jul" detail="Estudo mediúnico · 20h" tone="gold" />
      <MetricCard icon={ShieldAlert} label="Aguardando" value="3" detail="Cadastros para revisão" tone="warning" />
    </section>
  ),
};

export const Progresso: Story = {
  render: () => (
    <section className="portal-panel portal-story-narrow">
      <PanelHeader eyebrow="Acompanhamento" title="Indicadores de progresso" />
      <div className="portal-progress-list">
        <ProgressBar value={92} label="Giras de desenvolvimento" />
        <ProgressBar value={84} label="Estudos e aulas" />
        <ProgressBar value={76} label="Cuidados da casa" />
      </div>
    </section>
  ),
};

export const FormularioClassico: Story = {
  render: () => (
    <section className="profile-classic-card portal-story-narrow">
      <div className="profile-page__form">
        <div className="profile-page__field"><label htmlFor="story-name">Nome</label><input id="story-name" defaultValue="Lucas Coelho" /></div>
        <div className="profile-page__field"><label htmlFor="story-email">E-mail</label><input id="story-email" value="preview@senhoradorosario.org" disabled /></div>
        <div className="profile-page__field"><label htmlFor="story-access">Acesso</label><input id="story-access" value="Acesso técnico" disabled /></div>
        <button type="button">Salvar alterações</button>
      </div>
    </section>
  ),
};
