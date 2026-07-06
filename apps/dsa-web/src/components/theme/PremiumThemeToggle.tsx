import type React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useUiLanguage } from '../../contexts/UiLanguageContext';

export const PremiumThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useUiLanguage();
  
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-secondary-text select-none hidden sm:inline-block">
        {t('theme.theme')}
      </span>
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shell-sidebar-border)] bg-background/50 text-secondary-text shadow-sm transition-all duration-300 hover:bg-hover hover:text-foreground hover:shadow"
        aria-label={t('theme.toggle')}
        title={t('theme.toggle')}
      >
        <Sun 
          className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
        <Moon 
          className={`absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
          }`} 
        />
      </button>
    </div>
  );
};
