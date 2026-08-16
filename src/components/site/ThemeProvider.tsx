'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

/**
 * shadcn/ui's theme provider — a thin pass-through over next-themes.
 *
 * Mounted in the root layout with `attribute="class"`, which is why the palette
 * in globals.css is `:root` (light) overridden by `.dark`, rather than a
 * `prefers-color-scheme` media query: an explicit choice has to beat the OS.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
