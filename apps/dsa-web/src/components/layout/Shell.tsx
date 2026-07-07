import type React from 'react';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Drawer } from '../common/Drawer';
import { SidebarNav } from './SidebarNav';
import { ShellHeader } from './ShellHeader';
import { cn } from '../../utils/cn';
import { useUiLanguage } from '../../contexts/UiLanguageContext';

type ShellProps = {
  children?: React.ReactNode;
};

const SIDEBAR_WIDTH = 180;

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useUiLanguage();

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop sidebar — slides in/out completely */}
      <aside
        style={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
        className={cn(
          'hidden lg:flex flex-col flex-shrink-0 overflow-hidden',
          'border-r border-[var(--shell-sidebar-border)] bg-card/72',
          'transition-[width] duration-300 ease-in-out',
          'h-screen sticky top-0'
        )}
        aria-label={t('layout.desktopSidebar')}
        aria-hidden={!sidebarOpen || undefined}
        {...(!sidebarOpen ? { inert: true } : {})}
      >
        <div style={{ width: SIDEBAR_WIDTH }} className="flex h-full flex-col overflow-hidden">
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </div>
      </aside>

      {/* Right panel: header + main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <ShellHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto h-full min-w-0 touch-pan-y">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Mobile drawer */}
      <Drawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title={t('layout.navMenu')}
        width="max-w-xs"
        zIndex={90}
        side="left"
      >
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </div>
  );
};
