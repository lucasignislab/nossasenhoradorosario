import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BlogCard } from './blog-card';

const meta = {
  title: 'Site institucional/Componentes/Card de conteúdo',
  component: BlogCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Card de Postagem de Blog
 * Exibe uma prévia de artigo com imagem, categoria, título,
 * resumo e data de publicação.
 */
export const Padrao: Story = {
  args: {
    title: 'A Importância da Gira de Caboclos na Umbanda',
    excerpt:
      'Descubra a força e a sabedoria dos Caboclos, guardiões da mata que trazem cura e proteção para os filhos da casa.',
    category: 'Tradição',
    date: '15 de março de 2026',
    image:
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800',
  },
};

export const PostFestividade: Story = {
  args: {
    title: 'Festa de Cosme e Damião: Tradição e Caridade',
    excerpt:
      'Uma das celebrações mais marcantes do calendário umbandista, marcada pela distribuição de doces às crianças.',
    category: 'Festas',
    date: '27 de setembro de 2026',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
  },
};

export const PostEstudo: Story = {
  args: {
    title: 'Os Pretos Velhos e a Sabedoria Ancestraal',
    excerpt:
      'Conheça a história e a espiritualidade dos Pretos Velhos, entidades que carregam a luz da experiência e do perdão.',
    category: 'Estudos',
    date: '02 de fevereiro de 2026',
    image:
      'https://images.unsplash.com/photo-1595133606775-fe0e3f0ae866?q=80&w=800',
  },
};
