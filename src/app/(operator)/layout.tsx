import type { ReactNode } from 'react';
import { requireSignedIn } from '../../lib/server/gate';

/**
 * The operator area, closed to anybody not signed in at all.
 *
 * **It stops there, and that is deliberate.** The gate knows only that somebody is signed in; it
 * does not know what they may do, because the hint carries no rank and a remembered rank is exactly
 * the thing that goes stale. Whether this account reaches the operator tools is asked of the
 * service on mount, and refused by the API on every call it makes — see `useAccess`.
 *
 * So: the server answers *is anybody there*, and the service answers *may they*. Neither is asked
 * the other's question, and the honest split is what stops a stale cookie becoming an entitlement.
 */
export default async function OperatorLayout({ children }: { children: ReactNode }) {
  await requireSignedIn('/admin');
  return children;
}
