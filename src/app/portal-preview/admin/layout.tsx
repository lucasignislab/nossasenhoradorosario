import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import '@/styles/portal.css';

export default function AdminPreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== 'development') notFound();

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
