import type { AccountProfile } from './auth';
import { authedRequest } from './session';

/**
 * The signed-in account as the service currently describes it.
 *
 * Separate from `accountStatus` in `auth.ts`, which takes a token and is the stateless form. This
 * one goes through the session, so it refreshes an expired token rather than reporting a signed-in
 * account as signed out.
 */
export function myProfile(signal?: AbortSignal): Promise<AccountProfile> {
  return authedRequest<AccountProfile>('/auth/status', { signal });
}
