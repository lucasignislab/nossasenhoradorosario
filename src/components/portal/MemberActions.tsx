'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Check, IdCard, Megaphone, MoreVertical, ShieldCheck, Sparkles as SparklesIcon, UserRoundCheck, UserRoundX, UserRoundPen, X } from 'lucide-react'
import {
  approveMember,
  rejectMember,
  reactivateMember,
  setMemberCargo,
  setMemberAdmin,
  setMemberRole,
  suspendMember,
  updateMemberRecord,
  updateSpiritualRecord,
} from '@/app/(auth)/admin/membros/actions'
import { MEMBER_CARGOS } from '@/lib/members'
import type { MemberCargo, Profile } from '@/types'

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

  return { error, isPending, run, runWithRole, setError, startTransition }
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

// ---------- Menu de ações da linha (organiza tudo em um dropdown) ----------

export function MemberRowMenu({ member, name }: { member: Profile; name?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState<null | 'record' | 'spiritual'>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { error, isPending, run, runWithRole, setError, startTransition } = useMemberAction()

  const { id: profileId, status, role } = member
  const canChangeRole = status === 'active' && (role === 'member' || role === 'editor')
  const nextRole: 'member' | 'editor' = role === 'editor' ? 'member' : 'editor'
  const displayName = name?.trim() || 'este membro'

  // Fecha o dropdown ao clicar fora ou apertar Escape.
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (mouse: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(mouse.target as Node)) setMenuOpen(false)
    }
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

  const item = (
    label: string,
    icon: React.ReactNode,
    onSelect: () => void,
    options?: { danger?: boolean },
  ) => (
    <button
      type="button"
      className={`portal-menu__item${options?.danger ? ' portal-menu__item--danger' : ''}`}
      disabled={isPending}
      onClick={() => { setMenuOpen(false); onSelect() }}
    >
      {icon}
      {label}
    </button>
  )

  const handleRoleChange = () => {
    const confirmed = window.confirm(
      role === 'editor'
        ? `Tirar ${displayName} da equipe de comunicação? Ele voltará a ser filho da casa.`
        : `Tornar ${displayName} parte da comunicação? Ele passará a gerenciar agenda, avisos e conteúdos.`,
    )
    if (!confirmed) return
    runWithRole(setMemberRole, profileId, nextRole)
  }

  const handleAdminChange = () => {
    const promoting = role !== 'admin'
    const confirmed = window.confirm(
      promoting
        ? `Tornar ${displayName} parte da administração? Terá acesso total à gestão da casa, incluindo fichas, financeiro e frequência.`
        : `Remover ${displayName} da administração? Voltará a ser filho da casa.`,
    )
    if (!confirmed) return
    setError(null)
    startTransition(async () => {
      const result = await setMemberAdmin(profileId, promoting)
      if (!result.ok) setError(result.error)
    })
  }

  return (
    <div className="portal-menu" ref={wrapRef}>
      <button
        type="button"
        className="portal-button portal-button--secondary portal-button--small"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        Ações
        <MoreVertical size={15} strokeWidth={1.8} />
      </button>

      {menuOpen ? (
        <div className="portal-menu__list" role="menu">
          {status === 'active' ? (
            <div className="portal-menu__cargo" onClick={(click) => click.stopPropagation()}>
              <MemberCargoSelect profileId={profileId} cargo={member.cargo} name={displayName} />
            </div>
          ) : null}
          {item('Ficha completa', <IdCard size={15} />, () => setModal('record'))}
          {status === 'active' ? item('Ficha espiritual', <SparklesIcon size={15} />, () => setModal('spiritual')) : null}
          {status === 'pending' ? item('Aprovar cadastro', <UserRoundCheck size={15} />, () => runWithRole(approveMember, profileId, 'member')) : null}
          {canChangeRole ? item(role === 'editor' ? 'Tornar filho da casa' : 'Tornar comunicação', <UserRoundPen size={15} />, handleRoleChange) : null}
          {status === 'active' && role !== 'developer' ? item(role === 'admin' ? 'Remover administração' : 'Tornar administração', <ShieldCheck size={15} />, handleAdminChange) : null}
          {status === 'active' ? item('Suspender', <UserRoundX size={15} />, () => run(suspendMember, profileId), { danger: true }) : null}
          {status === 'suspended' ? item('Reativar', <UserRoundCheck size={15} />, () => run(reactivateMember, profileId)) : null}
        </div>
      ) : null}
      <ActionError message={error} />

      <MemberRecordButton member={member} externalOpen={modal === 'record'} onExternalClose={() => setModal(null)} />
      <SpiritualRecordButton member={member} externalOpen={modal === 'spiritual'} onExternalClose={() => setModal(null)} />
    </div>
  )
}

