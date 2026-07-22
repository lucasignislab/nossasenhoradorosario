import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ContentSection } from './content-section';

const meta: Meta<typeof ContentSection> = {
  title: 'Site institucional/Seções/Conteúdo editorial',
  component: ContentSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ContentSection>;

// Cenário 1: Texto na Esquerda, Imagem na Direita (Padrão)
export const Default: Story = {
  name: 'Manifesto da casa',
  args: {
    subtitle: 'O Terreiro',
    title: 'Uma comunidade de luz e respeito',
    text: 'A Senhora do Rosário é um espaço de resistência, acolhimento e cuidado coletivo.\n\nAqui, a Umbanda é vivida em sua essência: caridade, humildade e sabedoria ancestral.',
    quote: 'Antes de buscar um milagre, precisamos ser o milagre no mundo do outro.',
    image: '/images/home/section-community.jpg',
    imageCaption: 'Nossa casa, nossa comunidade',
    linkLabel: 'Conheça nossa história',
    linkHref: '/sobre',
    reverse: false,
  },
};

// Cenário 2: Imagem na Esquerda, Texto na Direita (Invertido)
export const Inverted: Story = {
  name: 'Imagem à esquerda',
  args: {
    title: 'Nossos Valores',
    text: 'Respeito, humildade e amor ao próximo são os pilares que sustentam nossa casa.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800',
    reverse: true,
  },
};
