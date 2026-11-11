import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TicketClient } from '@/components/features/TicketClient';
import type { AttendanceSession } from '@/types';

export const metadata: Metadata = {
  title: 'Retirar senha do atendimento | Senhora do Rosário',
  description: 'Retire sua senha do atendimento e acompanhe a chamada ao vivo.',
};

export default async function SenhaPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();

  if (!data) notFound();

  return <TicketClient session={data as AttendanceSession} />;
}