// ---------- Ficha espiritual (somente administração) ----------

export function SpiritualRecordButton({
  member,
  externalOpen,
  onExternalClose,
}: {
  member: Profile
  externalOpen?: boolean
  onExternalClose?: () => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen ?? internalOpen
  const close = () => (externalOpen === undefined ? setInternalOpen(false) : onExternalClose?.())
  const [guiaFrente, setGuiaFrente] = useState(member.guia_frente ?? '')
  const [orixaCabeca, setOrixaCabeca] = useState(member.orixa_cabeca ?? '')
  const [adjunto, setAdjunto] = useState(member.adjunto ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const submit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateSpiritualRecord(member.id, {
        guia_frente: guiaFrente,
        orixa_cabeca: orixaCabeca,
        adjunto,
      })
      if (result.ok) close()
      else setError(result.error)
    })
  }

  return (
    <>
      {externalOpen === undefined ? (
        <button
          type="button"
          className="portal-button portal-button--secondary portal-button--small"
          onClick={() => setInternalOpen(true)}
        >
          <SparklesIcon size={16} strokeWidth={1.8} />
          Ficha espiritual
        </button>
      ) : null}
      {open ? (
        <div className="portal-modal-overlay" role="presentation" onClick={close}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha espiritual de ${member.full_name ?? 'membro'}`}
            onClick={(click) => click.stopPropagation()}
          >
            <div className="portal-modal__header">
              <h2>Ficha espiritual · {member.full_name ?? 'Membro'}</h2>
              <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={close}>
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
                <button type="button" className="portal-button portal-button--secondary" onClick={close} disabled={isPending}>
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

export function MemberRecordButton({
  member,
  externalOpen,
  onExternalClose,
}: {
  member: Profile
  externalOpen?: boolean
  onExternalClose?: () => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen ?? internalOpen
  const close = () => (externalOpen === undefined ? setInternalOpen(false) : onExternalClose?.())
  const [fullName, setFullName] = useState(member.full_name ?? '')
  const [phone, setPhone] = useState(member.phone ?? '')
  const [birthDate, setBirthDate] = useState(member.birth_date ?? '')
  const [joinedAt, setJoinedAt] = useState(member.joined_at ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    const handleKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

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
      if (result.ok) close()
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
      {externalOpen === undefined ? (
        <button
          type="button"
          className="portal-button portal-button--secondary portal-button--small"
          onClick={() => setInternalOpen(true)}
        >
          <IdCard size={16} strokeWidth={1.8} />
          Ficha completa
        </button>
      ) : null}
      {open ? (
        <div className="portal-modal-overlay" role="presentation" onClick={close}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha completa de ${member.full_name ?? 'membro'}`}
            onClick={(click) => click.stopPropagation()}
          >
            <div className="portal-modal__header">
              <h2>Ficha completa · {member.full_name ?? 'Membro'}</h2>
              <button type="button" className="portal-icon-button" aria-label="Fechar" onClick={close}>
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
                <button type="button" className="portal-button portal-button--secondary" onClick={close} disabled={isPending}>
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
