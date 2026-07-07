import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { PremiumThemeToggle } from '../PremiumThemeToggle';
import { useUiLanguage } from '../../../contexts/UiLanguageContext';

vi.mock('../../../contexts/UiLanguageContext', () => ({
  useUiLanguage: vi.fn(),
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

describe('PremiumThemeToggle', () => {
  beforeEach(() => {
    (useUiLanguage as any).mockReturnValue({
      t: (key: string) => key,
    });
    // Reset localStorage for each test to ensure default state (system)
    window.localStorage.removeItem('vite-ui-theme');
  });

  it('cycles through System -> Light -> Dark themes', () => {
    render(
      <ThemeProvider>
        <PremiumThemeToggle />
      </ThemeProvider>
    );

    // Initial state is System
    const toggleButton = screen.getByRole('button', { name: 'theme.system' });
    expect(toggleButton).toBeInTheDocument();

    // Click -> Light
    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: 'theme.light' })).toBeInTheDocument();

    // Click -> Dark
    fireEvent.click(screen.getByRole('button', { name: 'theme.light' }));
    expect(screen.getByRole('button', { name: 'theme.dark' })).toBeInTheDocument();

    // Click -> System
    fireEvent.click(screen.getByRole('button', { name: 'theme.dark' }));
    expect(screen.getByRole('button', { name: 'theme.system' })).toBeInTheDocument();
  });
});
