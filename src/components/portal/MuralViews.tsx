import { PageHeader, PanelHeader, ProgressBar, StatusPill } from './PortalUI';
import {
  CancelPledgeButton,
  MuralItemRowActions,
  MuralPledgeAdminActions,
  NewMuralItemButton,
  PledgeMuralButton,
} from './MuralControls';
import { formatMuralQuantity, itemProgress, muralCategoryLabel, pledgedTotal } from '@/lib/mural';
import { profileDisplayName } from '@/lib/members';
import type { MuralItem, MuralPledge, MuralRosterEntry, Profile } from '@/types';

// ---------- Visão do filho ----------

type MemberMuralProps = {
  items: MuralItem[];
  pledges: MuralPledge[];
  roster: MuralRosterEntry[];
  currentUserId: string;
};

export function MemberMural({ items, pledges, roster, currentUserId }: MemberMuralProps) {
  const myPledges = pledges.filter((pledge) => pledge.profile_id === currentUserId);
  const itemsById = new Map(items.map((item) => [item.id, item]));

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Área dos filhos"
        title="Quem vai levar"
        description="Veja o que a casa está precisando e assuma o que você pode trazer. A entrega é confirmada pela administração."
      />

      <article className="portal-panel">
        <PanelHeader eyebrow="Seus compromissos" title="O que você vai levar" />
        {myPledges.length === 0 ? (
          <p className="portal-panel__copy">Você ainda não assumiu nada. Escolha um item na lista abaixo.</p>
        ) : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead><tr><th>Item</th><th>Quantidade</th><th>Entrega</th><th>Ações</th></tr></thead>
              <tbody>
                {myPledges.map((pledge) => {
                  const item = itemsById.get(pledge.item_id);
                  return (
                    <tr key={pledge.id}>
                      <td><strong>{item?.name ?? '—'}</strong></td>
                      <td>{item ? formatMuralQuantity(Number(pledge.quantity), item.unit) : pledge.quantity}</td>
                      <td>
                        <StatusPill tone={pledge.delivered ? 'info' : 'warning'}>
                          {pledge.delivered ? 'Entregue' : 'A levar'}
                        </StatusPill>
                      </td>
                      <td>{pledge.delivered ? null : <CancelPledgeButton pledgeId={pledge.id} />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="portal-panel">
        <PanelHeader eyebrow="Necessidades da casa" title="Lista de contribuição" />
        {items.length === 0 ? (
          <p className="portal-panel__copy">Nenhum item na lista no momento. Quando a administração publicar o que a casa precisa, aparece aqui.</p>
        ) : (
          <ul className="portal-mural-list">
            {items.map((item) => {
              const total = pledgedTotal(item.id, pledges);
              const myPledge = myPledges.find((pledge) => pledge.item_id === item.id);
              const itemRoster = roster.filter((entry) => entry.item_id === item.id);
              const progressItem = itemProgress(item, pledges);
              return (
                <li key={item.id} className="portal-mural-item">
                  <div className="portal-mural-item__head">
                    <div>
                      <strong>{item.name}</strong>
                      <span className="portal-mural-item__meta">
                        {muralCategoryLabel(item.category)}
                        {item.quantity_total
                          ? ` · ${formatMuralQuantity(total, item.unit)} de ${formatMuralQuantity(Number(item.quantity_total), item.unit)}`
                          : ` · ${formatMuralQuantity(total, item.unit)} comprometidos`}
                        {item.note ? ` · ${item.note}` : ''}
                      </span>
                    </div>
                    {myPledge ? (
                      <StatusPill tone={myPledge.delivered ? 'info' : 'warning'}>
                        {myPledge.delivered
                          ? `Entregue · ${formatMuralQuantity(Number(myPledge.quantity), item.unit)}`
                          : `Você leva ${formatMuralQuantity(Number(myPledge.quantity), item.unit)}`}
                      </StatusPill>
                    ) : (
                      <PledgeMuralButton item={item} />
                    )}
                  </div>
                  {progressItem !== null ? <ProgressBar value={progressItem} label={item.name} /> : null}
                  {itemRoster.length > 0 ? (
                    <p className="portal-mural-item__roster">
                      {itemRoster.map((entry) => (
                        <span key={entry.profile_id} className={entry.delivered ? 'is-delivered' : undefined}>
                          {(entry.full_name ?? 'Filho da casa').split(' ')[0]} ({formatMuralQuantity(Number(entry.quantity), item.unit)})
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="portal-mural-item__roster">Ninguém assumiu ainda — pode ser você.</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </article>
    </div>
  );
}

// ---------- Visão da gestão ----------

type MuralManagementProps = {
  items: MuralItem[];
  pledges: MuralPledge[];
  members: Profile[];
};

export function MuralManagement({ items, pledges, members }: MuralManagementProps) {
  const namesById = new Map(members.map((member) => [member.id, profileDisplayName(member)]));
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const pendingDeliveries = pledges.filter((pledge) => !pledge.delivered).length;

  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Quem vai levar"
        title="Lista de contribuição da casa"
        description="Publique o que a casa precisa — independente de haver gira marcada — acompanhe quem leva o quê e confirme as entregas."
        action={<NewMuralItemButton />}
      />

      {pendingDeliveries > 0 ? (
        <p className="portal-panel__copy" role="status">
          <strong>{pendingDeliveries} {pendingDeliveries === 1 ? 'entrega pendente' : 'entregas pendentes'}</strong> de confirmação.
        </p>
      ) : null}

      <article className="portal-panel">
        <PanelHeader eyebrow="Itens" title="O que a casa precisa" />
        {items.length === 0 ? (
          <p className="portal-panel__copy">Nenhum item cadastrado. Comece pelo botão &ldquo;Novo item&rdquo;.</p>
        ) : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead><tr><th>Item</th><th>Categoria</th><th>Comprometido</th><th>Meta</th><th>Cobertura</th><th>Ações</th></tr></thead>
              <tbody>
                {items.map((item) => {
                  const total = pledgedTotal(item.id, pledges);
                  const progressItem = itemProgress(item, pledges);
                  return (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong>{item.note ? <><br /><small>{item.note}</small></> : null}</td>
                      <td>{muralCategoryLabel(item.category)}</td>
                      <td>{formatMuralQuantity(total, item.unit)}</td>
                      <td>{item.quantity_total ? formatMuralQuantity(Number(item.quantity_total), item.unit) : 'Livre'}</td>
                      <td>{progressItem !== null ? `${progressItem}%` : total > 0 ? 'Tem compromisso' : '—'}</td>
                      <td><MuralItemRowActions item={item} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="portal-panel">
        <PanelHeader eyebrow="Compromissos" title="Quem leva o quê" />
        {pledges.length === 0 ? (
          <p className="portal-panel__copy">Nenhum compromisso assumido ainda.</p>
        ) : (
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead><tr><th>Filho</th><th>Item</th><th>Quantidade</th><th>Observação</th><th>Entrega</th><th>Ações</th></tr></thead>
              <tbody>
                {pledges.map((pledge) => {
                  const item = itemsById.get(pledge.item_id);
                  return (
                    <tr key={pledge.id}>
                      <td><strong>{namesById.get(pledge.profile_id) ?? '—'}</strong></td>
                      <td>{item?.name ?? '—'}</td>
                      <td>{item ? formatMuralQuantity(Number(pledge.quantity), item.unit) : pledge.quantity}</td>
                      <td>{pledge.note ?? '—'}</td>
                      <td>
                        <StatusPill tone={pledge.delivered ? 'info' : 'warning'}>
                          {pledge.delivered ? 'Entregue' : 'Pendente'}
                        </StatusPill>
                      </td>
                      <td><MuralPledgeAdminActions pledgeId={pledge.id} delivered={pledge.delivered} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}
