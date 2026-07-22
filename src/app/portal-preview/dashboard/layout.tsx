import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import '@/styles/dashboard-home.css';
import '@/styles/portal.css';

export default function MemberPreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <DashboardLayout
      navigationPrefix="/portal-preview/dashboard"
      previewMode
      user={{ name: 'Lucas Coelho', email: 'preview@senhoradorosario.org', role: 'developer' }}
    >
      {children}
    </DashboardLayout>
  );
}
