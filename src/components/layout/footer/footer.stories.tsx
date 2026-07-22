import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer } from './footer';

const meta: Meta<typeof Footer> = {
  title: 'Site institucional/Estrutura/Rodapé',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = { name: 'Padrão' };
