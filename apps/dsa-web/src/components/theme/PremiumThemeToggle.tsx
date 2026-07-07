import type React from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useUiLanguage } from '../../contexts/UiLanguageContext';

/**
 * Premium theme toggle — cycles through system → light → dark → system.
 * Preserves the ability to return to OS-controlled (system) theme.
 */
export const PremiumThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useUiLanguage();

  const isDark = resolvedTheme === 'dark';
  const isSystem = !theme || theme === 'system';

  const cycleTheme = () => {
    if (isSystem) {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const ariaLabel = isSystem
    ? t('theme.system')
    : isDark
      ? t('theme.dark')
      : t('theme.light');

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-secondary-text select-none hidden sm:inline-block">
        {t('theme.theme')}
      </span>
      <button
        onClick={cycleTheme}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shell-sidebar-border)] bg-background/50 text-secondary-text shadow-sm transition-all duration-300 hover:bg-hover hover:text-foreground hover:shadow"
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        {/* System icon */}
        <Monitor
          className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isSystem ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
          }`}
        />
        {/* Sun icon (light mode) */}
        <Sun
          className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            !isSystem && !isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
          }`}
        />
        {/* Moon icon (dark mode) */}
        <Moon
          className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            !isSystem && isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
          }`}
        />
      </button>
    </div>
  );
};
