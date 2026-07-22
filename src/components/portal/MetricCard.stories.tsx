import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarDays, CircleDollarSign, UserCheck } from 'lucide-react';
import { MetricCard } from './PortalUI';

const meta = {
  title: 'Fundamentos/Componentes/Indicador',
  component: MetricCard,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Resume um indicador relevante com valor, contexto de comparação e cor semântica.' } },
  },
  decorators: [(Story) => <div className="dashboard-layout portal-story-canvas"><div className="portal-page portal-story-narrow"><Story /></div></div>],
  argTypes: { icon: { control: false } },
  args: {
    icon: UserCheck,
    label: 'Frequência geral',
    value: '87%',
    detail: '+6% em relação a junho',
    tone: 'brand',
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const Financeiro: Story = { args: { icon: CircleDollarSign, label: 'Total recebido', value: 'R$ 3.840', detail: '86% do valor previsto', tone: 'info' } };
export const ProximaAtividade: Story = { args: { icon: CalendarDays, label: 'Próxima atividade', value: '24 jul', detail: 'Estudo mediúnico · 20h', tone: 'gold' } };
