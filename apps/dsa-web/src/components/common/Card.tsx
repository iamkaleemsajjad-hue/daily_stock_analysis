import type React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'bordered' | 'gradient' | 'glass' | 'spatial' | 'glow';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Stagger index (0–6) for entrance animation delay */
  enterDelay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Animated gradient border on hover */
  animatedBorder?: boolean;
}

/**
 * Card component with terminal-inspired variants and optional hover styling.
 * New variants: 'glass' (liquid glassmorphism), 'spatial' (3D depth), 'glow' (radial glow)
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  style,
  variant = 'default',
  hoverable = false,
  padding = 'md',
  enterDelay,
  animatedBorder = false,
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const variantStyles = {
    default: 'terminal-card',
    bordered: 'terminal-card',
    gradient: 'gradient-border-card',
    glass: 'liquid-glass rounded-2xl',
    spatial: 'spatial-card',
    glow: 'glow-card',
  };

  const hoverStyles = hoverable ? 'terminal-card-hover cursor-pointer' : '';

  const delayClass = enterDelay != null && enterDelay > 0
    ? `card-enter card-enter-delay-${enterDelay}`
    : enterDelay === 0 ? 'card-enter' : '';

  const borderClass = animatedBorder ? 'animated-gradient-border' : '';

  if (variant === 'gradient') {
    return (
      <div className={cn(variantStyles.gradient, borderClass, delayClass, className)} style={style}>
        <div className={cn('gradient-border-card-inner', paddingStyles[padding])}>
          {(title || subtitle) && (
            <div className="mb-3">
              {subtitle ? <span className="label-uppercase">{subtitle}</span> : null}
              {title ? <h3 className="mt-1 text-lg font-semibold text-foreground section-header-premium">{title}</h3> : null}
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      className={cn(
        variant === 'glass' || variant === 'spatial' || variant === 'glow'
          ? variantStyles[variant]
          : cn('rounded-2xl', variantStyles[variant]),
        hoverStyles,
        paddingStyles[padding],
        delayClass,
        borderClass,
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="mb-3">
          {subtitle ? <span className="label-uppercase">{subtitle}</span> : null}
          {title ? <h3 className="mt-1 text-lg font-semibold text-foreground section-header-premium">{title}</h3> : null}
        </div>
      )}
      {children}
    </div>
  );
};
