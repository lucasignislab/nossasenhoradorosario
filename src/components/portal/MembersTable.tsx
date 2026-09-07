'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { StatusPill } from './PortalUI';
import { MemberStatusActions } from './MemberActions';
import {
  formatJoinedAt,
  profileDisplayName,
  profileInitial,
  roleLabel,
  statusPresentation,
} from '@/lib/members';
import type { Profile } from '@/types';

export function MembersTable({ members }: { members: Profile[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    if (!normalized) return members;
    return members.filter((member) =>
      profileDisplayName(member).toLocaleLowerCase('pt-BR').includes(normalized),
    );
  }, [members, query]);

  return (
    <>
      <div className="portal-search">
        <Search size={15} />
        <input
          aria-label="Buscar membro"
          placeholder="Buscar por nome"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="portal-table-wrap">
        <table className="portal-table">
          <thead>
            <tr><th>Nome</th><th>Função</th><th>Entrada na casa</th><th>WhatsApp</th><th>Situação</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6}>Nenhum membro encontrado.</td></tr>
            ) : (
              filtered.map((member) => {
                const status = statusPresentation(member.status);
                return (
                  <tr key={member.id}>
                    <td>
                      <div className="portal-table-person">
                        <span>{profileInitial(member)}</span>
                        <strong>{profileDisplayName(member)}</strong>
                      </div>
                    </td>
                    <td>{roleLabel(member.role)}</td>
                    <td>{formatJoinedAt(member.joined_at)}</td>
                    <td>{member.phone?.trim() || '—'}</td>
                    <td><StatusPill tone={status.tone}>{status.label}</StatusPill></td>
                    <td><MemberStatusActions profileId={member.id} status={member.status} /></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
