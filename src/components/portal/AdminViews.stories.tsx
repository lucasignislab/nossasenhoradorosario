import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  AdminOverview,
  AdminSettings,
  AgendaManagement,
  AttendanceDashboard,
  ContentManagement,
  FinanceDashboard,
  MembersManagement,
} from './AdminViews';

const adminUser = { name: 'Iyá Pri', email: 'iya.pri@senhoradorosario.org', role: 'admin' as const };

const meta = {
  title: 'Portal/Administração',
  parameters: {
    layout: 'fullscreen',
    nextjs: { navigation: { pathname: '/portal-preview/admin' } },
    docs: { description: { component: 'Telas corporativas de gestão da casa, apresentadas no shell administrativo completo.' } },
  },
  decorators: [
    (Story) => (
      <DashboardLayout mode="admin" navigationPrefix="/portal-preview/admin" previewMode user={adminUser}>
        <Story />
      </DashboardLayout>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const VisaoGeral: Story = { name: 'Visão geral', render: () => <AdminOverview basePath="/portal-preview/admin" /> };
export const Financeiro: Story = { name: 'Financeiro', render: () => <FinanceDashboard />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/admin/financeiro' } } } };
export const Frequencia: Story = { name: 'Frequência', render: () => <AttendanceDashboard />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/admin/frequencia' } } } };
export const FilhosDaCasa: Story = { name: 'Filhos da casa', render: () => <MembersManagement />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/admin/membros' } } } };
export const AgendaEGiras: Story = { name: 'Agenda e giras', render: () => <AgendaManagement />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/admin/agenda' } } } };
export const Conteudos: Story = { name: 'Conteúdos', render: () => <ContentManagement />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/admin/conteudos' } } } };
export const Configuracoes: Story = { name: 'Configurações', render: () => <AdminSettings />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/admin/configuracoes' } } } };
