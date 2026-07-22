import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card', // Como aparece no menu do Storybook
  component: Card,
  parameters: {
    layout: 'centered', // Centraliza o card na tela de teste
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

// Exemplo 1: Card de Gira (Página Inicial)
export const ProximaGira: Story = {
  args: {
    title: 'Gira de Caboclo',
    subtitle: 'Sexta-feira • 20:00h',
    children: 'Trabalhos de passe e consulta com a falange dos Caboclos. Abertura do portão às 19:30h.',
    footer: <span className="text-xs font-bold text-orange-600">ENTRADA LIVRE</span>,
    variant: 'default',
  },
};

// Exemplo 2: Card de Conteúdo (Área de Membros)
export const AulaExclusiva: Story = {
  args: {
    title: 'Fundamentos da Defumação',
    subtitle: 'Módulo de Estudos • PDF',
    children: 'Guia completo sobre as ervas sagradas utilizadas na limpeza do terreiro e dos médiuns.',
    footer: (
      <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
        Descarregar PDF
      </button>
    ),
    variant: 'highlight',
  },
};
