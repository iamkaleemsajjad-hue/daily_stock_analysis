import type React from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import logoSvg from '../../assets/logo.svg';
import { useLocation } from 'react-router-dom';
import { useUiLanguage } from '../../contexts/UiLanguageContext';
import { PremiumThemeToggle } from '../theme/PremiumThemeToggle';
import type { UiTextKey } from '../../i18n/uiText';

type ShellHeaderProps = {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenMobileNav: () => void;
};

const TITLES: Record<string, UiTextKey> = {
  '/': 'layout.route.home.title',
  '/chat': 'layout.route.chat.title',
  '/portfolio': 'layout.route.portfolio.title',
  '/screening': 'layout.route.screening.title',
  '/backtest': 'layout.route.backtest.title',
  '/alerts': 'layout.route.alerts.title',
  '/usage': 'layout.route.usage.title',
  '/settings': 'layout.route.settings.title',
  '/decision-signals': 'layout.route.decisionSignals.title',
};

export const ShellHeader: React.FC<ShellHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onOpenMobileNav,
}) => {
  const location = useLocation();
  const { t } = useUiLanguage();

  // Get just the base path (e.g. /chat/123 → /chat)
  const basePath = '/' + location.pathname.split('/')[1];
  const pageTitle = TITLES[basePath] ? t(TITLES[basePath]) : t('layout.appFallbackTitle');

  return (
    <header className="flex-shrink-0 flex items-center justify-between h-12 px-4 border-b border-[var(--shell-sidebar-border)] bg-background/90 backdrop-blur-sm z-20">
      <div className="flex items-center">
        {/* Hamburger — works on all screen sizes */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-none text-secondary-text transition-colors hover:bg-hover hover:text-foreground mr-3"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex lg:hidden h-8 w-8 items-center justify-center rounded-none text-secondary-text transition-colors hover:bg-hover hover:text-foreground mr-3"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb: DSA > PageName */}
        <div className="flex items-center gap-1.5 text-sm overflow-hidden">
          <div
            className={`hidden lg:flex items-center justify-center shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              sidebarOpen ? 'w-0 h-0 opacity-0 -translate-x-4 mr-0' : 'w-10 h-10 opacity-100 translate-x-0 mr-1.5'
            }`}
          >
            <img
              src={logoSvg}
              alt="DSA Logo"
              className="h-10 w-10 object-contain dsa-logo-theme"
            />
          </div>
          <span className="font-semibold text-foreground">DSA</span>
          <ChevronRight className="h-3.5 w-3.5 text-secondary-text/60 shrink-0" />
          <span className="text-secondary-text">{pageTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PremiumThemeToggle />
      </div>
    </header>
  );
};
