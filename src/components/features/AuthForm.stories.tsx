import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AuthForm } from './AuthForm';

const meta = {
  title: 'Portal/Acesso',
  component: AuthForm,
  parameters: {
    layout: 'fullscreen',
    nextjs: { navigation: { pathname: '/login' } },
    docs: { description: { component: 'Entrada da área reservada, incluindo os atalhos de demonstração usados no ambiente de testes.' } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AmbienteDeTestes: Story = {
  args: { configured: true, previewEnabled: true, returnTo: '/portal-preview/dashboard' },
};

export const AcessoReal: Story = {
  args: { configured: true, previewEnabled: false, returnTo: '/dashboard' },
};

export const ConfiguracaoPendente: Story = {
  args: { configured: false, previewEnabled: false, returnTo: '/dashboard' },
};

export const FluxoDeCadastro: Story = {
  args: { configured: true, previewEnabled: false, returnTo: '/dashboard' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Criar acesso' }));
    await expect(canvas.getByRole('heading', { name: 'Faça parte da nossa casa' })).toBeVisible();
    await expect(canvas.getByLabelText('Nome completo')).toBeVisible();
    await expect(canvas.getByLabelText('Confirme a senha')).toBeVisible();
  },
};
