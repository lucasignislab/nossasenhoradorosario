'use client';

import { useMemo, useState, useTransition } from 'react';
import { Check, ListChecks } from 'lucide-react';
import { saveAttendance, type AttendanceRecord } from '@/app/(auth)/admin/frequencia/actions';
import { formatEventDate } from '@/lib/events';
import { profileDisplayName, profileInitial } from '@/lib/members';
import type { PortalEvent, Profile } from '@/types';

type MemberMark = 'present' | 'absent' | 'justified';

export type AttendanceSheetEventMark = { present: boolean; justified: boolean };

type AttendanceSheetProps = {
  events: PortalEvent[];
  members: Profile[];
  /** Marcas existentes: eventId -> profileId -> marca. */
  existing: Record<string, Record<string, AttendanceSheetEventMark>>;
};

const MARK_LABELS: { value: MemberMark; label: string }[] = [
  { value: 'present', label: 'Presente' },
  { value: 'absent', label: 'Faltou' },
  { value: 'justified', label: 'Justificada' },
];

export function AttendanceSheet({ events, members, existing }: AttendanceSheetProps) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? '');
  const [marks, setMarks] = useState<Record<string, MemberMark>>({});
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const effectiveMarks = useMemo(() => {
    const stored = existing[selectedEventId] ?? {};
    const result: Record<string, MemberMark> = {};
    for (const member of members) {
      if (marks[member.id]) {
        result[member.id] = marks[member.id];
      } else if (stored[member.id]) {
        const mark = stored[member.id];
        result[member.id] = mark.present ? 'present' : mark.justified ? 'justified' : 'absent';
      } else {
        result[member.id] = 'present';
      }
    }
    return result;
  }, [existing, marks, members, selectedEventId]);

  const selectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setMarks({});
    setFeedback(null);
  };

  const save = () => {
    if (!selectedEventId) return;
    const records: AttendanceRecord[] = members.map((member) => {
      const mark = effectiveMarks[member.id] ?? 'present';
      return {
        profileId: member.id,
        present: mark === 'present',
        justified: mark === 'justified',
      };
    });
    setFeedback(null);
    startTransition(async () => {
      const result = await saveAttendance(selectedEventId, records);
      setFeedback(result.ok
        ? { kind: 'ok', message: 'Chamada salva com sucesso.' }
        : { kind: 'error', message: result.error });
    });
  };

  if (events.length === 0) {
    return <p className="portal-panel__copy">Cadastre uma atividade na agenda para registrar a frequência.</p>;
  }

  return (
    <div className="portal-attendance-sheet">
      <label className="portal-field">
        <span>Atividade</span>
        <select value={selectedEventId} onChange={(change) => selectEvent(change.target.value)}>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {formatEventDate(event.event_date)} · {event.title}
            </option>
          ))}
        </select>
      </label>

      <div className="portal-table-wrap">
        <table className="portal-table">
          <thead>
            <tr><th>Filho da casa</th><th>Presença</th></tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr><td colSpan={2}>Nenhum filho ativo para a chamada.</td></tr>
            ) : (
              members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="portal-table-person">
                      <span>{profileInitial(member)}</span>
                      <strong>{profileDisplayName(member)}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="portal-mark-group" role="radiogroup" aria-label={`Presença de ${profileDisplayName(member)}`}>
                      {MARK_LABELS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`portal-mark portal-mark--${option.value}${effectiveMarks[member.id] === option.value ? ' is-active' : ''}`}
                          aria-pressed={effectiveMarks[member.id] === option.value}
                          disabled={isPending}
                          onClick={() => setMarks((current) => ({ ...current, [member.id]: option.value }))}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="portal-modal__actions">
        {feedback ? (
          <p className={feedback.kind === 'ok' ? 'portal-action-success' : 'portal-action-error'} role="status">
            {feedback.message}
          </p>
        ) : null}
        <button type="button" className="portal-button portal-button--primary" disabled={isPending || !selectedEventId || members.length === 0} onClick={save}>
          <Check size={15} /> Salvar chamada
        </button>
      </div>
    </div>
  );
}
