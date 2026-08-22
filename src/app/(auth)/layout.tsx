import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthChrome } from '../../components/site/AuthChrome';

/**
 * None of these four pages is for a search engine, and the reason is the same for all of them:
 * each is either a form nobody arrives at from a search or a page reached by a single-use link.
 * Stating it once here means a fifth page cannot be added without it.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthChrome>{children}</AuthChrome>;
}
