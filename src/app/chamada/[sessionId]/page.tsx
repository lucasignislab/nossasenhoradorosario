import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CallBoardClient } from '@/components/features/CallBoardClient';
import type { AttendanceSession, AttendanceTicket } from '@/types';

export const metadata: Metadata = {
  title: 'Painel de chamada | Senhora do Rosário',
  description: 'Painel de chamada de senhas do atendimento.',
};

export default async function ChamadaPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data: session } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) notFound();

  const { data: queue } = await supabase
    .from('attendance_tickets')
    .select('*')
    .eq('session_id', session.id)
    .in('status', ['aguardando', 'chamado'])
    .order('number', { ascending: true })
    .limit(8);

  return <CallBoardClient session={session as AttendanceSession} initialQueue={(queue ?? []) as AttendanceTicket[]} />;
}
