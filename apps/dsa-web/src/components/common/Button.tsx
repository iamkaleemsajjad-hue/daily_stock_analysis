import React, { useRef } from 'react';
import { useUiLanguage } from '../../contexts/UiLanguageContext';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger' | 'danger-subtle' | 'settings-primary' | 'settings-secondary' | 'action-primary' | 'action-secondary' | 'home-action-ai' | 'home-action-report' | 'glass' | 'neon' | 'liquid' | 'gradient-border';
  size?: 'xsm' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  /** Custom loading text. */
  loadingText?: string;
  glow?: boolean;
  /** Enable ripple effect on click */
  ripple?: boolean;
}

const BUTTON_SIZE_STYLES = {
  xsm: 'h-6 rounded-lg px-2 text-sm',
  sm: 'h-9 rounded-lg px-3 text-sm',
  md: 'h-10 rounded-xl px-4 text-sm',
  lg: 'h-11 rounded-xl px-5 text-sm',
  xl: 'h-12 rounded-xl px-6 text-sm',
} as const;

const ACTION_AI_STYLES = 'bg-[var(--home-action-ai-bg)] border border-[var(--home-action-ai-border)] text-[var(--home-action-ai-text)] hover:bg-[var(--home-action-ai-hover-bg)]';
const ACTION_REPORT_STYLES = 'bg-[var(--home-action-report-bg)] border border-[var(--home-action-report-border)] text-[var(--home-action-report-text)] hover:bg-[var(--home-action-report-hover-bg)]';

const BUTTON_VARIANT_STYLES = {
  primary: 'border border-cyan/30 bg-primary-gradient text-primary-foreground shadow-lg shadow-cyan/20 hover:brightness-105',
  secondary: 'border border-border/70 bg-card text-foreground shadow-soft-card hover:bg-hover',
  'settings-primary': 'border settings-button-primary hover:brightness-105 hover:shadow-xl',
  'settings-secondary': 'border settings-button-secondary hover:translate-y-[-1px]',
  outline: 'border border-cyan/25 bg-transparent text-cyan hover:bg-cyan/10',
  ghost: 'border border-transparent bg-transparent text-secondary-text hover:bg-hover hover:text-foreground',
  gradient: 'border border-cyan/20 bg-gradient-to-r from-cyan to-purple text-primary-foreground shadow-lg shadow-cyan/20 hover:brightness-105',
  danger: 'border border-danger/40 bg-danger text-destructive-foreground shadow-lg shadow-danger/20 hover:brightness-105',
  'danger-subtle': 'border border-danger/60 bg-danger/10 text-danger hover:bg-danger/15',
  'action-primary': ACTION_AI_STYLES,
  'action-secondary': ACTION_REPORT_STYLES,
  'home-action-ai': ACTION_AI_STYLES,
  'home-action-report': ACTION_REPORT_STYLES,
  // Premium new variants
  glass: 'btn-glass focus-glow-premium',
  neon: 'btn-neon focus-glow-premium',
  liquid: 'btn-liquid focus-glow-premium',
  'gradient-border': 'btn-gradient-border focus-glow-premium',
} as const;

/**
 * Button component with multiple variants and premium animation styling.
 * New variants: 'glass', 'neon', 'liquid', 'gradient-border'
 * New props: ripple (boolean) — adds a ripple effect on click.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  glow = false,
  ripple = false,
  className = '',
  disabled,
  type = 'button',
  onClick,
  ...props
}) => {
  const { t } = useUiLanguage();
  const glowStyles = glow ? 'shadow-glow-cyan settings-glow-cyan-hover' : '';
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && btnRef.current) {
      const btn = btnRef.current;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const rippleEl = document.createElement('span');
      rippleEl.className = 'ripple';
      rippleEl.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px;
        position: absolute; border-radius: 50%;
        background: hsl(var(--primary) / 0.25);
        transform: scale(0);
        animation: ripple-out 0.6s ease-out forwards;
        pointer-events: none;
      `;
      btn.appendChild(rippleEl);
      setTimeout(() => rippleEl.remove(), 700);
    }
    onClick?.(e);
  };

  // Premium variants skip size overrides for padding (they have their own)
  const isPremiumVariant = ['glass', 'neon', 'liquid', 'gradient-border'].includes(variant);

  return (
    <button
      ref={btnRef}
      type={type}
      aria-busy={isLoading || undefined}
      data-variant={variant}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan/15 focus-visible:ring-offset-0',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none',
        !isPremiumVariant && BUTTON_SIZE_STYLES[size],
        BUTTON_VARIANT_STYLES[variant],
        glowStyles,
        className,
      )}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          {/* Premium gradient spinner replaces plain SVG spinner */}
          <span className="premium-spinner" aria-hidden="true" />
          {loadingText ?? t('common.processing')}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
