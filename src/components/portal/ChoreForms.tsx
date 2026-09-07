'use client';

import { useEffect, useState, useTransition } from 'react';
import { CalendarPlus, Check, CheckCircle2, Pencil, Plus, Trash2, UserMinus, UserPlus, X, XCircle } from 'lucide-react';
import {
  addTeamMember,
  createSchedule,
  createTeam,
  deleteSchedule,
  deleteTeam,
  removeTeamMember,
  updateScheduleStatus,
  updateTeam,
} from '@/app/(auth)/admin/faxinas/actions';
import { profileDisplayName, profileInitial } from '@/lib/members';
import type { ChoreSchedule, ChoreTeam, Profile } from '@/types';

type ActionRunner = (run: () => Promise<{ ok: true } | { ok: false; error: string }>) => void;

function useActionRunner(): [boolean, string | null, ActionRunner, (message: string | null) => void] {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const run: ActionRunner = (action) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error);
    });
  };
  return [isPending, error, run, setError];
}

function useEscape(onClose: () => void) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
}

/* ------------------------------ Equipe (form) ------------------------------ */

type TeamFormModalProps = { team: ChoreTeam | null; onClose: () => void };

function TeamFormModal({ team, onClose }: TeamFormModalProps) {
  const [name, setName] = useState(team?.name ?? '');
  const [description, setDescription] = useState(team?.description ?? '');
  const [active, setActive] = useState(team?.active ?? true);
  const [isPending, error, run] = useActionRunner();
  useEscape(onClose);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    run(async () => {
      const result = team
        ? await updateTeam(team.id, { name, description, active })
        : await createTeam({ name, description });
      if (result.ok) onClose();
      return result;
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-label={team ? `Editar ${team.name}` : 'Nova equipe'} onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <h2>{team ? 'Editar equipe' : 'Nova equipe'}</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}><X size={17} /></button>
        </div>
        <form onSubmit={submit} className="portal-form">
          <label className="portal-field">
            <span>Nome *</span>
            <input required minLength={3} value={name} onChange={(change) => setName(change.target.value)} placeholder="Ex.: Equipe Oxóssi" />
          </label>
          <label className="portal-field">
            <span>Descrição</span>
            <textarea rows={3} value={description} onChange={(change) => setDescription(change.target.value)} placeholder="Quais cuidados esta equipe costuma assumir" />
          </label>
          {team ? (
            <label className="portal-field portal-field--checkbox">
              <input type="checkbox" checked={active} onChange={(change) => setActive(change.target.checked)} />
              <span>Equipe ativa</span>
            </label>
          ) : null}
          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>Cancelar</button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
              <Check size={15} /> {team ? 'Salvar alterações' : 'Criar equipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewChoreTeamButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="portal-button portal-button--secondary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Nova equipe
      </button>
      {open ? <TeamFormModal team={null} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/* ------------------------------ Escala (form) ------------------------------ */

function ScheduleFormModal({ teams, onClose }: { teams: ChoreTeam[]; onClose: () => void }) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [choreDate, setChoreDate] = useState('');
  const [tasks, setTasks] = useState('');
  const [notes, setNotes] = useState('');
  const [isPending, error, run] = useActionRunner();
  useEscape(onClose);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    run(async () => {
      const result = await createSchedule({ team_id: teamId, chore_date: choreDate, tasks, notes });
      if (result.ok) onClose();
      return result;
    });
  };

  return (
    <div className="portal-modal-overlay" role="presentation" onClick={onClose}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-label="Agendar faxina" onClick={(click) => click.stopPropagation()}>
        <div className="portal-modal__header">
          <h2>Agendar faxina</h2>
          <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={onClose}><X size={17} /></button>
        </div>
        <form onSubmit={submit} className="portal-form">
          <div className="portal-form__row">
            <label className="portal-field">
              <span>Equipe *</span>
              <select value={teamId} onChange={(change) => setTeamId(change.target.value)}>
                {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
            </label>
            <label className="portal-field">
              <span>Data *</span>
              <input required type="date" value={choreDate} onChange={(change) => setChoreDate(change.target.value)} />
            </label>
          </div>
          <label className="portal-field">
            <span>Cuidados do dia (um por linha) *</span>
            <textarea required rows={4} value={tasks} onChange={(change) => setTasks(change.target.value)} placeholder={'Limpeza do salão principal\nOrganização da cozinha\nCuidados com o congá'} />
          </label>
          <label className="portal-field">
            <span>Observações</span>
            <textarea rows={2} value={notes} onChange={(change) => setNotes(change.target.value)} placeholder="Materiais necessários, horário de chegada..." />
          </label>
          {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
          <div className="portal-modal__actions">
            <button type="button" className="portal-button portal-button--secondary" onClick={onClose} disabled={isPending}>Cancelar</button>
            <button type="submit" className="portal-button portal-button--primary" disabled={isPending || teams.length === 0}>
              <Check size={15} /> Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewChoreScheduleButton({ teams }: { teams: ChoreTeam[] }) {
  const [open, setOpen] = useState(false);
  const activeTeams = teams.filter((team) => team.active);
  return (
    <>
      <button type="button" className="portal-button portal-button--primary" disabled={activeTeams.length === 0} onClick={() => setOpen(true)}>
        <CalendarPlus size={16} /> Agendar faxina
      </button>
      {open ? <ScheduleFormModal teams={activeTeams} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/* --------------------------- Membros da equipe ----------------------------- */

export function ChoreTeamMembersEditor({ team, memberIds, members }: { team: ChoreTeam; memberIds: string[]; members: Profile[] }) {
  const [isPending, error, run] = useActionRunner();
  const [selected, setSelected] = useState('');
  const inTeam = members.filter((member) => memberIds.includes(member.id));
  const available = members.filter((member) => !memberIds.includes(member.id));

  return (
    <div className="portal-team-editor">
      <div className="member-team-grid">
        {inTeam.length === 0 ? <p className="portal-panel__copy">Ninguém nesta equipe ainda.</p> : inTeam.map((member) => (
          <div key={member.id}>
            <span>{profileInitial(member)}</span>
            <strong>{profileDisplayName(member)}</strong>
            <button
              type="button"
              className="portal-icon-button"
              aria-label={`Remover ${profileDisplayName(member)} de ${team.name}`}
              disabled={isPending}
              onClick={() => run(() => removeTeamMember(team.id, member.id))}
            >
              <UserMinus size={13} />
            </button>
          </div>
        ))}
      </div>
      <div className="portal-team-editor__add">
        <select value={selected} onChange={(change) => setSelected(change.target.value)} aria-label={`Adicionar pessoa à ${team.name}`}>
          <option value="">Adicionar pessoa...</option>
          {available.map((member) => <option key={member.id} value={member.id}>{profileDisplayName(member)}</option>)}
        </select>
        <button
          type="button"
          className="portal-button portal-button--secondary portal-button--small"
          disabled={isPending || !selected}
          onClick={() => {
            run(async () => {
              const result = await addTeamMember(team.id, selected);
              if (result.ok) setSelected('');
              return result;
            });
          }}
        >
          <UserPlus size={14} /> Adicionar
        </button>
      </div>
      {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
    </div>
  );
}

/* ------------------------------- Ações gerais ------------------------------ */

export function ChoreTeamActions({ team }: { team: ChoreTeam }) {
  const [editing, setEditing] = useState(false);
  const [isPending, error, run] = useActionRunner();

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      <button type="button" className="portal-icon-button" aria-label={`Editar ${team.name}`} disabled={isPending} onClick={() => setEditing(true)}>
        <Pencil size={15} />
      </button>
      <button
        type="button"
        className="portal-icon-button"
        aria-label={`Excluir ${team.name}`}
        disabled={isPending}
        onClick={() => {
          if (window.confirm(`Excluir a equipe "${team.name}"? As escalas dela também serão removidas.`)) {
            run(() => deleteTeam(team.id));
          }
        }}
      >
        <Trash2 size={15} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
      {editing ? <TeamFormModal team={team} onClose={() => setEditing(false)} /> : null}
    </span>
  );
}

export function ChoreScheduleActions({ schedule }: { schedule: ChoreSchedule }) {
  const [isPending, error, run] = useActionRunner();

  return (
    <span className="portal-row-actions portal-row-actions--inline">
      {schedule.status === 'agendada' ? (
        <>
          <button type="button" className="portal-icon-button" aria-label="Marcar como concluída" disabled={isPending} onClick={() => run(() => updateScheduleStatus(schedule.id, 'concluida'))}>
            <CheckCircle2 size={15} />
          </button>
          <button type="button" className="portal-icon-button" aria-label="Cancelar faxina" disabled={isPending} onClick={() => run(() => updateScheduleStatus(schedule.id, 'cancelada'))}>
            <XCircle size={15} />
          </button>
        </>
      ) : (
        <button type="button" className="portal-icon-button" aria-label="Voltar para agendada" disabled={isPending} onClick={() => run(() => updateScheduleStatus(schedule.id, 'agendada'))}>
          <CalendarPlus size={15} />
        </button>
      )}
      <button
        type="button"
        className="portal-icon-button"
        aria-label="Excluir escala"
        disabled={isPending}
        onClick={() => {
          if (window.confirm('Excluir esta escala definitivamente?')) run(() => deleteSchedule(schedule.id));
        }}
      >
        <Trash2 size={15} />
      </button>
      {error ? <span className="portal-action-error" role="alert">{error}</span> : null}
    </span>
  );
}
