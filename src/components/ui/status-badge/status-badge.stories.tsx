import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatusBadge } from './status-badge';

const meta = {
  title: 'Components/UI/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'radio',
      options: ['pago', 'pendente', 'atrasado'],
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Pago - Tamanho Médio
 * Status verde indicando pagamento realizado
 */
export const Pago: Story = {
  args: {
    status: 'pago',
    size: 'medium',
  },
};

/**
 * Pendente - Tamanho Médio
 * Status amarelo indicando pendência
 */
export const Pendente: Story = {
  args: {
    status: 'pendente',
    size: 'medium',
  },
};

/**
 * Atrasado - Tamanho Médio
 * Status vermelho indicando atraso
 */
export const Atrasado: Story = {
  args: {
    status: 'atrasado',
    size: 'medium',
  },
};

/**
 * Pequeno
 * Versão compacta para tabelas
 */
export const Pequeno: Story = {
  args: {
    status: 'pago',
    size: 'small',
  },
};

/**
 * Grande
 * Versão expandida para destaque
 */
export const Grande: Story = {
  args: {
    status: 'atrasado',
    size: 'large',
  },
};

/**
 * Com Label Customizado
 * Substituindo o texto padrão
 */
export const ComLabelCustomizado: Story = {
  args: {
    status: 'pendente',
    label: 'Aguardando Pagamento',
    size: 'medium',
  },
};

/**
 * Todos os Estados
 * Comparação visual
 */
export const TodosOsEstados: Story = {
  args: {
    status: 'pago',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <StatusBadge status="pago" />
      <StatusBadge status="pendente" />
      <StatusBadge status="atrasado" />
    </div>
  ),
};
