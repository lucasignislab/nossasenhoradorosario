'use client';

import { useCallback, useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { AttendanceSession, AttendanceTicket } from '@/types';

/** Telão da gira: mostra a senha chamada em destaque e as próximas da fila, ao vivo. */
export function CallBoardClient({ session, initialQueue }: { session: AttendanceSession; initialQueue: AttendanceTicket[] }) {
  const [lastCalled, setLastCalled] = useState(session.last_called);
  const [queue, setQueue] = useState<AttendanceTicket[]>(initialQueue);
  const [sessionStatus, setSessionStatus] = useState(session.status);

  const refreshQueue = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('attendance_tickets')
      .select('*')
      .eq('session_id', session.id)
      .in('status', ['aguardando', 'chamado'])
      .order('number', { ascending: true })
      .limit(8);
    setQueue((data ?? []) as AttendanceTicket[]);
  }, [session.id]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`chamada-${session.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_sessions', filter: `id=eq.${session.id}` },
        (payload) => {
          const row = payload.new as AttendanceSession;
          setLastCalled(row.last_called);
          setSessionStatus(row.status);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_tickets', filter: `session_id=eq.${session.id}` },
        () => { void refreshQueue(); },
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [session.id, refreshQueue]);

  const calledTicket = queue.find((ticket) => ticket.number === lastCalled);

  return (
    <div className="call-board">
      <header className="call-board__header">
        <span className="call-board__brand">SR</span>
        <div>
          <h1>{session.title}</h1>
          <p>Terreiro de Umbanda Senhora do Rosário · {new Date(`${session.session_date}T12:00:00`).toLocaleDateString('pt-BR')}</p>
        </div>
        {sessionStatus === 'encerrada' ? <span className="call-board__closed">Atendimento encerrado</span> : null}
      </header>

      <main className="call-board__main" aria-live="polite">
        <span className="call-board__label"><Megaphone size={22} /> Chamando agora</span>
        <strong className="call-board__number">{String(lastCalled).padStart(3, '0')}</strong>
        {calledTicket ? <span className="call-board__name">{calledTicket.visitor_name}</span> : null}
      </main>

      <footer className="call-board__footer">
        <span className="call-board__next-label">Próximas senhas</span>
        <div className="call-board__next">
          {queue.filter((ticket) => ticket.number > lastCalled).slice(0, 3).map((ticket) => (
            <span key={ticket.id} className="call-board__next-item">{String(ticket.number).padStart(3, '0')}</span>
          ))}
          {queue.filter((ticket) => ticket.number > lastCalled).length === 0 ? (
            <span className="call-board__next-empty">Fila vazia</span>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
