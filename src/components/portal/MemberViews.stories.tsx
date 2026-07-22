import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MemberHome } from '@/app/(auth)/dashboard/page';
import { ProfileForm } from '@/components/features/ProfileForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  MemberAgenda,
  MemberAttendance,
  MemberChores,
  MemberFinance,
  MemberNotices,
  MemberStudies,
} from './MemberViews';

const memberUser = { name: 'Lucas Coelho', email: 'preview@senhoradorosario.org', role: 'developer' as const };

const meta = {
  title: 'Portal/Área dos filhos',
  parameters: {
    layout: 'fullscreen',
    nextjs: { navigation: { pathname: '/portal-preview/dashboard' } },
    docs: { description: { component: 'Serviços internos disponíveis para os filhos da casa, no mesmo sistema visual da administração.' } },
  },
  decorators: [
    (Story) => (
      <DashboardLayout mode="member" navigationPrefix="/portal-preview/dashboard" previewMode user={memberUser}>
        <Story />
      </DashboardLayout>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const VisaoGeral: Story = { name: 'Visão geral', render: () => <MemberHome basePath="/portal-preview/dashboard" /> };
export const AgendaInterna: Story = { name: 'Agenda interna', render: () => <MemberAgenda />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/dashboard/agenda' } } } };
export const EscalaDeCuidados: Story = { name: 'Escala de cuidados', render: () => <MemberChores />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/dashboard/faxinas' } } } };
export const MinhaFrequencia: Story = { name: 'Minha frequência', render: () => <MemberAttendance />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/dashboard/frequencia' } } } };
export const Estudos: Story = { render: () => <MemberStudies />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/dashboard/aulas' } } } };
export const Mensalidades: Story = { render: () => <MemberFinance />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/dashboard/financeiro' } } } };
export const Avisos: Story = { render: () => <MemberNotices />, parameters: { nextjs: { navigation: { pathname: '/portal-preview/dashboard/avisos' } } } };
export const MeuPerfil: Story = {
  name: 'Meu perfil',
  render: () => <ProfileForm fullName="Lucas Coelho" phone="(11) 99999-9999" email="preview@senhoradorosario.org" role="developer" joinedAt="2024-03-10" />,
  parameters: { nextjs: { navigation: { pathname: '/portal-preview/dashboard/perfil' } } },
};
