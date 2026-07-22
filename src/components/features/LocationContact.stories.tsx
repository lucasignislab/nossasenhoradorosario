import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { LocationContact } from './LocationContact';

const meta = {
  title: 'Site institucional/Seções/Localização e contato',
  component: LocationContact,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onFormSubmit: fn(),
  },
} satisfies Meta<typeof LocationContact>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Padrão
 * Com todas as informações e funcionalidades
 */
export const Default: Story = {
  args: {
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    latitude: -23.5505,
    longitude: -46.6333,
    phone: '(11) 98765-4321',
    email: 'contato@terreirosenhadorosario.com.br',
    hours: 'Segunda a Sexta: 18h - 22h | Sábado e Domingo: 14h - 22h',
  },
};

/**
 * Com Horário Customizado
 * Mostra flexibilidade de horas
 */
export const HorarioCustomizado: Story = {
  args: {
    address: 'Avenida Paulista, 1000 - São Paulo - SP',
    latitude: -23.5505,
    longitude: -46.6333,
    phone: '(11) 3333-3333',
    email: 'info@terreiro.com.br',
    hours: 'Terça a Quinta: 19h - 21h | Sexta a Domingo: 15h - 23h | Segunda: Fechado',
  },
};

/**
 * Versão Compacta
 * Com informações mínimas
 */
export const Compacta: Story = {
  args: {
    address: 'Rua do Axé, 456 - Vila Maria, São Paulo - SP',
    phone: '(11) 99999-8888',
    email: 'fale@terreiro.com.br',
  },
};

/**
 * Com URLs Customizadas
 * Para Waze e Google Maps específicos
 */
export const ComURLsCustomizadas: Story = {
  args: {
    address: 'Estrada da Fé, 789 - São Paulo - SP',
    latitude: -23.5,
    longitude: -46.6,
    phone: '(11) 91234-5678',
    email: 'contato@fe.com.br',
    hours: 'Seg-Dom: 16h - 23h',
    mapsUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.5789!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0edb6d%3A0x6c9c0c0c0c0c0c0c!2sTerreiro!5e0!3m2!1spt-BR!2sbr',
    wazeUrl: 'https://waze.com/ul?ll=-23.5505,-46.6333&navigate=yes',
  },
};
