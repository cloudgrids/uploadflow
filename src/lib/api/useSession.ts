'use client';

import { useSyncExternalStore } from 'react';
import { getServerSession, getSession, subscribeToSession, type Session } from './session';

/**
 * The current session, or `null`.
 *
 * `useSyncExternalStore` rather than an effect: whether somebody is signed in is unknowable during
 * the server render, and this repo resolves that case this way everywhere it comes up — an effect
 * that sets state on mount trips the `react-hooks/set-state-in-effect` rule.
 *
 * The server snapshot is always `null`, so the first client render matches the served HTML and the
 * signed-in view appears on hydration rather than causing a mismatch.
 */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribeToSession, getSession, getServerSession);
}

export function useIsSignedIn(): boolean {
  return useSession() !== null;
}
