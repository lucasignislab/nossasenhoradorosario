import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  HeartHandshake,
  Play,
  ReceiptText,
  Sparkles,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import { MetricCard, PageHeader, PanelHeader, ProgressBar, StatusPill } from './PortalUI';

export function MemberAgenda() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Agenda" title="Nossa caminhada no mês" description="Giras, estudos, reuniões e compromissos internos organizados em um só lugar." />
      <section className="member-feature-card"><div><p className="portal-eyebrow">Próximo compromisso</p><h2>Estudo mediúnico</h2><p><CalendarDays size={15} /> Quinta-feira, 24 de julho · 20h</p><span>Desenvolvimento · Salão principal</span></div><button className="portal-button portal-button--primary"><CheckCircle2 size={16} /> Confirmar presença</button></section>
      <section className="portal-layout portal-layout--overview">
        <article className="portal-panel"><PanelHeader eyebrow="Julho de 2026" title="Próximas atividades" /><div className="member-agenda-list">
          {[
            ['24', 'Estudo mediúnico', '20:00–22:00', 'Desenvolvimento'], ['26', 'Cuidado da casa', '09:00–12:00', 'Equipe Dourada'], ['28', 'Reunião da corrente', '19:30–21:00', 'Todos os filhos'], ['02', 'Gira interna', '19:00–23:00', 'Corrente completa'],
          ].map(([day,title,time,type], index) => <div key={`${day}-${title}`}><span><strong>{day}</strong><small>{index === 3 ? 'AGO' : 'JUL'}</small></span><div><StatusPill tone={index === 0 ? 'gold' : 'neutral'}>{type}</StatusPill><h3>{title}</h3><p><Clock3 size={13} /> {time}</p></div><button aria-label={`Ver ${title}`}><ArrowRight size={17} /></button></div>)}
        </div></article>
        <aside className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Sua agenda" title="Resumo do mês" /><dl className="portal-definition-list"><div><dt>Atividades</dt><dd>6</dd></div><div><dt>Confirmadas</dt><dd>4</dd></div><div><dt>Aguardando você</dt><dd>2</dd></div></dl></article><article className="portal-note-card portal-note-card--light"><HeartHandshake size={22} /><p>Se não puder comparecer, avise com antecedência para cuidarmos da organização.</p><span>Cuidado coletivo</span></article></aside>
      </section>
    </div>
  );
}

export function MemberChores() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Cuidados" title="Cuidar da casa é parte do axé" description="Consulte sua equipe, confirme sua participação e acompanhe as próximas escalas." />
      <section className="portal-metrics portal-metrics--compact"><MetricCard icon={Sparkles} label="Próxima escala" value="26 jul" detail="Sábado · 9h" tone="gold" /><MetricCard icon={UsersRound} label="Sua equipe" value="Dourada" detail="6 pessoas confirmadas" tone="brand" /><MetricCard icon={CheckCircle2} label="Participação" value="4 de 4" detail="Escalas realizadas em 2026" tone="info" /></section>
      <section className="portal-layout portal-layout--overview">
        <article className="portal-panel"><PanelHeader eyebrow="Sábado · 26 de julho" title="Equipe Dourada" action={<StatusPill tone="warning">Confirmação pendente</StatusPill>} /><div className="member-team-grid">{['Ana Martins', 'Caio Almeida', 'Helena Rocha', 'Pedro Lima', 'Você', 'Marina Souza'].map((name, index) => <div key={name}><span>{name === 'Você' ? 'V' : name.charAt(0)}</span><strong>{name}</strong><small>{index < 4 ? 'Confirmado' : 'Aguardando'}</small></div>)}</div><div className="member-task-list"><h3>Cuidados deste dia</h3>{['Limpeza do salão principal', 'Organização da cozinha', 'Cuidados com o congá', 'Área externa e materiais'].map(item => <p key={item}><CheckCircle2 size={15} /> {item}</p>)}</div><button className="portal-button portal-button--primary">Confirmar minha participação</button></article>
        <aside className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Calendário" title="Próximas escalas" /><div className="member-small-list"><div><strong>16 ago</strong><span>Equipe Vermelha</span></div><div><strong>30 ago</strong><span>Equipe Dourada</span></div><div><strong>13 set</strong><span>Equipe Branca</span></div></div></article><article className="portal-note-card portal-note-card--light"><Sparkles size={22} /><p>Precisa trocar sua escala? Solicite com antecedência para a administração.</p><span>Troca de equipe</span></article></aside>
      </section>
    </div>
  );
}

