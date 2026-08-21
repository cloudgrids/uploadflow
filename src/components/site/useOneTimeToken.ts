'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

const subscribeToNothing = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Reads a single-use token out of the query string, then removes it from the URL.
 *
 * These links arrive with the token as `?token=…`, which is weaker than carrying it in a fragment:
 * a query string is sent to the server, so it reaches server and proxy logs, it stays in browser
 * history, and it is part of the URL a `Referer` header could carry. The links are already in
 * people's inboxes and cannot be reissued in another shape, so the token is stripped from the
 * address bar on the first client render instead — before anything is done with it, and whether or
 * not the call that follows succeeds.
 *
 * `replaceState` rather than `pushState`: a history entry holding the token is the thing being
 * removed, so adding one would defeat it, and Back should leave the page rather than restore it.
 */
export function useOneTimeToken(): { token: string | null; hydrated: boolean } {
  // A lazy initialiser, so the value is captured before the effect below erases its source.
  const [token] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const found = new URLSearchParams(window.location.search).get('token');
    return found && found.length > 0 ? found : null;
  });

  // Whether a token is present is unknowable while rendering on the server. Resolving it this way
  // rather than with a mounted flag keeps it out of an effect, which is what this repo does
  // everywhere the answer only exists in the browser.
  const hydrated = useSyncExternalStore(subscribeToNothing, onClient, onServer);

  useEffect(() => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return { token, hydrated };
}
