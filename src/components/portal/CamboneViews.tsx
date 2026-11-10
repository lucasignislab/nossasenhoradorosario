import { PageHeader, PanelHeader, StatusPill } from './PortalUI';
import {
  AssignCamboneButton,
  CamboneRespondActions,
  RemoveCamboneButton,
  camboneStatusLabel,
  camboneStatusTone,
} from './CamboneControls';
import { formatEventDateLong } from '@/lib/events';
import type { CamboneAssignment, CamboneRosterEntry, DirectoryMember, PortalEvent } from '@/types';

// ---------- Visão do cambone (área dos filhos) ----------

type MemberCambonesProps = {
  myAssignments: CamboneAssignment[];
  events: PortalEvent[];
  roster: CamboneRosterEntry[];
  currentUserId: string;
};

export function MemberCambones({ myAssignments, events, roster, currentUserId }: MemberCambonesProps) {
  const eventsById = new Map(events.map((event) => [event.id, event]));
  const myUpcoming = myAssignments.filter((assignment) => {
    const event = eventsById.get(assignment.event_id);
    return event !== undefined;
  });
  const eventsWithRoster = events.filter((event) => roster.some((entry) => entry.event_id === event.id));

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Área dos filhos"
        title="Escala de cambone"
        description="Quando a administração te escalar, confirme ou avise que não pode por aqui — sem precisar procurar ninguém."
      />

      <article className="portal-panel">
        <PanelHeader eyebrow="Suas escalas" title="Próximas giras" />
        {myUpcoming.length === 0 ? (
          <p className="portal-panel__copy">Você não está escalado nas próximas giras.</p>
        ) : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead><tr><th>Gira</th><th>Função</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {myUpcoming.map((assignment) => {
                  const event = eventsById.get(assignment.event_id);
                  return (
                    <tr key={assignment.id}>
                      <td><strong>{event ? `${formatEventDateLong(event.event_date)} · ${event.title}` : '—'}</strong></td>
                      <td>{assignment.role_note ?? 'Cambone'}</td>
                      <td>
                        <StatusPill tone={camboneStatusTone[assignment.status]}>
                          {camboneStatusLabel[assignment.status]}
                        </StatusPill>
                      </td>
                      <td>
                        {assignment.status === 'escalado' ? <CamboneRespondActions assignmentId={assignment.id} /> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="portal-panel">
        <PanelHeader eyebrow="Próximas giras" title="Escala da corrente" />
        {eventsWithRoster.length === 0 ? (
          <p className="portal-panel__copy">Nenhum cambone escalado nas próximas giras ainda.</p>
        ) : (
          <ul className="portal-mural-list">
            {eventsWithRoster.map((event) => (
              <li key={event.id} className="portal-mural-item">
                <div className="portal-mural-item__head">
                  <div>
                    <strong>{event.title}</strong>
                    <span className="portal-mural-item__meta">{formatEventDateLong(event.event_date)}</span>
                  </div>
                </div>
                <p className="portal-mural-item__roster">
                  {roster
                    .filter((entry) => entry.event_id === event.id)
                    .map((entry) => (
                      <span key={entry.profile_id}>
                        {(entry.full_name ?? 'Filho da casa').split(' ')[0]}
                        {entry.profile_id === currentUserId ? ' (você)' : ''}
                        {' · '}{camboneStatusLabel[entry.status]}
                      </span>
                    ))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}

// ---------- Visão da gestão ----------

type CamboneManagementProps = {
  events: PortalEvent[];
  assignments: CamboneAssignment[];
  allAssignments: CamboneAssignment[];
  members: DirectoryMember[];
};

export function CamboneManagement({ events, assignments, allAssignments, members }: CamboneManagementProps) {
  const namesById = new Map(members.map((member) => [member.id, member.full_name ?? 'Sem nome']));

  // Rodízio justo: quantas vezes cada filho já foi escalado (histórico completo).
  const rotation = new Map<string, number>();
  for (const assignment of allAssignments) {
    rotation.set(assignment.profile_id, (rotation.get(assignment.profile_id) ?? 0) + 1);
  }
  const rotationRows = [...rotation.entries()]
    .map(([profileId, count]) => ({ name: namesById.get(profileId) ?? 'Sem nome', count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const awaitingResponse = assignments.filter((assignment) => assignment.status === 'escalado').length;

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Escala de cambone"
        title="Cambones por gira"
        description="Escale os cambones de cada gira. Eles confirmam ou recusam pelo próprio portal — e o rodízio mostra quem ainda não foi chamado."
      />

      {awaitingResponse > 0 ? (
        <p className="portal-panel__copy" role="status">
          <strong>{awaitingResponse} {awaitingResponse === 1 ? 'escala aguarda' : 'escalas aguardam'} resposta</strong> do cambone.
        </p>
      ) : null}

      {events.length === 0 ? (
        <article className="portal-panel">
          <p className="portal-panel__copy">Nenhuma gira futura. Cadastre a agenda primeiro.</p>
        </article>
      ) : (
        events.map((event) => {
          const eventAssignments = assignments.filter((assignment) => assignment.event_id === event.id);
          return (
            <article className="portal-panel" key={event.id}>
              <PanelHeader eyebrow={formatEventDateLong(event.event_date)} title={event.title} />
              <div className="portal-mural-admin__toolbar">
                <span className="portal-panel__copy" style={{ margin: 0 }}>
                  {eventAssignments.length === 0
                    ? 'Nenhum cambone escalado nesta gira ainda.'
                    : `${eventAssignments.length} ${eventAssignments.length === 1 ? 'cambone escalado' : 'cambones escalados'}`}
                </span>
                <AssignCamboneButton eventId={event.id} members={members} />
              </div>
              {eventAssignments.length > 0 ? (
                <div className="portal-table-wrap">
                  <table className="portal-table">
                    <thead><tr><th>Cambone</th><th>Função</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody>
                      {eventAssignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td><strong>{namesById.get(assignment.profile_id) ?? '—'}</strong></td>
                          <td>{assignment.role_note ?? 'Cambone'}</td>
                          <td>
                            <StatusPill tone={camboneStatusTone[assignment.status]}>
                              {camboneStatusLabel[assignment.status]}
                            </StatusPill>
                          </td>
                          <td>
                            <RemoveCamboneButton
                              assignmentId={assignment.id}
                              name={namesById.get(assignment.profile_id) ?? 'cambone'}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </article>
          );
        })
      )}

      <article className="portal-panel">
        <PanelHeader eyebrow="Rodízio" title="Quem já foi escalado" />
        {rotationRows.length === 0 ? (
          <p className="portal-panel__copy">Nenhuma escala registrada ainda.</p>
        ) : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead><tr><th>Filho</th><th>Vezes escalado</th></tr></thead>
              <tbody>
                {rotationRows.map((row) => (
                  <tr key={row.name}>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}
