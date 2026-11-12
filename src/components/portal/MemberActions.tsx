'use client'

import { useEffect, useState, useTransition } from 'react'
import { Check, IdCard, Megaphone, Sparkles as SparklesIcon, UserRoundCheck, UserRoundX, UserRoundPen, X } from 'lucide-react'
import {
  approveMember,
  rejectMember,
  reactivateMember,
  setMemberCargo,
  setMemberRole,
  suspendMember,
  updateMemberRecord,
  updateSpiritualRecord,
} from '@/app/(auth)/admin/membros/actions'
import { MEMBER_CARGOS } from '@/lib/members'
import type { MemberCargo, Profile, ProfileRole } from '@/types'

type ActionResult = { ok: true } | { ok: false; error: string }

type ServerAction = (profileId: string) => Promise<ActionResult>

type RoleAction = (profileId: string, role: 'member' | 'editor') => Promise<ActionResult>

function ActionError({ message }: { message: string | null }) {
  if (!message) return null

  return <p className="portal-action-error">{message}</p>
}

function useMemberAction() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const run = (action: ServerAction, profileId: string) => {
    setError(null)
    startTransition(async () => {
      const result = await action(profileId)
      if (!result.ok) {
        setError(result.error)
      }
    })
  }

  const runWithRole = (action: RoleAction, profileId: string, role: 'member' | 'editor') => {
    setError(null)
    startTransition(async () => {
      const result = await action(profileId, role)
      if (!result.ok) {
        setError(result.error)
      }
    })
  }

  return { error, isPending, run, runWithRole }
}

export function ApprovalActions({ profileId }: { profileId: string }) {
  const { error, isPending, run, runWithRole } = useMemberAction()

  return (
    <div className="portal-approval-card__actions-wrap">
      <div className="portal-approval-card__actions">
        <button
          type="button"
          className="portal-button portal-button--danger portal-button--small"
          disabled={isPending}
          onClick={() => run(rejectMember, profileId)}
        >
          <UserRoundX size={16} strokeWidth={1.8} />
          Reprovar
        </button>
        <button
          type="button"
          className="portal-button portal-button--primary portal-button--small"
          disabled={isPending}
          onClick={() => runWithRole(approveMember, profileId, 'member')}
        >
          <UserRoundCheck size={16} strokeWidth={1.8} />
          Aprovar
        </button>
      </div>
      <button
        type="button"
        className="portal-button portal-button--secondary portal-button--small"
        disabled={isPending}
        onClick={() => runWithRole(approveMember, profileId, 'editor')}
      >
        <Megaphone size={16} strokeWidth={1.8} />
        Aprovar como comunicação
      </button>
      <ActionError message={error} />
    </div>
  )
}

export function MemberStatusActions({
  profileId,
  status,
  role,
  name,
}: {
  profileId: string
  status: 'active' | 'pending' | 'suspended'
  role: ProfileRole
  name?: string
}) {
  const { error, isPending, run, runWithRole } = useMemberAction()
  const canChangeRole = status === 'active' && (role === 'member' || role === 'editor')
  const nextRole: 'member' | 'editor' = role === 'editor' ? 'member' : 'editor'
  const displayName = name?.trim() || 'este membro'

  const handleRoleChange = () => {
    const confirmed = window.confirm(
      role === 'editor'
        ? `Tirar ${displayName} da equipe de comunicação? Ele voltará a ser filho da casa.`
        : `Tornar ${displayName} parte da comunicação? Ele passará a gerenciar agenda, avisos e conteúdos.`,
    )
    if (!confirmed) return
    runWithRole(setMemberRole, profileId, nextRole)
  }

  return (
    <div className="portal-table__actions">
      {status === 'active' ? (
        <button
          type="button"
          className="portal-button portal-button--secondary portal-button--small"
          disabled={isPending}
          onClick={() => run(suspendMember, profileId)}
        >
          Suspender
        </button>
      ) : null}
      {status === 'suspended' ? (
        <button
          type="button"
          className="portal-button portal-button--secondary portal-button--small"
          disabled={isPending}
          onClick={() => run(reactivateMember, profileId)}
        >
          Reativar
        </button>
      ) : null}
      {status === 'pending' ? (
        <button
          type="button"
          className="portal-button portal-button--primary portal-button--small"
          disabled={isPending}
          onClick={() => runWithRole(approveMember, profileId, 'member')}
        >
          Aprovar
        </button>
      ) : null}
      {canChangeRole ? (
        <button
          type="button"
          className="portal-button portal-button--secondary portal-button--small"
          disabled={isPending}
          onClick={handleRoleChange}
        >
          <UserRoundPen size={16} strokeWidth={1.8} />
          {role === 'editor' ? 'Tornar filho da casa' : 'Tornar comunicação'}
        </button>
      ) : null}
      <ActionError message={error} />
    </div>
  )
}

