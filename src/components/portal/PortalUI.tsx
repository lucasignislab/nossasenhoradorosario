import type { LucideIcon } from 'lucide-react';

export type Tone = 'brand' | 'gold' | 'info' | 'warning' | 'danger' | 'neutral';

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="portal-page__header">
      <div>
        <p className="portal-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="portal-page__actions">{action}</div>}
    </header>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
}) {
  return (
    <article className={`portal-metric portal-metric--${tone}`}>
      <div className="portal-metric__icon"><Icon size={19} /></div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

export function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`portal-status portal-status--${tone}`}>{children}</span>;
}

export function PanelHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="portal-panel__header">
      <div>
        {eyebrow && <p className="portal-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="portal-progress" aria-label={`${label}: ${value}%`}>
      <div><span>{label}</span><strong>{value}%</strong></div>
      <span className="portal-progress__track"><span style={{ width: `${value}%` }} /></span>
    </div>
  );
}
