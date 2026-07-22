import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar } from './PortalUI';

const meta = {
  title: 'Fundamentos/Componentes/Progresso',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Apresenta evolução percentual com rótulo textual e alternativa acessível.' } },
  },
  decorators: [(Story) => <div className="dashboard-layout portal-story-canvas"><div className="portal-page"><section className="portal-panel portal-story-narrow"><Story /></section></div></div>],
  args: { value: 84, label: 'Estudos e aulas' },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};
export const Inicial: Story = { args: { value: 24, label: 'Cuidados da casa' } };
export const Completo: Story = { args: { value: 100, label: 'Giras de desenvolvimento' } };
