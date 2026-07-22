import type { Metadata } from 'next';
import { AuthForm } from '@/components/features/AuthForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata: Metadata = {
  title: 'Área dos Filhos | Terreiro Senhora do Rosário',
  description: 'Acesso reservado aos filhos do Terreiro Senhora do Rosário.',
};

type LoginPageProps = {
  searchParams: Promise<{ retorno?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { retorno } = await searchParams;

  return (
    <AuthForm
      configured={isSupabaseConfigured}
      returnTo={retorno?.startsWith('/') && !retorno.startsWith('//') ? retorno : '/dashboard'}
    />
  );
}
