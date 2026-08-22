import { request, type RequestOptions } from './client';
import { ApiError, isApiError } from './errors';
import { logout, refreshTokens, type AuthTokens } from './auth';
import { writeSessionHint } from './sessionHint';

/**
 * Who is signed in, and the one way to make a call as them.
 *
 * The service returns both tokens in the response body and takes the refresh token back in a
 * request body — there is no cookie involved — so the site has to hold them itself. They go in
 * `localStorage`: a page reload must not sign somebody out, and `sessionStorage` would do exactly
 * that on every new tab.
 *
 * The cost is honest and worth stating: anything that can run script on this origin can read them.
 * That is the standard trade for a browser client the service hands tokens to, and it is mitigated
 * by the access token being short-lived and the refresh token rotating on every exchange — a stolen
 * refresh token stops working as soon as the real client uses its own. It is not eliminated.
 */

const STORAGE_KEY = 'uf.session';

export interface Session {
  userId: string;
  accessToken: string;
  refreshToken: string;
  /** Epoch milliseconds. Derived once from `expiresIn` so a stored session survives a reload. */
  expiresAt: number;
  roles: string[];
  emailVerified: boolean;
}

/** Refresh this far before actual expiry, so a call does not race the clock. */
const EXPIRY_MARGIN_MS = 30_000;

let current: Session | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function isSession(value: unknown): value is Session {
  if (value === null || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return typeof s.userId === 'string' && typeof s.accessToken === 'string' && typeof s.refreshToken === 'string' && typeof s.expiresAt === 'number';
}

function read(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSession(parsed) ? parsed : null;
  } catch {
    // Storage can be unavailable or the value corrupt. Signed out is the safe reading of both.
    return null;
  }
}

function announce(): void {
  for (const listener of listeners) listener();
}

function write(session: Session | null): void {
  current = session;
  loaded = true;
  if (typeof window !== 'undefined') {
    try {
      if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // A full or blocked store must not break sign-in; the session simply will not outlive the tab.
    }
    // The hint the server reads, written here and nowhere else so the two cannot drift. It holds no
    // token — see `sessionHint.ts` — and a token refresh comes through this function too, which is
    // what keeps the hint's window sliding while somebody stays signed in.
    writeSessionHint(session);
  }
  announce();
}

/** The current session, loading it from storage on first read. */
export function getSession(): Session | null {
  if (!loaded) {
    current = read();
    loaded = true;
    // Anybody already signed in when this shipped has a stored session and no hint, and would
    // otherwise be redirected away from their own account until they signed in again. Writing it
    // on the first read is the migration; it is idempotent and costs one cookie assignment.
    if (current) writeSessionHint(current);
  }
  return current;
}

export function sessionFromTokens(tokens: AuthTokens): Session {
  return {
    userId: tokens.userId,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: Date.now() + tokens.expiresIn * 1000,
    roles: tokens.roles ?? [],
    emailVerified: Boolean(tokens.emailVerified)
  };
}

/** Records a completed sign-in. */
export function startSession(tokens: AuthTokens): Session {
  const session = sessionFromTokens(tokens);
  write(session);
  return session;
}

/** Forgets the session locally. Telling the service is `signOut` in `account.ts`. */
export function clearSession(): void {
  write(null);
}

/**
 * Subscribes to sign-in and sign-out, including from another tab.
 *
 * Shaped for `useSyncExternalStore`, which is how this repo resolves anything unknowable during a
 * server render — a `mounted` effect would trip the `react-hooks/set-state-in-effect` rule.
 */
export function subscribeToSession(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY) return;
    current = read();
    loaded = true;
    announce();
  };

  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}

/** The session is unknowable while rendering on the server; it lives in the browser's storage. */
export function getServerSession(): null {
  return null;
}

/**
 * In-flight refresh, shared.
 *
 * Two calls expiring together would otherwise both exchange the same refresh token. The exchange
 * retires the token it is given, so the second would be rejected and sign a working user out.
 */
let refreshing: Promise<Session> | null = null;

async function refreshSession(session: Session): Promise<Session> {
  refreshing ??= refreshTokens(session.refreshToken)
    .then((tokens) => startSession(tokens))
    .catch((cause: unknown) => {
      // Only give up the session when the service actually rejected the token. A refresh that
      // failed because the network is down must not sign anybody out.
      if (isApiError(cause) && cause.outcome === 'auth') clearSession();
      throw cause;
    })
    .finally(() => {
      refreshing = null;
    });

  return await refreshing;
}

/**
 * Makes a call as the signed-in user, refreshing once if the token has expired.
 *
 * Throws an `auth` outcome when there is no session at all, so a caller can send somebody to sign
 * in without having to check first.
 */
export async function authedRequest<T>(path: string, options: Omit<RequestOptions, 'token'> = {}): Promise<T> {
  let session = getSession();
  if (!session) {
    throw new ApiError({ status: 401, code: 'UNAUTHENTICATED', outcome: 'auth', message: 'Sign in to continue.' });
  }

  if (Date.now() >= session.expiresAt - EXPIRY_MARGIN_MS) {
    session = await refreshSession(session);
  }

  try {
    return await request<T>(path, { ...options, token: session.accessToken });
  } catch (cause) {
    // The token was rejected despite looking current — refresh once, retry once, then give up.
    if (isApiError(cause) && cause.outcome === 'auth') {
      const renewed = await refreshSession(session);
      return await request<T>(path, { ...options, token: renewed.accessToken });
    }
    throw cause;
  }
}

/**
 * Signs out, telling the service so the refresh token is retired server-side.
 *
 * The local session is cleared either way. A sign-out that failed because the network was down
 * still has to leave this browser signed out, or the button does nothing when it matters most.
 */
export async function signOut(): Promise<void> {
  const session = getSession();
  clearSession();
  if (!session) return;
  try {
    await logout(session.refreshToken);
  } catch {
    // Already forgotten locally; the token expires on its own.
  }
}
