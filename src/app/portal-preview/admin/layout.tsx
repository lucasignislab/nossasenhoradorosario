import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { isPortalPreviewEnabled } from '@/lib/portal-preview';
import '@/styles/portal.css';
import '@/styles/portal-corporate.css';

export default function AdminPreviewLayout({ children }: { children: React.ReactNode }) {
  if (!isPortalPreviewEnabled) notFound();

  return (
    <DashboardLayout
      mode="admin"
      navigationPrefix="/portal-preview/admin"
      previewMode
      user={{ name: 'Iyá Pri', email: 'preview@senhoradorosario.org', role: 'admin' }}
    >
      {children}
    </DashboardLayout>
  );
}