export function MemberAttendance() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Frequência" title="Minha presença na casa" description="Um registro pessoal para acompanhar sua participação, sem comparações com outras pessoas." />
      <section className="portal-metrics portal-metrics--compact"><MetricCard icon={UserCheck} label="Frequência geral" value="87%" detail="Período de fevereiro a julho" tone="brand" /><MetricCard icon={CalendarCheck} label="Presenças" value="26" detail="Em 30 atividades" tone="info" /><MetricCard icon={Clock3} label="Justificadas" value="3" detail="Registros acolhidos pela casa" tone="neutral" /></section>
      <section className="portal-layout portal-layout--charts"><article className="portal-panel"><PanelHeader eyebrow="Seu caminho" title="Participação por atividade" /><div className="portal-progress-list"><ProgressBar value={92} label="Giras de desenvolvimento" /><ProgressBar value={86} label="Estudos e aulas" /><ProgressBar value={88} label="Giras internas" /><ProgressBar value={75} label="Cuidados da casa" /></div></article><article className="portal-panel"><PanelHeader eyebrow="Últimos meses" title="Evolução" /><div className="member-attendance-highlight"><strong>+8%</strong><p>Sua presença cresceu desde abril.</p><span>Continue respeitando seu tempo e sua caminhada.</span></div></article></section>
      <article className="portal-panel"><PanelHeader eyebrow="Histórico pessoal" title="Atividades recentes" /><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Data</th><th>Atividade</th><th>Tipo</th><th>Situação</th></tr></thead><tbody>{[['17 jul','Estudo mediúnico','Desenvolvimento','Presente'],['12 jul','Gira interna','Gira','Presente'],['05 jul','Cuidado da casa','Escala','Justificada'],['03 jul','Estudo mediúnico','Desenvolvimento','Presente']].map(([date,title,type,status]) => <tr key={`${date}-${title}`}><td>{date}</td><td><strong>{title}</strong></td><td>{type}</td><td><StatusPill tone={status === 'Presente' ? 'info' : 'warning'}>{status}</StatusPill></td></tr>)}</tbody></table></div></article>
    </div>
  );
}

export function MemberStudies() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Estudos" title="Conhecimento que acompanha a prática" description="Estudos, materiais e orientações preparados pela casa para o seu desenvolvimento." />
      <section className="member-feature-card member-feature-card--study"><div><StatusPill tone="gold">Continue estudando</StatusPill><h2>Fundamentos da mediunidade</h2><p>Você concluiu 3 de 5 conteúdos deste percurso.</p><span className="member-inline-progress"><i><i style={{width:'60%'}} /></i><strong>60%</strong></span></div><button className="portal-button portal-button--primary"><Play size={15} /> Continuar</button></section>
      <div className="dashboard-home__section-heading"><div><p className="portal-eyebrow">Biblioteca da casa</p><h2>Percursos de estudo</h2></div><span>12 materiais disponíveis</span></div>
      <section className="member-course-grid">{[
        ['Desenvolvimento mediúnico','5 conteúdos','3 concluídos',BookOpen,60],['Ervas e fundamentos','4 conteúdos','1 concluído',Sparkles,25],['Cantigas da casa','8 conteúdos','Novo',Play,0],['Orientações da corrente','6 documentos','4 lidos',FileText,67],
      ].map(([title,count,detail,Icon,progress]) => { const CourseIcon=Icon as typeof BookOpen; return <article key={String(title)}><div className="member-course-card__icon"><CourseIcon size={21} /></div><StatusPill>{String(count)}</StatusPill><h3>{String(title)}</h3><p>{String(detail)}</p><span className="member-inline-progress"><i><i style={{width:`${progress}%`}} /></i><strong>{String(progress)}%</strong></span><button>Ver percurso <ArrowRight size={14} /></button></article>; })}</section>
    </div>
  );
}

