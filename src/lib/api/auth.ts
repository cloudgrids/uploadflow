import { request } from './client';

/**
 * The authentication endpoints, as plain calls.
 *
 * Deliberately stateless: nothing here reads or writes stored credentials. `session.ts` owns that,
 * and keeping the two apart is what stops a refresh cycle from importing itself.
 */

/** What a successful sign-in returns. The access token is short-lived; the refresh token rotates. */
export interface AuthTokens {
  userId: string;
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
  roles: string[];
  emailVerified: boolean;
}

export interface AccountProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  globalRole: string;
  locale: string;
  timezone: string | null;
}

interface Accepted {
  accepted: boolean;
}

export function login(input: { email: string; password: string }, signal?: AbortSignal): Promise<AuthTokens> {
  return request<AuthTokens>('/auth/login', { method: 'POST', body: input, signal });
}

export function signup(input: { email: string; password: string; fullName: string }, signal?: AbortSignal): Promise<AuthTokens> {
  return request<AuthTokens>('/auth/signup', { method: 'POST', body: input, signal });
}

/**
 * Asks for a sign-in link. Always accepted, whether or not the address is known — a distinguishable
 * answer here would report whether somebody has an account.
 */
export function requestMagicLink(email: string, signal?: AbortSignal): Promise<Accepted> {
  return request<Accepted>('/auth/magic-link', { method: 'POST', body: { email }, signal });
}

/** Exchanges the single-use token from an emailed link, or from a completed provider sign-in. */
export function consumeMagicLink(token: string, signal?: AbortSignal): Promise<AuthTokens> {
  return request<AuthTokens>('/auth/magic-link/consume', { method: 'POST', body: { token }, signal });
}

/** Exchanges a refresh token for a new pair. The presented token is retired by the exchange. */
export function refreshTokens(refreshToken: string, signal?: AbortSignal): Promise<AuthTokens> {
  return request<AuthTokens>('/auth/refresh', { method: 'POST', body: { refreshToken }, signal });
}

export function logout(refreshToken: string, signal?: AbortSignal): Promise<Accepted> {
  return request<Accepted>('/auth/logout', { method: 'POST', body: { refreshToken }, signal });
}

export function requestPasswordReset(email: string, signal?: AbortSignal): Promise<Accepted> {
  return request<Accepted>('/auth/forgot-password', { method: 'POST', body: { email }, signal });
}

export function resetPassword(input: { token: string; password: string }, signal?: AbortSignal): Promise<Accepted> {
  return request<Accepted>('/auth/reset-password', { method: 'POST', body: input, signal });
}

/** The signed-in account. Needs a token, so call it through `session.ts` rather than directly. */
export function accountStatus(token: string, signal?: AbortSignal): Promise<AccountProfile> {
  return request<AccountProfile>('/auth/status', { token, signal });
}

/** Which providers this deployment has keys for, so a sign-in page only offers what will work. */
export function oauthProviders(signal?: AbortSignal): Promise<{ providers: string[] }> {
  return request<{ providers: string[] }>('/auth/oauth', { signal });
}
