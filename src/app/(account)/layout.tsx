import type { ReactNode } from 'react';
import { requireSignedIn } from '../../lib/server/gate';

/**
 * Nothing here is worth rendering for somebody who is not signed in.
 *
 * Until now they got the whole shell, a hydration, and then a prompt — a page built and shipped so
 * that it could say it was not for them. The hint cookie lets that be decided before any of it
 * happens.
 *
 * **This is where the group becomes dynamic.** Reading a cookie opts these routes out of static
 * rendering, which is why the gate lives here and not in the root layout: one `cookies()` call up
 * there would take the marketing pages with it.
 */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  await requireSignedIn('/account');
  return children;
}
