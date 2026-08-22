'use client';

import { useEffect } from 'react';
import { useSession } from '../../lib/api';
import { SESSION_FLAG } from './sessionFlag';

/**
 * The one control that gets somebody to their account, in whichever state they are in.
 *
 * Signed out it offers sign-in; signed in it offers the account. One control rather than two,
 * because sign-in and sign-up side by side in the header compete with the call to action and with
 * each other — and `/sign-in` already links to `/sign-up` for anyone who needs it.
 *
 * **Both labels are in the markup and CSS chooses.** This used to render the signed-out label and
 * correct itself on hydration, which meant a signed-in reader watched it say "Sign in" and then
 * change its mind on every single page — every navigation here is a full load, so the flicker was
 * not once but constant. The label is now settled before the first paint by the script in the root
 * layout, from a cookie that says only whether somebody is signed in.
 *
 * **The address is `/account` either way**, which is what makes a label the only thing that has to
 * change. Signed out, that page's gate turns them around to sign in and sends them back to it
 * afterwards — so the link is right in both states rather than guessed in one.
 *
 * Sign-out is deliberately not here. It lives on `/account`, where the thing being ended is in view.
 */
export function HeaderAuth({ className }: { className: string }) {
  const session = useSession();

  // The cookie is a hint and can be stale — it outlives the tokens by design. Once the real session
  // is readable, it settles the flag for anything rendered afterwards. A DOM attribute rather than
  // state: nothing here re-renders on it, and it lives on <html>, outside React's tree.
  useEffect(() => {
    document.documentElement.toggleAttribute(SESSION_FLAG, Boolean(session));
  }, [session]);

  return (
    <a className={className} href="/account">
      <span data-auth="out">Sign in</span>
      <span data-auth="in">Account</span>
    </a>
  );
}
