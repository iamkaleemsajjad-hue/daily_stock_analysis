import type React from 'react';
import { Card } from './Card';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'glass' | 'spatial' | 'glow';
  enterDelay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  animatedBorder?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
  variant = 'bordered',
  enterDelay,
  animatedBorder = false,
}) => {
  return (
    <Card
      className={className}
      padding="md"
      variant={variant}
      enterDelay={enterDelay}
      animatedBorder={animatedBorder}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {subtitle ? <span className="label-uppercase">{subtitle}</span> : null}
          <h2 className="mt-1 text-lg font-semibold text-foreground section-header-premium">{title}</h2>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </Card>
  );
};
