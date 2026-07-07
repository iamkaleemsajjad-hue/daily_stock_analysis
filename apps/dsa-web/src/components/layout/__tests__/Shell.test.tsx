import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { Shell } from '../Shell';

const mockLogout = vi.fn().mockResolvedValue(undefined);

vi.mock('../../../contexts/UiLanguageContext', () => ({
  useUiLanguage: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    authEnabled: true,
    logout: mockLogout,
  }),
}));

vi.mock('../../../stores/agentChatStore', () => ({
  useAgentChatStore: (selector: (state: { completionBadge: boolean }) => unknown) =>
    selector({ completionBadge: true }),
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Shell', () => {
  it('renders navigation, theme toggle and completion badge', () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <ThemeProvider>
          <Shell>
            <div>page content</div>
          </Shell>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByRole('button', { name: /theme\./i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'layout.nav.chat' })).toBeInTheDocument();
    expect(screen.getByTestId('chat-completion-badge')).toBeInTheDocument();
    const logoutButton = screen.getByRole('button', { name: 'layout.logout' });
    expect(logoutButton).toBeInTheDocument();
  });

  it('collapses and expands the sidebar, making it inert when collapsed', async () => {
    // We need to render with useUiLanguage mock to ensure aria-labels match our expectations
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <ThemeProvider>
          <Shell>
            <div>page content</div>
          </Shell>
        </ThemeProvider>
      </MemoryRouter>
    );

    // Initial state: Sidebar should be open on large screens (but testing environment might default differently based on viewport)
    // We can find the toggle button and click it to toggle state
    const toggleButtons = screen.getAllByRole('button', { name: /(layout\.collapseSidebar|layout\.expandSidebar)/i });
    const desktopToggleButton = toggleButtons[0]; // First one is desktop

    // Let's assume it starts open based on default state in Shell.tsx (useState(true))
    expect(desktopToggleButton).toHaveAttribute('aria-label', expect.stringContaining('collapse'));
    
    // Find the sidebar container. We can identify it by aria-label="layout.desktopSidebar"
    const sidebar = screen.getByLabelText(/layout\.desktopSidebar/i);
    expect(sidebar).not.toHaveAttribute('inert');
    expect(sidebar).not.toHaveAttribute('aria-hidden');

    // Click to collapse
    fireEvent.click(desktopToggleButton);

    // Now it should be collapsed
    expect(desktopToggleButton).toHaveAttribute('aria-label', expect.stringContaining('expand'));
    expect(sidebar).toHaveAttribute('inert');
    expect(sidebar).toHaveAttribute('aria-hidden', 'true');

    // Click again to expand
    fireEvent.click(desktopToggleButton);

    // Now it should be expanded again
    expect(desktopToggleButton).toHaveAttribute('aria-label', expect.stringContaining('collapse'));
    expect(sidebar).not.toHaveAttribute('inert');
  });

  it('shows a confirmation dialog before logout', async () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <ThemeProvider>
          <Shell>
            <div>page content</div>
          </Shell>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'layout.logout' }));

    expect(await screen.findByRole('heading', { name: 'layout.logoutTitle' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'layout.logoutConfirm' }));
    expect(mockLogout).toHaveBeenCalled();
  });
});
