import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Hero } from './hero';

const meta: Meta<typeof Hero> = {
  title: 'Sections/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    title: 'Portas abertas para a caridade e o Axé',
    subtitle: 'Um espaço de fé, amor e acolhimento espiritual sob a luz da Umbanda.',
    ctaText: 'Ver Agenda de Giras',
    backgroundImage: 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&q=80&w=1600', // Imagem de exemplo (velas/luz)
  },
};
