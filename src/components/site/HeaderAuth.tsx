'use client';

import { useSession } from '../../lib/api';

/**
 * The one control that gets somebody to their account, in whichever state they are in.
 *
 * Signed out it offers sign-in; signed in it offers the account page. One control rather than two,
 * because sign-in and sign-up side by side in the header compete with the call to action and with
 * each other — and `/sign-in` already links to `/sign-up` for anyone who needs it.
 *
 * Whether a session exists is unknowable during a server render, so this renders the signed-out
 * label first and corrects itself on hydration. That is the right way round: signed out is both the
 * commoner case and the harmless one to show briefly, whereas an "Account" link served to somebody
 * with no session would lead them somewhere that turns them away.
 *
 * Sign-out is deliberately not here. It lives on `/account`, where the thing being ended is in view.
 */
export function HeaderAuth({ className }: { className: string }) {
  const session = useSession();

  return session ? (
    <a className={className} href="/account">
      Account
    </a>
  ) : (
    <a className={className} href="/sign-in">
      Sign in
    </a>
  );
}
