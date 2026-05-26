import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { EventCard } from './event-card';

const meta = {
  title: 'Components/Features/EventCard',
  component: EventCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'radio',
      options: ['confirmada', 'cancelada'],
    },
    onClick: { action: 'clicked' },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Gira de Caboclo
 * Evento confirmado com informações básicas
 */
export const GiraDeCaboclo: Story = {
  args: {
    entity: 'Linha dos Caboclos',
    title: 'Gira de Caboclo',
    date: '20/03/2026',
    time: '20:00',
    status: 'confirmada',
    description: 'Sessão de atendimento com a Linha dos Caboclos',
  },
};

/**
 * Festa de Cosme e Damião
 * Evento confirmado com data diferente
 */
export const FestaCosmeeDamiao: Story = {
  args: {
    entity: 'Linha dos Santos',
    title: 'Festa de Cosme e Damião',
    date: '27/09/2026',
    time: '18:30',
    status: 'confirmada',
    description: 'Celebração dos santos gêmeos com presentes para as crianças',
  },
};

/**
 * Gira Cancelada
 * Evento cancelado com indicação visual clara
 */
export const GiraCancelada: Story = {
  args: {
    entity: 'Linha dos Pretos Velhos',
    title: 'Gira de Preto Velho',
    date: '25/03/2026',
    time: '19:00',
    status: 'cancelada',
    description: 'Evento cancelado por motivo de reformas no templo',
  },
};

/**
 * Variação Sem Descrição
 * Mostra como fica o card com apenas informações essenciais
 */
export const SemDescricao: Story = {
  args: {
    entity: 'Linha do Oriente',
    title: 'Gira Especial',
    date: '30/03/2026',
    time: '21:00',
    status: 'confirmada',
  },
};

/**
 * Múltiplos Cards
 * Exemplo de layout com vários eventos
 */
export const MultipleEvents: Story = {
  args: {
    entity: 'Múltiplos',
    title: 'Múltiplos Eventos',
    date: '20/03/2026',
    time: '20:00',
    status: 'confirmada',
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
      <EventCard
        entity="Linha dos Caboclos"
        title="Gira de Caboclo"
        date="20/03/2026"
        time="20:00"
        status="confirmada"
        description="Sessão de atendimento com a Linha dos Caboclos"
      />
      <EventCard
        entity="Linha dos Santos"
        title="Festa de Cosme e Damião"
        date="27/09/2026"
        time="18:30"
        status="confirmada"
        description="Celebração dos santos gêmeos"
      />
      <EventCard
        entity="Linha dos Pretos Velhos"
        title="Gira de Preto Velho"
        date="25/03/2026"
        time="19:00"
        status="cancelada"
        description="Evento cancelado por motivo de reformas"
      />
    </div>
  ),
};
