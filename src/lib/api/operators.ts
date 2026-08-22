import { authedRequest } from './session';
import type { ApiPlan } from './subscriptions';
import type { GlobalRole } from './roles';

/**
 * The operator listings.
 *
 * Every one of these is refused by the API unless the account calling it holds the rank, and that
 * refusal — not this file, and not the screen that renders it — is what keeps them closed. The rank
 * each needs is stated here so the site can decide what to *draw*, and for no other reason.
 */

/** Every listing answers in this shape. `total` counts rows matching the filter, before paging. */
export interface OperatorPage<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

/** Shared by every listing. The service caps `limit`, so asking for more returns a refusal. */
export interface OperatorQuery {
  offset?: number;
  limit?: number;
  /** A substring match on the row's identifying column — an email, not a general text search. */
  q?: string;
}

export const OPERATOR_PAGE_SIZE = 30;

export interface OperatorAccount {
  id: string;
  email: string;
  displayName: string | null;
  globalRole: GlobalRole;
  emailVerified: boolean;
  createdAt: string;
  /** Set when the account has been closed. Closed accounts are listed, not hidden. */
  deletedAt: string | null;
}

export interface OperatorSubscription {
  id: string;
  userId: string;
  plan?: ApiPlan;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null;
  canceledAt: string | null;
}

function search(query: OperatorQuery, extra: Record<string, string | undefined> = {}): string {
  const params = new URLSearchParams();
  params.set('offset', String(query.offset ?? 0));
  params.set('limit', String(query.limit ?? OPERATOR_PAGE_SIZE));
  // An empty q is not the same as no q: the service treats it as a filter matching everything, and
  // sending one turns a plain listing into a scan for no reason.
  if (query.q?.trim()) params.set('q', query.q.trim());
  for (const [key, value] of Object.entries(extra)) if (value) params.set(key, value);
  return params.toString();
}

/** Accounts, newest first. Support and up. */
export function listAccounts(
  query: OperatorQuery & { role?: GlobalRole } = {},
  signal?: AbortSignal
): Promise<OperatorPage<OperatorAccount>> {
  return authedRequest<OperatorPage<OperatorAccount>>(`/admin/users?${search(query, { role: query.role })}`, { signal });
}

/** Subscriptions with their plan. Admin and up — this is the line support does not cross. */
export function listSubscriptions(
  query: OperatorQuery & { status?: string } = {},
  signal?: AbortSignal
): Promise<OperatorPage<OperatorSubscription>> {
  return authedRequest<OperatorPage<OperatorSubscription>>(`/admin/subscriptions?${search(query, { status: query.status })}`, {
    signal
  });
}
