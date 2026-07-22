import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Plus } from 'lucide-react';
import { PageHeader } from './PortalUI';

const meta = {
  title: 'Fundamentos/Componentes/Cabeçalho de página',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Introduz uma área de trabalho com contexto, título, descrição e uma ação principal opcional.' } },
  },
  decorators: [(Story) => <div className="dashboard-layout portal-story-canvas"><div className="portal-page"><Story /></div></div>],
  args: {
    eyebrow: 'Gestão da casa',
    title: 'Filhos da casa',
    description: 'Acompanhe cadastros, permissões e informações da comunidade.',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComAcao: Story = {
  args: {
    action: <button className="portal-button portal-button--primary"><Plus size={16} /> Novo cadastro</button>,
  },
};
