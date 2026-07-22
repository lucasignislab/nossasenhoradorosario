import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { AgendaSection } from './AgendaSection';

const meta = {
  title: 'Site institucional/Seções/Agenda',
  component: AgendaSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onEventClick: fn(),
    onViewAllClick: fn(),
  },
} satisfies Meta<typeof AgendaSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Com 3 Eventos
 * Estado padrão com eventos confirmados
 */
export const ComTresEventos: Story = {
  args: {
    events: [
      {
        entity: 'Linha dos Caboclos',
        title: 'Gira de Caboclo',
        date: '20/03/2026',
        time: '20:00',
        status: 'confirmada',
        description: 'Sessão de atendimento com a Linha dos Caboclos',
      },
      {
        entity: 'Linha dos Santos',
        title: 'Festa de Cosme e Damião',
        date: '27/09/2026',
        time: '18:30',
        status: 'confirmada',
        description: 'Celebração dos santos gêmeos com presentes para as crianças',
      },
      {
        entity: 'Linha do Oriente',
        title: 'Gira Especial de Orixás',
        date: '30/03/2026',
        time: '21:00',
        status: 'confirmada',
        description: 'sessão dedicada aos Orixás com bênção e oferendas',
      },
    ],
    showViewAllButton: true,
  },
};

/**
 * Com Evento Cancelado
 * Mostra como fica a agenda com eventos mistos
 */
export const ComEventoCancelado: Story = {
  args: {
    events: [
      {
        entity: 'Linha dos Caboclos',
        title: 'Gira de Caboclo',
        date: '20/03/2026',
        time: '20:00',
        status: 'confirmada',
        description: 'Sessão de atendimento com a Linha dos Caboclos',
      },
      {
        entity: 'Linha dos Pretos Velhos',
        title: 'Gira de Preto Velho',
        date: '25/03/2026',
        time: '19:00',
        status: 'cancelada',
        description: 'Evento cancelado por motivo de reformas no templo',
      },
    ],
  },
};

/**
 * Empty State
 * Quando não há giras agendadas
 */
export const SemEventos: Story = {
  args: {
    events: [],
    emptyStateText:
      'Nenhuma gira agendada no momento. Volte em breve para conhecer nossos próximos eventos!',
    showViewAllButton: false,
  },
};

/**
 * Apenas 1 Evento
 * Agenda com apenas um evento próximo
 */
export const UmEvento: Story = {
  args: {
    events: [
      {
        entity: 'Linha dos Caboclos',
        title: 'Gira de Caboclo',
        date: '20/03/2026',
        time: '20:00',
        status: 'confirmada',
        description: 'Sessão de atendimento com a Linha dos Caboclos',
      },
    ],
    title: 'Próximo Evento',
  },
};

/**
 * Com 2 Eventos
 * Layout com apenas dois eventos
 */
export const DoisEventos: Story = {
  args: {
    events: [
      {
        entity: 'Linha dos Caboclos',
        title: 'Gira de Caboclo',
        date: '20/03/2026',
        time: '20:00',
        status: 'confirmada',
        description: 'Sessão de atendimento com a Linha dos Caboclos',
      },
      {
        entity: 'Linha dos Santos',
        title: 'Festa de Cosme e Damião',
        date: '27/09/2026',
        time: '18:30',
        status: 'confirmada',
        description: 'Celebração dos santos gêmeos',
      },
    ],
  },
};
