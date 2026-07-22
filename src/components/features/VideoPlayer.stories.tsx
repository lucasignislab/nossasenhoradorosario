import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { VideoPlayer } from './VideoPlayer';

const meta = {
  title: 'Site institucional/Componentes/Player de vídeo',
  component: VideoPlayer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Desenvolvimento Mediúnico
 * Vídeo com materiais para download
 */
export const ComDownloads: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Desenvolvimento Mediúnico - Aula 1',
    category: 'Desenvolvimento Mediúnico',
    description:
      'Fundamentos do desenvolvimento mediúnico, técnicas de meditação e preparação espiritual para o trabalho com mediunidade.',
    downloads: [
      { name: 'Roteiro-Aula-1.pdf', url: '#' },
      { name: 'Exercicios-Praticos.pdf', url: '#' },
      { name: 'Referencias-Bibliograficas.pdf', url: '#' },
    ],
  },
};

/**
 * Sem Downloads
 * Apenas vídeo e descrição
 */
export const SemDownloads: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Cantigas Sagradas da Umbanda',
    category: 'Cantigas',
    description:
      'Aprenda as principais cantigas sagradas usadas nos rituais da Umbanda. Cada cântica tem sua importância e propósito específico.',
  },
};

/**
 * Vimeo
 * Exemplo com vídeo de Vimeo
 */
export const Vimeo: Story = {
  args: {
    videoUrl: 'https://vimeo.com/90509568',
    title: 'Os Orixás e Seus Ensinamentos',
    category: 'Espiritualidade',
    description:
      'Conheça os Orixás, suas características, energia e ensinamentos para a vida cotidiana.',
  },
};

/**
 * Minimalista
 * Apenas título e vídeo
 */
export const Minimalista: Story = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Boas-vindas ao Curso',
  },
};
