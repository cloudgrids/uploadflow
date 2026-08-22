import type { Session } from './session';

/**
 * A cookie that says somebody is signed in, and nothing else.
 *
 * **It carries no credential and confers no authority.** The access and refresh tokens stay in
 * `localStorage`, where they have always been. This exists for one reason: a server component
 * cannot read `localStorage`, so without it the only way to discover that a visitor is signed out
 * is to render the page, ship it, hydrate, and then tell them — which is why an anonymous visitor
 * to a signed-in page currently sees a flash of a shell they were never going to be shown.
 *
 * **Why not simply put the session in the cookie**, as a service that sets its own cookie would.
 * Ours does not: it returns both tokens in a response body, so a cookie here would be written by
 * script and readable by script — no better than `localStorage` against anything running on this
 * origin — *and* transmitted to the origin on every single request, including for static assets,
 * where it can land in request logs. That is a strictly wider exposure for no gain. A hint costs
 * nothing if it leaks, because there is nothing in it to use.
 *
 * So: the server learns *whether* to render, and the service still decides *what* the account may
 * do. Neither answers the other's question.
 */

export const SESSION_HINT_COOKIE = 'uf.hint';

/**
 * How long a hint is believed.
 *
 * Deliberately **not** the access token's expiry. That is minutes away and refreshing it is
 * routine, so a hint keyed to it would expire while somebody was still perfectly signed in and
 * bounce them to a sign-in page they did not need. Every write refreshes the window — and a token
 * refresh is a write — so this is really "a session was alive within the last 30 days".
 */
const HINT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface SessionHint {
  /** Which account, so a stale hint for a different one can be spotted. */
  u: string;
  /** Epoch milliseconds after which this hint means nothing. */
  e: number;
}

function isHint(value: unknown): value is SessionHint {
  if (value === null || typeof value !== 'object') return false;
  const hint = value as Record<string, unknown>;
  return typeof hint.u === 'string' && hint.u.length > 0 && typeof hint.e === 'number';
}

/**
 * Reads a hint from a raw cookie value, wherever that came from.
 *
 * Takes the string rather than reaching for a cookie store, so the same parsing runs on the server
 * — where the value arrives from `next/headers` — and in the browser. An expired or unreadable
 * hint is no hint; a corrupt one must never be the reason somebody is treated as signed in.
 */
export function decodeSessionHint(raw: string | undefined, now: number = Date.now()): SessionHint | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (!isHint(parsed) || parsed.e <= now) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Writes or clears the hint in the browser.
 *
 * `SameSite=Lax` because nothing cross-site needs it, and `Secure` only where the page is already
 * secure — the development server is plain HTTP and a `Secure` cookie would silently never be set
 * there, which looks exactly like the gate being broken.
 */
export function writeSessionHint(session: Session | null): void {
  if (typeof document === 'undefined') return;

  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';

  if (!session) {
    document.cookie = `${SESSION_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    return;
  }

  const hint: SessionHint = { u: session.userId, e: Date.now() + HINT_TTL_MS };
  const value = encodeURIComponent(JSON.stringify(hint));
  document.cookie = `${SESSION_HINT_COOKIE}=${value}; Path=/; Max-Age=${Math.floor(HINT_TTL_MS / 1000)}; SameSite=Lax${secure}`;
}

/** The hint this browser is currently sending, for the client half of a gate. */
export function readSessionHintFromDocument(): SessionHint | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((entry) => entry.startsWith(`${SESSION_HINT_COOKIE}=`));
  return decodeSessionHint(match?.slice(SESSION_HINT_COOKIE.length + 1));
}
