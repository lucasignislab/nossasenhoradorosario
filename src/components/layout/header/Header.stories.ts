import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Site institucional/Estrutura/Cabeçalho',
  component: Header,
  parameters: {
    layout: 'fullscreen', // Header ocupa a largura toda
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = { name: 'Padrão' };
