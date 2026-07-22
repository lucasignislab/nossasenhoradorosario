import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import AgendaPage from './page';

const meta = {
  title: 'Páginas/Site institucional/Agenda',
  component: AgendaPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AgendaPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Página de Agenda de Giras
 * Exibe a programação mensal de giras e trabalhos espirituais
 * com abas para Giras Regulares e Eventos/Festas.
 */
export const Padrao: Story = {};
