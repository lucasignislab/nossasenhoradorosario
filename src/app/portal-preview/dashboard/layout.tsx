import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { isPortalPreviewEnabled } from '@/lib/portal-preview';
import '@/styles/dashboard-home.css';
import '@/styles/portal.css';
import '@/styles/portal-corporate.css';

export default function MemberPreviewLayout({ children }: { children: React.ReactNode }) {
  if (!isPortalPreviewEnabled) notFound();

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
