import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { Hero } from './Hero';

const meta = {
  title: 'Site institucional/Seções/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    overlayOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    backgroundImage: { control: 'text' },
    backgroundImages: { control: 'object' },
  },
  args: {
    onButtonClick: fn(),
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Hero Padrão
 * Versão com frase de acolhimento
 */
export const Default: Story = {
  name: 'Padrão',
  args: {
    backgroundImage: '/images/home/hero-fundamentos.jpg',
    backgroundImages: [
      '/images/home/hero-atabaques.jpg',
      '/images/home/hero-fundamentos.jpg',
      '/images/home/hero-acolhimento.jpg',
    ],
    title: 'Portas abertas para a caridade e o Axé',
    subtitle:
      'Somos um espaço de fé, acolhimento e transformação espiritual. Venha conhecer a Umbanda com respeito e amor.',
    buttonLabel: 'Ver Agenda de Giras',
  },
};

/**
 * Com Imagem de Fundo
 * Exibe como o texto se comporta sobre uma imagem (com overlay)
 */
export const ComImagemFundo: Story = {
  args: {
    backgroundImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    title: 'Portas abertas para a caridade e o Axé',
    subtitle:
      'Somos um espaço de fé, acolhimento e transformação espiritual. Venha conhecer a Umbanda com respeito e amor.',
    buttonLabel: 'Ver Agenda de Giras',
    overlayOpacity: 0.5,
  },
};

/**
 * Overlay Mais Escuro
 * Para melhor legibilidade sobre imagens claras
 */
export const OverlayEscuro: Story = {
  args: {
    backgroundImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    title: 'Portas abertas para a caridade e o Axé',
    subtitle:
      'Somos um espaço de fé, acolhimento e transformação espiritual. Venha conhecer a Umbanda com respeito e amor.',
    overlayOpacity: 0.7,
  },
};

/**
 * Overlay Transparente
 * Menos contraste para imagens com tons mais escuros
 */
export const OverlayLeve: Story = {
  args: {
    backgroundImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    title: 'Portas abertas para a caridade e o Axé',
    subtitle:
      'Somos um espaço de fé, acolhimento e transformação espiritual. Venha conhecer a Umbanda com respeito e amor.',
    overlayOpacity: 0.2,
  },
};

/**
 * Sem Imagem
 * Versão com background sólido
 */
export const SemImagem: Story = {
  args: {
    title: 'Descubra o Poder da Umbanda',
    subtitle:
      'Um caminho de luz, amor e espiritualidade. Transforme sua vida através da fé e do axé.',
    buttonLabel: 'Agendar uma Consulta',
  },
};
