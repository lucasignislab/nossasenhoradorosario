import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { StatCard } from './stat-card';

const meta = {
  title: 'Components/UI/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Próxima Gira do Filho
 * Exibe a próxima gira relacionada ao usuário
 */
export const ProximaGira: Story = {
  args: {
    icon: '🎭',
    title: 'Próxima Gira',
    value: '20/03/2026',
    subtitle: 'Linha dos Caboclos • 20:00',
    variant: 'default',
  },
};

/**
 * Status da Mensalidade - Pago
 */
export const MensalidadePaga: Story = {
  args: {
    icon: '💚',
    title: 'Mensalidade',
    value: 'Em Dia',
    subtitle: 'Próximo vencimento: 10/04/2026',
    variant: 'success',
  },
};

/**
 * Status da Mensalidade - Pendente
 */
export const MensalidadePendente: Story = {
  args: {
    icon: '💛',
    title: 'Mensalidade',
    value: 'Pendente',
    subtitle: 'Vencimento: 10/03/2026',
    variant: 'warning',
  },
};

/**
 * Status da Mensalidade - Atrasada
 */
export const MensalidadeAtrasada: Story = {
  args: {
    icon: '❤️',
    title: 'Mensalidade',
    value: 'Atrasada',
    subtitle: 'Vencida há 5 dias',
    variant: 'danger',
  },
};

/**
 * Última Aula Postada
 */
export const UltimaAula: Story = {
  args: {
    icon: '📚',
    title: 'Última Aula',
    value: 'Desenvolvimento Mediúnico',
    subtitle: 'Postada há 3 dias',
    variant: 'default',
  },
};

/**
 * Múltiplos Cards
 * Exemplo de layout do dashboard
 */
export const MultipleStats: Story = {
  args: {
    icon: '📊',
    title: 'Múltiplos',
    value: 0,
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px',
      }}
    >
      <StatCard
        icon="🎭"
        title="Próxima Gira"
        value="20/03/2026"
        subtitle="Linha dos Caboclos • 20:00"
      />
      <StatCard
        icon="💚"
        title="Mensalidade"
        value="Em Dia"
        subtitle="Próximo vencimento: 10/04/2026"
        variant="success"
      />
      <StatCard
        icon="📚"
        title="Última Aula"
        value="Desenvolvimento Mediúnico"
        subtitle="Postada há 3 dias"
      />
    </div>
  ),
};
