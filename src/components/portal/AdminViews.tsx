import Link from 'next/link';
import {
  ArrowRight,
  BadgeDollarSign,
  BellRing,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Filter,
  Landmark,
  ListChecks,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserRoundCheck,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { MetricCard, PageHeader, PanelHeader, ProgressBar, StatusPill } from './PortalUI';
import { FinanceTrendChart } from './FinanceTrendChart';

const attendanceBars = [
  { month: 'Fev', value: 72 }, { month: 'Mar', value: 78 }, { month: 'Abr', value: 75 },
  { month: 'Mai', value: 84 }, { month: 'Jun', value: 81 }, { month: 'Jul', value: 87 },
];

export function AdminOverview({ basePath = '/admin' }: { basePath?: string }) {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Visão geral · Julho de 2026"
        title="A casa em um só olhar"
        description="Acompanhe o que precisa de cuidado hoje, sem perder de vista o movimento do mês."
        action={<button className="portal-button portal-button--primary"><Plus size={16} /> Novo evento</button>}
      />

      <section className="portal-metrics" aria-label="Indicadores principais">
        <MetricCard icon={UsersRound} label="Filhos ativos" value="42" detail="3 cadastros aguardando" tone="brand" />
        <MetricCard icon={CalendarCheck} label="Próxima atividade" value="24 jul" detail="Estudo mediúnico · 20h" tone="gold" />
        <MetricCard icon={WalletCards} label="Recebido no mês" value="R$ 3.840" detail="86% do previsto" tone="info" />
        <MetricCard icon={UserRoundCheck} label="Frequência média" value="87%" detail="+6% em relação a junho" tone="neutral" />
      </section>

      <section className="portal-layout portal-layout--overview">
        <div className="portal-stack">
          <article className="portal-panel">
            <PanelHeader eyebrow="Próximos 7 dias" title="Agenda da casa" action={<Link href={`${basePath}/agenda`} className="portal-text-link">Ver agenda <ArrowRight size={14} /></Link>} />
            <div className="portal-event-list">
              {[
                ['24', 'QUI', 'Estudo mediúnico', '20:00', 'Desenvolvimento'],
                ['26', 'SÁB', 'Cuidado da casa', '09:00', 'Equipe Dourada'],
                ['28', 'SEG', 'Reunião da corrente', '19:30', 'Todos os filhos'],
              ].map(([day, week, title, time, group]) => (
                <div className="portal-event" key={`${day}-${title}`}>
                  <div className="portal-event__date"><strong>{day}</strong><span>{week}</span></div>
                  <div><h3>{title}</h3><p><Clock3 size={13} /> {time} · {group}</p></div>
                  <button aria-label={`Opções para ${title}`}><MoreHorizontal size={19} /></button>
                </div>
              ))}
            </div>
          </article>

          <article className="portal-panel">
            <PanelHeader eyebrow="Acompanhamento" title="Movimento da comunidade" />
            <div className="portal-split-metrics">
              <div><ProgressBar value={87} label="Frequência nas giras de desenvolvimento" /><ProgressBar value={79} label="Participação nos estudos" /><ProgressBar value={92} label="Escalas confirmadas" /></div>
              <div className="portal-note-card">
                <Sparkles size={22} />
                <p>O comparecimento cresceu nas últimas três atividades.</p>
                <span>Dados demonstrativos</span>
              </div>
            </div>
          </article>
        </div>

        <aside className="portal-stack">
          <article className="portal-panel portal-panel--accent">
            <PanelHeader eyebrow="Atenção hoje" title="3 aprovações pendentes" />
            <div className="portal-person-list">
              {['Marina de Souza', 'Rafael Santos', 'Clara Oliveira'].map((name, index) => (
                <div className="portal-person" key={name}>
                  <span>{name.charAt(0)}</span><div><strong>{name}</strong><small>Cadastro há {index + 1} dia{index ? 's' : ''}</small></div>
                  <button aria-label={`Revisar cadastro de ${name}`}><ArrowRight size={16} /></button>
                </div>
              ))}
            </div>
            <Link href={`${basePath}/membros`} className="portal-button portal-button--dark">Revisar cadastros</Link>
          </article>

          <article className="portal-panel">
            <PanelHeader eyebrow="Financeiro" title="Resumo de julho" />
            <dl className="portal-definition-list">
              <div><dt>Previsto</dt><dd>R$ 4.450</dd></div>
              <div><dt>Recebido</dt><dd>R$ 3.840</dd></div>
              <div><dt>Pendente</dt><dd>R$ 610</dd></div>
            </dl>
            <Link href={`${basePath}/financeiro`} className="portal-text-link">Abrir financeiro <ArrowRight size={14} /></Link>
          </article>

          <article className="portal-privacy-card">
            <ShieldCheck size={20} />
            <div><strong>Dados protegidos</strong><p>Frequência e finanças possuem acesso restrito e histórico de alterações.</p></div>
          </article>
        </aside>
      </section>
    </div>
  );
}

