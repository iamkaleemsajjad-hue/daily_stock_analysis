import React, { useEffect, useState } from 'react';
import {
  Activity, BarChart3, Bell, BriefcaseBusiness, Gauge,
  Home, LogOut, MessageSquareQuote, Search, Settings2
} from 'lucide-react';
import logoSvg from '../../assets/logo.svg';
import { NavLink } from 'react-router-dom';
import { ALPHASIFT_CONFIG_CHANGED_EVENT, SYSTEM_CONFIG_CHANGED_EVENT, alphasiftApi } from '../../api/alphasift';
import { useAuth } from '../../contexts/AuthContext';
import { useAgentChatStore } from '../../stores/agentChatStore';
import { useUiLanguage } from '../../contexts/UiLanguageContext';
import type { UiTextKey } from '../../i18n/uiText';
import { cn } from '../../utils/cn';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { StatusDot } from '../common/StatusDot';
import { UiLanguageToggle } from '../i18n/UiLanguageToggle';


type SidebarNavProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
  variant?: 'default' | 'rail';
};

type NavItem = {
  key: string;
  labelKey: UiTextKey;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: 'completion';
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', labelKey: 'layout.nav.home', to: '/', icon: Home, exact: true },
  { key: 'chat', labelKey: 'layout.nav.chat', to: '/chat', icon: MessageSquareQuote, badge: 'completion' },
  { key: 'screening', labelKey: 'layout.nav.screening', to: '/screening', icon: Search },
  { key: 'portfolio', labelKey: 'layout.nav.portfolio', to: '/portfolio', icon: BriefcaseBusiness },
  { key: 'decision-signals', labelKey: 'layout.nav.decisionSignals', to: '/decision-signals', icon: Activity },
  { key: 'backtest', labelKey: 'layout.nav.backtest', to: '/backtest', icon: BarChart3 },
  { key: 'alerts', labelKey: 'layout.nav.alerts', to: '/alerts', icon: Bell },
  { key: 'usage', labelKey: 'layout.nav.usage', to: '/usage', icon: Gauge },
  { key: 'settings', labelKey: 'layout.nav.settings', to: '/settings', icon: Settings2 },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed = false, onNavigate }) => {
  const { authEnabled, logout } = useAuth();
  const { t } = useUiLanguage();
  const completionBadge = useAgentChatStore((state) => state.completionBadge);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAlphaSiftNav, setShowAlphaSiftNav] = useState(false);

  useEffect(() => {
    let active = true;
    const refreshAlphaSiftStatus = async () => {
      try {
        const status = await alphasiftApi.getStatus();
        if (active) setShowAlphaSiftNav(status.enabled);
      } catch {
        if (active) setShowAlphaSiftNav(false);
      }
    };
    void refreshAlphaSiftStatus();
    window.addEventListener(ALPHASIFT_CONFIG_CHANGED_EVENT, refreshAlphaSiftStatus);
    window.addEventListener(SYSTEM_CONFIG_CHANGED_EVENT, refreshAlphaSiftStatus);
    return () => {
      active = false;
      window.removeEventListener(ALPHASIFT_CONFIG_CHANGED_EVENT, refreshAlphaSiftStatus);
      window.removeEventListener(SYSTEM_CONFIG_CHANGED_EVENT, refreshAlphaSiftStatus);
    };
  }, []);

  const navItems = showAlphaSiftNav ? NAV_ITEMS : NAV_ITEMS.filter((item) => item.key !== 'screening');

  // Base classes for all nav items
  const itemBase =
    'sidebar-nav-item-premium group relative flex items-center w-full gap-3 px-4 py-2.5 text-sm text-secondary-text transition-all duration-200 hover:bg-[var(--nav-hover-bg)] hover:text-foreground rounded-none';
  const itemActive =
    'bg-[var(--nav-active-bg)] text-foreground font-medium border-l-2 border-[hsl(var(--primary))]';
  const iconBase = 'h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110';

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 px-4 py-1 border-b border-[var(--shell-sidebar-border)]">
        <div className="flex h-14 w-14 items-center justify-center shrink-0">
          <img
            src={logoSvg}
            alt="DSA Logo"
            className="h-28 w-28 object-contain dsa-logo-theme float-animate-slow"
          />
        </div>
        {!collapsed && (
          <span className="text-base font-bold tracking-wide text-foreground leading-none text-glow-static">DSA</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 py-3 overflow-y-auto" aria-label={t('layout.mainNav')}>
        {navItems.map(({ key, labelKey, to, icon: Icon, exact, badge }) => {
          const label = t(labelKey);
          return (
            <NavLink
              key={key}
              to={to}
              end={exact}
              onClick={onNavigate}
              aria-label={label}
              className={({ isActive }) => cn(itemBase, isActive ? itemActive : '')}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn(iconBase, isActive ? 'text-[hsl(var(--primary))]' : 'text-current')} />
                  {!collapsed && <span className="truncate">{label}</span>}
                  {badge === 'completion' && completionBadge ? (
                    <StatusDot
                      tone="info"
                      data-testid="chat-completion-badge"
                      className="absolute right-3 border-2 border-background shadow-[0_0_10px_var(--nav-indicator-shadow)]"
                      aria-label={t('layout.newChatMessage')}
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}


      </nav>

      {/* Bottom: Language toggle */}
      <div className="border-t border-[var(--shell-sidebar-border)] pb-2 pt-1">
        <UiLanguageToggle
          variant="nav"
          collapsed={collapsed}
          wrapperClassName="w-full"
          triggerClassName={itemBase}
          triggerActiveClassName={itemActive}
          iconClassName={iconBase}
          labelClassName="truncate"
        />
      </div>

      {/* Logout */}
      {authEnabled ? (
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className={cn(itemBase, 'mb-2')}
        >
          <LogOut className={iconBase} />
          {!collapsed && <span className="truncate">{t('layout.logout')}</span>}
        </button>
      ) : null}

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title={t('layout.logoutTitle')}
        message={t('layout.logoutMessage')}
        confirmText={t('layout.logoutConfirm')}
        cancelText={t('common.cancel')}
        isDanger
        onConfirm={() => {
          setShowLogoutConfirm(false);
          onNavigate?.();
          void logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};