export function MemberFinance() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Mensalidades" title="Minha contribuição" description="Acompanhe sua situação, consulte o histórico e envie comprovantes com tranquilidade." />
      <section className="member-finance-hero"><div><span>Situação de julho</span><strong>Em dia</strong><p>Contribuição confirmada em 10 de julho de 2026</p></div><CheckCircle2 size={48} /><div><small>Próximo vencimento</small><strong>10 ago</strong><span>R$ 90,00</span></div></section>
      <section className="portal-layout portal-layout--overview"><article className="portal-panel"><PanelHeader eyebrow="Forma de contribuição" title="Pagamento via Pix" /><div className="member-pix"><div><span>Chave Pix da casa</span><strong>tesouraria@senhoradorosario.org</strong></div><button className="portal-button portal-button--secondary">Copiar chave</button></div><p className="portal-panel__copy">Depois do pagamento, envie o comprovante para facilitar a conciliação da administração.</p><button className="portal-button portal-button--primary"><ReceiptText size={15} /> Enviar comprovante</button></article><aside className="portal-panel"><PanelHeader eyebrow="Ano de 2026" title="Resumo" /><dl className="portal-definition-list"><div><dt>Mensalidades pagas</dt><dd>7</dd></div><div><dt>Total contribuído</dt><dd>R$ 630</dd></div><div><dt>Pendências</dt><dd>Nenhuma</dd></div></dl></aside></section>
      <article className="portal-panel member-history-panel"><PanelHeader eyebrow="Histórico" title="Minhas mensalidades" action={<button className="portal-filter"><Download size={14} /> Baixar informe</button>} /><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Referência</th><th>Pagamento</th><th>Valor</th><th>Situação</th><th>Comprovante</th></tr></thead><tbody>{[['Julho 2026','10 jul 2026','R$ 90,00'],['Junho 2026','08 jun 2026','R$ 90,00'],['Maio 2026','10 mai 2026','R$ 90,00'],['Abril 2026','09 abr 2026','R$ 90,00']].map(([month,date,value]) => <tr key={month}><td><strong>{month}</strong></td><td>{date}</td><td>{value}</td><td><StatusPill tone="info">Confirmado</StatusPill></td><td><button className="portal-text-link"><Download size={13} /> Recibo</button></td></tr>)}</tbody></table></div></article>
    </div>
  );
}

export function MemberNotices() {
  return (
    <div className="portal-page">
      <PageHeader eyebrow="Área dos filhos · Avisos" title="Comunicados da casa" description="Orientações importantes, mudanças de agenda e notícias para a corrente." />
      <section className="member-notice-layout"><div className="portal-stack">{[
        ['Importante','Mudança no horário da gira interna','A atividade do dia 2 de agosto começará às 19h. Pedimos que a corrente chegue com 30 minutos de antecedência.','Hoje · Iyá Pri','gold'],
        ['Organização','Nova escala de cuidados disponível','As equipes de agosto já estão organizadas. Consulte sua próxima data e confirme a participação.','Ontem · Administração','info'],
        ['Estudos','Material novo na biblioteca','O estudo Fundamentos da Mediunidade recebeu um novo vídeo e material complementar.','18 jul · Iyá Bru','neutral'],
      ].map(([type,title,body,meta,tone],index) => <article className={`member-notice ${index===0?'is-featured':''}`} key={title}><div><Bell size={18} /></div><div><StatusPill tone={tone as 'gold'|'info'|'neutral'}>{type}</StatusPill><h2>{title}</h2><p>{body}</p><span>{meta}</span></div></article>)}</div><aside className="portal-stack"><article className="portal-panel"><PanelHeader eyebrow="Caixa de entrada" title="Resumo" /><dl className="portal-definition-list"><div><dt>Não lidos</dt><dd>2</dd></div><div><dt>Este mês</dt><dd>7</dd></div><div><dt>Importantes</dt><dd>1</dd></div></dl></article><article className="portal-note-card portal-note-card--light"><Bell size={22} /><p>Ative as notificações para não perder mudanças importantes.</p><span>Preferências</span></article></aside></section>
    </div>
  );
}
