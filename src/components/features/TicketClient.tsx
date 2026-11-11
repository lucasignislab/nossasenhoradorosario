'use client';

import { useEffect, useMemo, useState } from 'react';
import { BellRing, Check, Loader2, Ticket } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { AttendanceSession, AttendanceTicket } from '@/types';

const STORAGE_KEY = (sessionId: string) => `sr-ticket-${sessionId}`;

/** Página pública do consulente: retira a senha e acompanha a chamada ao vivo. */
export function TicketClient({ session }: { session: AttendanceSession }) {
  const [name, setName] = useState('');
  const [myTicket, setMyTicket] = useState<AttendanceTicket | null>(null);
  const [lastCalled, setLastCalled] = useState(session.last_called);
  const [sessionStatus, setSessionStatus] = useState(session.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recupera a senha retirada anteriormente neste navegador.
  useEffect(() => {
    const storedId = window.localStorage.getItem(STORAGE_KEY(session.id));
    if (!storedId) return;
    const supabase = createClient();
    supabase
      .from('attendance_tickets')
      .select('*')
      .eq('id', storedId)
      .single()
      .then(({ data }) => {
        if (data) setMyTicket(data as AttendanceTicket);
        else window.localStorage.removeItem(STORAGE_KEY(session.id));
      });
  }, [session.id]);

  // Chamada ao vivo: atualiza quando a administração chama a próxima senha.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`atendimento-${session.id}`)
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
        (payload) => {
          setMyTicket((current) => {
            if (!current) return current;
            if (payload.eventType === 'DELETE') {
              const old = payload.old as { id?: string };
              if (old.id === current.id) {
                window.localStorage.removeItem(STORAGE_KEY(session.id));
                return null;
              }
              return current;
            }
            const row = payload.new as AttendanceTicket;
            return row.id === current.id ? row : current;
          });
        },
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [session.id]);

  const issue = async (event: React.FormEvent) => {
    event.preventDefault();
    const visitorName = name.trim().slice(0, 120);
    if (visitorName.length < 2) {
      setError('Informe seu nome para retirar a senha.');
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { data: maxRows } = await supabase
        .from('attendance_tickets')
        .select('number')
        .eq('session_id', session.id)
        .order('number', { ascending: false })
        .limit(1);
      const nextNumber = ((maxRows ?? [])[0]?.number ?? 0) + 1;

      const { data, error: insertError } = await supabase
        .from('attendance_tickets')
        .insert({ session_id: session.id, number: nextNumber, visitor_name: visitorName })
        .select('*')
        .single();

      if (!insertError && data) {
        setMyTicket(data as AttendanceTicket);
        window.localStorage.setItem(STORAGE_KEY(session.id), data.id);
        setLoading(false);
        return;
      }
      // Conflito de numeração (duas pessoas ao mesmo tempo): tenta de novo.
      if (insertError && insertError.code !== '23505') break;
    }
    setError('Não foi possível retirar sua senha agora. Tente novamente.');
    setLoading(false);
  };

  const position = useMemo(() => {
    if (!myTicket || myTicket.status !== 'aguardando') return null;
    return Math.max(0, myTicket.number - lastCalled - 1);
  }, [myTicket, lastCalled]);

  return (
    <div className="ticket-page">
      <div className="ticket-page__card">
        <div className="ticket-page__brand"><Ticket size={20} /> Senhas do atendimento</div>
        <h1>{session.title}</h1>
        <p className="ticket-page__meta">
          Terreiro de Umbanda Senhora do Rosário · {new Date(`${session.session_date}T12:00:00`).toLocaleDateString('pt-BR')}
        </p>

        {sessionStatus === 'encerrada' ? (
          <p className="ticket-page__closed">A distribuição de senhas deste atendimento foi encerrada. Axé!</p>
        ) : myTicket ? (
          <div className="ticket-page__status" aria-live="polite">
            <span className="ticket-page__label">Sua senha</span>
            <strong className="ticket-page__number">{String(myTicket.number).padStart(3, '0')}</strong>
            {myTicket.status === 'aguardando' ? (
              <>
                <span className="ticket-page__now">Chamando agora: <strong>{String(lastCalled).padStart(3, '0')}</strong></span>
                <span className="ticket-page__position">
                  {position === 0 ? 'Você é o(a) próximo(a)! Fique atento(a).' : position ? `${position} ${position === 1 ? 'pessoa' : 'pessoas'} na sua frente` : '—'}
                </span>
              </>
            ) : myTicket.status === 'chamado' ? (
              <span className="ticket-page__called"><BellRing size={18} /> É a sua vez! Dirija-se ao atendimento.</span>
            ) : myTicket.status === 'atendido' ? (
              <span className="ticket-page__position"><Check size={16} /> Atendimento concluído. Axé!</span>
            ) : (
              <span className="ticket-page__position">Senha marcada como ausente. Procure a recepção da casa.</span>
            )}
          </div>
        ) : (
          <form onSubmit={issue} className="ticket-page__form">
            <label>
              <span>Seu nome</span>
              <input required minLength={2} maxLength={120} value={name} onChange={(change) => setName(change.target.value)} placeholder="Como devemos te chamar?" autoFocus />
            </label>
            {error ? <p className="ticket-page__error" role="alert">{error}</p> : null}
            <button type="submit" disabled={loading}>
              {loading ? <Loader2 size={16} className="is-spinning" /> : <Ticket size={16} />} {loading ? 'Retirando…' : 'Retirar minha senha'}
            </button>
          </form>
        )}
      </div>
      <p className="ticket-page__foot">Guarde esta página aberta — ela atualiza sozinha quando sua senha for chamada.</p>
    </div>
  );
}
