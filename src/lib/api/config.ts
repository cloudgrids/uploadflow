/**
 * Where the API lives, resolved once.
 *
 * Every request built in `src/lib/api` goes through here, so pointing the site at a different
 * deployment is an environment change rather than an edit. Nothing else in the app should read the
 * variable or hold a URL of its own.
 *
 * `NEXT_PUBLIC_API_URL` is referenced literally on purpose. Next inlines `NEXT_PUBLIC_*` into the
 * browser bundle by static analysis, so reaching it through a computed key or a destructured
 * `process.env` yields `undefined` at runtime with no build error to warn you.
 */

const configured = process.env.NEXT_PUBLIC_API_URL?.trim();

/**
 * The local API, matching the port the service listens on in development.
 *
 * This is a development convenience and not a deployed address — there is no published hostname to
 * point at yet. Set `NEXT_PUBLIC_API_URL` for anything that is not a developer's own machine.
 */
const LOCAL_BASE_URL = 'http://localhost:8080';

/** Every route the site calls sits under this prefix. */
const API_PREFIX = '/api/v1';

/** True when a base URL was supplied, rather than falling back to localhost. */
export const isApiConfigured: boolean = Boolean(configured);

/** Origin only, no trailing slash. */
export const apiBaseUrl: string = (configured || LOCAL_BASE_URL).replace(/\/+$/, '');

/** Hosts where `localhost` is a sensible thing for the browser to call. */
function servedLocally(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.localhost');
}

/**
 * True when the fallback is in use somewhere it cannot possibly work.
 *
 * The fallback is right for a developer and catastrophic anywhere else: a visitor's browser calls
 * their own machine, fails to connect, and is told to check their internet. This is what lets the
 * client refuse instead — the one thing it must not do is present a missing build variable as a
 * problem with the visitor's connection.
 *
 * Answered in the browser only. During a server render there is no visitor whose machine could be
 * called, and the build-time check in `next.config.ts` is what covers the deployment itself.
 */
export function apiPointsAtTheVisitorsMachine(): boolean {
  if (isApiConfigured) return false;
  if (typeof window === 'undefined') return false;
  return !servedLocally(window.location.hostname);
}

/** Absolute URL for a path stated relative to the API prefix, e.g. `apiUrl('/waitlist')`. */
export function apiUrl(path: string): string {
  return `${apiBaseUrl}${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
}
