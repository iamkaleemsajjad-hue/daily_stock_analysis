import type React from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useUiLanguage } from '../../contexts/UiLanguageContext';
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
  onToggleSidebar,
  onOpenMobileNav,
}) => {
  const location = useLocation();
  const { t } = useUiLanguage();

  // Get just the base path (e.g. /chat/123 → /chat)
  const basePath = '/' + location.pathname.split('/')[1];
  const pageTitle = TITLES[basePath] ? t(TITLES[basePath]) : t('layout.appFallbackTitle');

  return (
    <header className="flex-shrink-0 flex items-center h-12 px-4 border-b border-[var(--shell-sidebar-border)] bg-background/90 backdrop-blur-sm z-20">
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
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-semibold text-foreground">DSA</span>
        <ChevronRight className="h-3.5 w-3.5 text-secondary-text/60 shrink-0" />
        <span className="text-secondary-text">{pageTitle}</span>
      </div>
    </header>
  );
};