// ---------- Ficha espiritual (somente administração) ----------

export function SpiritualRecordButton({ member }: { member: Profile }) {
  const [open, setOpen] = useState(false)
  const [guiaFrente, setGuiaFrente] = useState(member.guia_frente ?? '')
  const [orixaCabeca, setOrixaCabeca] = useState(member.orixa_cabeca ?? '')
  const [adjunto, setAdjunto] = useState(member.adjunto ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateSpiritualRecord(member.id, {
        guia_frente: guiaFrente,
        orixa_cabeca: orixaCabeca,
        adjunto,
      })
      if (result.ok) setOpen(false)
      else setError(result.error)
    })
  }

  return (
    <>
      <button
        type="button"
        className="portal-button portal-button--secondary portal-button--small"
        onClick={() => setOpen(true)}
      >
        <SparklesIcon size={16} strokeWidth={1.8} />
        Ficha espiritual
      </button>
      {open ? (
        <div className="portal-modal-overlay" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha espiritual de ${member.full_name ?? 'membro'}`}
            onClick={(click) => click.stopPropagation()}
          >
            <div className="portal-modal__header">
              <h2>Ficha espiritual · {member.full_name ?? 'Membro'}</h2>
              <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={() => setOpen(false)}>
                <X size={17} />
              </button>
            </div>
            <form onSubmit={submit} className="portal-form">
              <label className="portal-field">
                <span>Guia de Frente</span>
                <input value={guiaFrente} onChange={(change) => setGuiaFrente(change.target.value)} maxLength={120} placeholder="Ex.: Caboclo Sete Flechas" />
              </label>
              <label className="portal-field">
                <span>Orixá de Cabeça</span>
                <input value={orixaCabeca} onChange={(change) => setOrixaCabeca(change.target.value)} maxLength={120} placeholder="Ex.: Oxóssi" />
              </label>
              <label className="portal-field">
                <span>Adjuntó</span>
                <input value={adjunto} onChange={(change) => setAdjunto(change.target.value)} maxLength={120} placeholder="Ex.: Ogum" />
              </label>
              {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
              <div className="portal-modal__actions">
                <button type="button" className="portal-button portal-button--secondary" onClick={() => setOpen(false)} disabled={isPending}>
                  Cancelar
                </button>
                <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
                  <Check size={15} /> Salvar ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}

// ---------- Cargo espiritual (somente administração) ----------

export function MemberCargoSelect({
  profileId,
  cargo,
  name,
}: {
  profileId: string
  cargo: MemberCargo | null
  name?: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const displayName = name?.trim() || 'este membro'

  const handleChange = (value: string) => {
    const next = value === '' ? null : (value as MemberCargo)
    if (next === cargo) return
    setError(null)
    startTransition(async () => {
      const result = await setMemberCargo(profileId, next)
      if (!result.ok) setError(result.error)
    })
  }

  return (
    <label className="portal-cargo-select" title={`Cargo de ${displayName} na casa`}>
      <span className="portal-cargo-select__label">Cargo</span>
      <select value={cargo ?? ''} disabled={isPending} onChange={(change) => handleChange(change.target.value)}>
        <option value="">Sem cargo</option>
        {MEMBER_CARGOS.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
    </label>
  )
}

// ---------- Ficha completa do filho (somente administração) ----------

export function MemberRecordButton({ member }: { member: Profile }) {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState(member.full_name ?? '')
  const [phone, setPhone] = useState(member.phone ?? '')
  const [birthDate, setBirthDate] = useState(member.birth_date ?? '')
  const [joinedAt, setJoinedAt] = useState(member.joined_at ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateMemberRecord(member.id, {
        full_name: fullName,
        phone,
        birth_date: birthDate,
        joined_at: joinedAt,
      })
      if (result.ok) setOpen(false)
      else setError(result.error)
    })
  }

  const fmt = (value: string | null | undefined) => {
    if (!value) return '—'
    const date = new Date(value.length === 10 ? `${value}T12:00:00` : value)
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR')
  }

  return (
    <>
      <button
        type="button"
        className="portal-button portal-button--secondary portal-button--small"
        onClick={() => setOpen(true)}
      >
        <IdCard size={16} strokeWidth={1.8} />
        Ficha completa
      </button>
      {open ? (
        <div className="portal-modal-overlay" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha completa de ${member.full_name ?? 'membro'}`}
            onClick={(click) => click.stopPropagation()}
          >
            <div className="portal-modal__header">
              <h2>Ficha completa · {member.full_name ?? 'Membro'}</h2>
              <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={() => setOpen(false)}>
                <X size={17} />
              </button>
            </div>

            <div className="member-record__summary">
              {member.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.avatar_url} alt="" className="member-record__avatar" />
              ) : (
                <span className="member-record__avatar member-record__avatar--empty">{(member.full_name ?? '?').charAt(0).toUpperCase()}</span>
              )}
              <dl>
                <div><dt>Cargo</dt><dd>{member.cargo ?? '—'}</dd></div>
                <div><dt>Situação</dt><dd>{member.status === 'active' ? 'Ativo' : member.status === 'pending' ? 'Aguardando' : 'Suspenso'}</dd></div>
                <div><dt>Cadastro criado em</dt><dd>{fmt(member.created_at)}</dd></div>
                <div><dt>Termos aceitos em</dt><dd>{fmt(member.terms_accepted_at)}</dd></div>
              </dl>
            </div>

            <div className="member-record__spiritual">
              <h3>Ficha espiritual</h3>
              <dl>
                <div><dt>Guia de Frente</dt><dd>{member.guia_frente ?? '—'}</dd></div>
                <div><dt>Orixá de Cabeça</dt><dd>{member.orixa_cabeca ?? '—'}</dd></div>
                <div><dt>Adjuntó</dt><dd>{member.adjunto ?? '—'}</dd></div>
              </dl>
            </div>

            <form onSubmit={submit} className="portal-form">
              <h3 className="member-record__form-title">Dados pessoais</h3>
              <label className="portal-field">
                <span>Nome completo *</span>
                <input required minLength={3} maxLength={120} value={fullName} onChange={(change) => setFullName(change.target.value)} />
              </label>
              <label className="portal-field">
                <span>WhatsApp</span>
                <input maxLength={20} value={phone} onChange={(change) => setPhone(change.target.value)} placeholder="(19) 99999-0000" />
              </label>
              <div className="portal-form__row">
                <label className="portal-field">
                  <span>Data de nascimento</span>
                  <input type="date" value={birthDate} onChange={(change) => setBirthDate(change.target.value)} />
                </label>
                <label className="portal-field">
                  <span>Entrada na casa</span>
                  <input type="date" value={joinedAt} onChange={(change) => setJoinedAt(change.target.value)} />
                </label>
              </div>
              {error ? <p className="portal-action-error" role="alert">{error}</p> : null}
              <div className="portal-modal__actions">
                <button type="button" className="portal-button portal-button--secondary" onClick={() => setOpen(false)} disabled={isPending}>
                  Cancelar
                </button>
                <button type="submit" className="portal-button portal-button--primary" disabled={isPending}>
                  <Check size={15} /> Salvar ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
