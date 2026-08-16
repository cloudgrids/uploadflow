'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const OPTIONS = [
  { value: 'system', label: 'Auto', glyph: '◐' },
  { value: 'light', label: 'Light', glyph: '☀' },
  { value: 'dark', label: 'Dark', glyph: '☾' }
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // The active theme is unknowable during SSR, so the pressed state can only be
  // rendered after hydration or server and client markup disagree. This is the
  // hydration check without a setState-in-effect: the server snapshot is false,
  // the client snapshot is true, and nothing ever changes after that.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className="uf-theme-toggle" role="group" aria-label="Colour theme">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          aria-pressed={mounted ? theme === option.value : undefined}
          title={option.label}
        >
          <span aria-hidden="true">{option.glyph}</span>
          <span className="uf-theme-toggle-label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
