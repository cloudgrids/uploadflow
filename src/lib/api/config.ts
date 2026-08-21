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

/** Absolute URL for a path stated relative to the API prefix, e.g. `apiUrl('/waitlist')`. */
export function apiUrl(path: string): string {
  return `${apiBaseUrl}${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
}
