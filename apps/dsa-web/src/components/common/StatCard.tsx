import type React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  /** Metric label, such as "Total Return". */
  label: string;
  /** Metric value, including numbers or percentages. */
  value: React.ReactNode;
  /** Supporting text, such as "Up 5% vs last month". */
  hint?: React.ReactNode;
  /** Optional trailing icon. */
  icon?: React.ReactNode;
  /** Tone variant that affects the border color. */
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Optional extra className. */
  className?: string;
  /** Use premium glass + float animation style */
  premium?: boolean;
  /** Stagger delay index (1–6) */
  enterDelay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

const toneStyles = {
  default: 'border-subtle',
  primary: 'border-cyan/18',
  success: 'border-success/18',
  warning: 'border-warning/18',
  danger: 'border-danger/18',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  hint,
  icon,
  tone = 'default',
  className = '',
  premium = true,
  enterDelay,
}) => {
  const delayClass = enterDelay != null && enterDelay > 0
    ? `card-enter card-enter-delay-${enterDelay}`
    : enterDelay === 0 ? 'card-enter' : '';

  if (premium) {
    return (
      <div className={cn('stat-card-premium p-4', toneStyles[tone], delayClass, className)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary-text">{label}</p>
            <div className="mt-2 text-2xl font-semibold text-foreground value-highlight">{value}</div>
            {hint ? <div className="mt-2 text-sm text-secondary-text">{hint}</div> : null}
          </div>
          {icon ? (
            <div className="text-cyan icon-bounce-parent">
              <span className="icon-bounce-child inline-block">{icon}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border bg-card/75 p-4 shadow-soft-card', toneStyles[tone], delayClass, className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary-text">{label}</p>
          <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
          {hint ? <div className="mt-2 text-sm text-secondary-text">{hint}</div> : null}
        </div>
        {icon ? <div className="text-cyan">{icon}</div> : null}
      </div>
    </div>
  );
};