export function FinanceDashboard() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Financeiro"
        title="Cuidado e transparência"
        description="Uma leitura clara das contribuições, despesas e necessidades da casa."
        action={<><button className="portal-button portal-button--secondary"><FileText size={16} /> Exportar</button><button className="portal-button portal-button--primary"><Plus size={16} /> Novo lançamento</button></>}
      />

      <section className="portal-metrics">
        <MetricCard icon={BadgeDollarSign} label="Previsto em julho" value="R$ 4.450" detail="Mensalidades e contribuições" tone="neutral" />
        <MetricCard icon={CircleDollarSign} label="Total recebido" value="R$ 3.840" detail="86% do valor previsto" tone="info" />
        <MetricCard icon={Clock3} label="A receber" value="R$ 610" detail="7 mensalidades pendentes" tone="warning" />
        <MetricCard icon={Landmark} label="Saldo do mês" value="R$ 1.275" detail="Após despesas registradas" tone="gold" />
      </section>

      <section className="portal-layout portal-layout--charts">
        <FinanceTrendChart />

        <article className="portal-panel">
          <PanelHeader eyebrow="Julho" title="Despesas por categoria" />
          <div className="portal-donut-wrap">
            <div className="portal-donut"><span><strong>R$ 2.565</strong><small>Total</small></span></div>
            <ul className="portal-legend-list">
              <li><i className="is-brand" /><span>Manutenção</span><strong>38%</strong></li>
              <li><i className="is-gold" /><span>Materiais</span><strong>27%</strong></li>
              <li><i className="is-info" /><span>Contas</span><strong>21%</strong></li>
              <li><i className="is-neutral" /><span>Outros</span><strong>14%</strong></li>
            </ul>
          </div>
        </article>
      </section>

      <article className="portal-panel">
        <PanelHeader eyebrow="Conciliação" title="Movimentações recentes" action={<button className="portal-filter"><Filter size={14} /> Filtrar</button>} />
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Forma</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              {[
                ['21 jul', 'Mensalidade · M. Souza', 'Contribuição', 'Pix', '+ R$ 90,00', 'Confirmado', 'info'],
                ['20 jul', 'Materiais de limpeza', 'Manutenção', 'Débito', '- R$ 186,40', 'Conciliado', 'neutral'],
                ['18 jul', 'Conta de energia', 'Contas', 'Pix', '- R$ 342,18', 'Conciliado', 'neutral'],
                ['17 jul', 'Mensalidade · R. Santos', 'Contribuição', 'Dinheiro', '+ R$ 90,00', 'Pendente', 'warning'],
              ].map(([date, desc, category, method, value, status, tone]) => (
                <tr key={`${date}-${desc}`}><td>{date}</td><td><strong>{desc}</strong></td><td>{category}</td><td>{method}</td><td className={value.startsWith('+') ? 'is-positive' : 'is-negative'}>{value}</td><td><StatusPill tone={tone as 'info' | 'neutral' | 'warning'}>{status}</StatusPill></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

export function AttendanceDashboard() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Administração · Frequência"
        title="Presença é vínculo"
        description="Acompanhe a participação com contexto, acolhimento e respeito ao caminho de cada filho."
        action={<button className="portal-button portal-button--primary"><ListChecks size={16} /> Registrar presença</button>}
      />

      <div className="portal-filter-bar">
        <label>Período<select><option>Julho de 2026</option><option>Junho de 2026</option></select></label>
        <label>Atividade<select><option>Todas as atividades</option><option>Desenvolvimento mediúnico</option><option>Estudos</option><option>Cuidados da casa</option></select></label>
        <label>Grupo<select><option>Toda a corrente</option><option>Desenvolvimento I</option><option>Desenvolvimento II</option></select></label>
      </div>

      <section className="portal-metrics">
        <MetricCard icon={UserCheck} label="Frequência geral" value="87%" detail="36 de 42 filhos ativos" tone="brand" />
        <MetricCard icon={CalendarCheck} label="Presenças no mês" value="184" detail="Em 6 atividades realizadas" tone="info" />
        <MetricCard icon={MessageSquareText} label="Ausências justificadas" value="12" detail="Todos os registros revisados" tone="neutral" />
        <MetricCard icon={TrendingUp} label="Evolução" value="+6%" detail="Comparado ao mês anterior" tone="gold" />
      </section>

      <section className="portal-layout portal-layout--charts">
        <article className="portal-panel">
          <PanelHeader eyebrow="Fevereiro a julho" title="Evolução da presença" />
          <div className="portal-line-bars" aria-label="Evolução demonstrativa da frequência">
            {attendanceBars.map(({ month, value }) => <div key={month}><strong>{value}%</strong><span><i style={{ height: `${value}%` }} /></span><small>{month}</small></div>)}
          </div>
        </article>
        <article className="portal-panel">
          <PanelHeader eyebrow="Por atividade" title="Participação da corrente" />
          <div className="portal-progress-list">
            <ProgressBar value={91} label="Giras de desenvolvimento" />
            <ProgressBar value={84} label="Estudos e aulas" />
            <ProgressBar value={88} label="Giras internas" />
            <ProgressBar value={76} label="Cuidados da casa" />
          </div>
        </article>
      </section>

      <article className="portal-panel">
        <PanelHeader eyebrow="Acompanhamento individual" title="Frequência dos filhos" action={<div className="portal-search"><Search size={15} /><input aria-label="Buscar filho" placeholder="Buscar por nome" /></div>} />
        <div className="portal-table-wrap">
          <table className="portal-table portal-table--attendance">
            <thead><tr><th>Filho da casa</th><th>Desenvolvimento</th><th>Estudos</th><th>Cuidados</th><th>Geral</th><th>Acompanhamento</th></tr></thead>
            <tbody>
              {[
                ['Marina de Souza', '6/6', '4/4', '2/2', '100%', 'Presença constante', 'info'],
                ['Rafael Santos', '5/6', '3/4', '2/2', '83%', 'Dentro do esperado', 'neutral'],
                ['Clara Oliveira', '4/6', '4/4', '1/2', '75%', '1 ausência justificada', 'warning'],
                ['João Pereira', '3/6', '2/4', '2/2', '58%', 'Conversar com cuidado', 'danger'],
              ].map(([name, dev, study, care, total, note, tone]) => (
                <tr key={name}><td><div className="portal-table-person"><span>{name.charAt(0)}</span><strong>{name}</strong></div></td><td>{dev}</td><td>{study}</td><td>{care}</td><td><strong>{total}</strong></td><td><StatusPill tone={tone as 'info' | 'neutral' | 'warning' | 'danger'}>{note}</StatusPill></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <p className="portal-sensitive-note"><ShieldCheck size={15} /> Informações de frequência são sensíveis e visíveis somente para pessoas autorizadas.</p>
    </div>
  );
}

export function MembersManagement() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Pessoas" title="Filhos da casa" description="Cadastros, vínculos, funções e acessos organizados com cuidado." action={<button className="portal-button portal-button--primary"><Plus size={16} /> Convidar pessoa</button>} />
      <section className="portal-metrics portal-metrics--compact">
        <MetricCard icon={UsersRound} label="Ativos" value="42" detail="Corrente atual" tone="brand" />
        <MetricCard icon={Clock3} label="Aguardando" value="3" detail="Revisar cadastros" tone="warning" />
        <MetricCard icon={UserRoundCheck} label="Administração" value="2" detail="Iyá Pri e Iyá Bru" tone="gold" />
      </section>

      <article className="portal-panel portal-panel--pending">
        <PanelHeader eyebrow="Precisam de atenção" title="Cadastros aguardando aprovação" />
        <div className="portal-approval-grid">
          {['Marina de Souza', 'Rafael Santos', 'Clara Oliveira'].map((name, index) => (
            <article className="portal-approval-card" key={name}>
              <div className="portal-approval-card__top"><span>{name.charAt(0)}</span><div><h3>{name}</h3><p>Recebido em {21 - index} de julho</p></div></div>
              <dl><div><dt>WhatsApp</dt><dd>(11) 9999{index}-000{index}</dd></div><div><dt>Solicitação</dt><dd>Filho da casa</dd></div></dl>
              <div className="portal-approval-card__actions"><button className="portal-button portal-button--secondary">Ver detalhes</button><button className="portal-button portal-button--primary"><Check size={15} /> Aprovar</button></div>
            </article>
          ))}
        </div>
      </article>

      <article className="portal-panel">
        <PanelHeader eyebrow="Comunidade" title="Todos os filhos" action={<div className="portal-search"><Search size={15} /><input aria-label="Buscar membro" placeholder="Buscar por nome" /></div>} />
        <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Nome</th><th>Função</th><th>Entrada na casa</th><th>Frequência</th><th>Situação</th><th /></tr></thead><tbody>
          {[
            ['Ana Martins', 'Filha da casa', 'Mar 2021', '96%', 'Ativo'], ['Caio Almeida', 'Cambone', 'Ago 2022', '88%', 'Ativo'], ['Helena Rocha', 'Filha da casa', 'Jan 2024', '82%', 'Ativo'], ['Pedro Lima', 'Filho da casa', 'Mai 2025', '64%', 'Acompanhar'],
          ].map(([name, role, joined, attendance, status]) => <tr key={name}><td><div className="portal-table-person"><span>{name.charAt(0)}</span><strong>{name}</strong></div></td><td>{role}</td><td>{joined}</td><td>{attendance}</td><td><StatusPill tone={status === 'Ativo' ? 'info' : 'warning'}>{status}</StatusPill></td><td><button className="portal-icon-button" aria-label={`Opções de ${name}`}><MoreHorizontal size={17} /></button></td></tr>)}
        </tbody></table></div>
      </article>
    </div>
  );
}

export function AgendaManagement() {
  const events = [
    ['24', 'Jul', 'Estudo mediúnico', '20:00–22:00', 'Desenvolvimento', 'Confirmado'],
    ['26', 'Jul', 'Cuidado da casa', '09:00–12:00', 'Equipe Dourada', 'Escala aberta'],
    ['28', 'Jul', 'Reunião da corrente', '19:30–21:00', 'Todos os filhos', 'Confirmado'],
    ['02', 'Ago', 'Gira interna', '19:00–23:00', 'Corrente completa', 'Em preparação'],
  ];
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Agenda" title="Agenda e giras" description="Organize atividades, responsáveis, confirmações e comunicados em um só fluxo." action={<button className="portal-button portal-button--primary"><Plus size={16} /> Criar atividade</button>} />
      <div className="portal-calendar-strip"><button className="is-active">Julho 2026</button><button>Agosto</button><button>Setembro</button><span /><button className="portal-filter"><Filter size={14} /> Filtros</button></div>
      <section className="portal-agenda-layout">
        <article className="portal-panel">
          <PanelHeader eyebrow="Próximas atividades" title="Linha do tempo" />
          <div className="portal-timeline">
            {events.map(([day, month, title, time, group, status], index) => <div className="portal-timeline__item" key={`${day}-${title}`}><div className="portal-timeline__date"><strong>{day}</strong><span>{month}</span></div><i /><div><span className="portal-timeline__type">{group}</span><h3>{title}</h3><p><Clock3 size={13} /> {time}</p></div><StatusPill tone={index === 1 ? 'warning' : 'neutral'}>{status}</StatusPill><button className="portal-icon-button" aria-label={`Opções para ${title}`}><MoreHorizontal size={18} /></button></div>)}
          </div>
        </article>
        <aside className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Julho" title="Resumo" /><dl className="portal-definition-list"><div><dt>Atividades</dt><dd>8</dd></div><div><dt>Escalas abertas</dt><dd>2</dd></div><div><dt>Confirmações pendentes</dt><dd>7</dd></div></dl></article><article className="portal-note-card portal-note-card--light"><BellRing size={22} /><p>O lembrete do estudo de quinta-feira será enviado amanhã às 18h.</p><span>Automação programada</span></article></aside>
      </section>
    </div>
  );
}

export function ContentManagement() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Conteúdos" title="Estudos e comunicados" description="Materiais da casa organizados para chegar às pessoas certas, no momento certo." action={<button className="portal-button portal-button--primary"><Plus size={16} /> Novo conteúdo</button>} />
      <section className="portal-content-categories">
        {[['Estudos mediúnicos', '12 materiais', BookOpen], ['Documentos da casa', '8 arquivos', FileText], ['Comunicados', '5 publicados', BellRing]].map(([title, count, Icon]) => { const ContentIcon = Icon as typeof BookOpen; return <article key={String(title)}><ContentIcon size={21} /><div><h2>{String(title)}</h2><p>{String(count)}</p></div><ArrowRight size={17} /></article>; })}
      </section>
      <article className="portal-panel"><PanelHeader eyebrow="Publicados recentemente" title="Biblioteca da casa" action={<div className="portal-search"><Search size={15} /><input aria-label="Buscar conteúdo" placeholder="Buscar conteúdo" /></div>} /><div className="portal-library-list">
        {[
          ['Fundamentos da mediunidade', 'Estudo mediúnico', 'Vídeo · 42 min', 'Todos os filhos'],
          ['Orientações para a corrente', 'Documento da casa', 'PDF · 8 páginas', 'Todos os filhos'],
          ['Escala de agosto', 'Comunicado', 'Publicado hoje', 'Equipe de cuidados'],
          ['Ervas de proteção', 'Material de apoio', 'PDF · 12 páginas', 'Desenvolvimento II'],
        ].map(([title, type, meta, audience]) => <div className="portal-library-item" key={title}><div className="portal-library-item__icon"><FileText size={19} /></div><div><span>{type}</span><h3>{title}</h3><p>{meta}</p></div><StatusPill>{audience}</StatusPill><button className="portal-icon-button" aria-label={`Opções para ${title}`}><MoreHorizontal size={18} /></button></div>)}
      </div></article>
    </div>
  );
}

