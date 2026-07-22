import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusPill } from './PortalUI';

const meta = {
  title: 'Fundamentos/Componentes/Status',
  component: StatusPill,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Comunica estados breves. Vermelho é reservado a erro, cancelamento, reprovação ou saída.' } },
  },
  args: { children: 'Confirmado', tone: 'info' },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmado: Story = {};
export const Pendente: Story = { args: { children: 'Pendente', tone: 'warning' } };
export const Concluido: Story = { args: { children: 'Concluído', tone: 'brand' } };
export const Cancelado: Story = { args: { children: 'Cancelado', tone: 'danger' } };
export const Neutro: Story = { args: { children: 'Conciliado', tone: 'neutral' } };
