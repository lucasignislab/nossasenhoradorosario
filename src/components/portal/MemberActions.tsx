'use client'

import { useState, useTransition } from 'react'
import { Megaphone, UserRoundCheck, UserRoundX, UserRoundPen } from 'lucide-react'
import {
  approveMember,
  rejectMember,
  reactivateMember,
  setMemberRole,
  suspendMember,
} from '@/app/(auth)/admin/membros/actions'
import type { ProfileRole } from '@/types'

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