export function AdminSettings() {
  const roles = [
    ['Iyás administradoras', 'Gestão completa da casa', '2 pessoas', 'Administração'],
    ['Filhos da casa', 'Acesso somente aos próprios dados', '42 pessoas', 'Membro'],
    ['Acesso técnico', 'Configuração sem dados sensíveis por padrão', '1 pessoa', 'Técnico'],
  ];
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Administração · Configurações" title="Permissões e segurança" description="Defina quem pode ver, criar e alterar cada parte do sistema." />
      <section className="portal-layout portal-layout--settings">
        <article className="portal-panel"><PanelHeader eyebrow="Papéis do sistema" title="Níveis de acesso" /><div className="portal-role-list">{roles.map(([title, desc, people, badge]) => <div key={title}><div className="portal-role-list__icon"><ShieldCheck size={19} /></div><div><h3>{title}</h3><p>{desc}</p></div><span>{people}</span><StatusPill tone={badge === 'Administração' ? 'gold' : 'neutral'}>{badge}</StatusPill><button className="portal-icon-button" aria-label={`Editar ${title}`}><Settings2 size={17} /></button></div>)}</div></article>
        <aside className="portal-stack"><article className="portal-panel portal-panel--accent"><PanelHeader eyebrow="Proteção" title="Boas práticas ativas" /><ul className="portal-check-list"><li><CheckCircle2 size={17} /> Regras por perfil</li><li><CheckCircle2 size={17} /> Dados sensíveis restritos</li><li><CheckCircle2 size={17} /> Sessões protegidas</li><li><Clock3 size={17} /> Auditoria detalhada na próxima etapa</li></ul></article><article className="portal-panel"><PanelHeader eyebrow="Sessão" title="Políticas de acesso" /><p className="portal-panel__copy">Contas suspensas perdem acesso imediatamente. Alterações de papel exigirão confirmação administrativa.</p></article></aside>
      </section>
    </div>
  );
}
