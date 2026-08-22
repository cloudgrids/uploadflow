import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SitePage } from '../../components/site/SiteChrome';
import { requireSignedIn } from '../../lib/server/gate';

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

/**
 * Nothing here is worth rendering for somebody who is not signed in.
 *
 * Until now they got the whole shell, a hydration, and then a prompt — a page built and shipped so
 * that it could say it was not for them. The hint cookie lets that be decided before any of it
 * happens.
 *
 * **This is where the group becomes dynamic.** Reading a cookie opts these routes out of static
 * rendering, which is exactly why the gate lives here and not in the root layout: one `cookies()`
 * call up there would take every marketing page with it.
 *
 * **The chrome is the site's, not this group's.** It had its own for a while — a shorter nav, no
 * call to action — on the reasoning that somebody signed in has already bought the thing the
 * marketing header sells. That reasoning was about the page and the reader is about the person: the
 * same signed-in reader moving between here and the plans page got a different header at each end,
 * with pages appearing and disappearing from the nav. What should vary with who is looking already
 * does, inside the header, in `HeaderAuth`.
 */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  await requireSignedIn('/account');
  // A column, for the same reason the sign-in pages have one: what is on this page is a plan, a
  // date and two buttons, and a card the width of a desktop holding them left most of itself empty
  // while the reader's eye travelled the whole way anyway. Wider than the sign-in column because
  // this page has more than a form on it, and because the operator door sits under it.
  return (
    <SitePage>
      <div className="uf-account">{children}</div>
    </SitePage>
  );
}
