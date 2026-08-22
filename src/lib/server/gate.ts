import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeSessionHint, SESSION_HINT_COOKIE, type SessionHint } from '../api/sessionHint';

/**
 * The server half of the gate.
 *
 * **Kept in its own module because of what importing it costs.** `cookies()` opts the segment that
 * calls it out of static rendering, so the rule is that only a group layout that is meant to be
 * dynamic may import from here — never the root layout, and never anything a marketing page pulls
 * in. A stray import is not a type error; it is a route that silently stops being prerendered.
 *
 * **What this decides, and what it does not.** It answers *is anybody signed in* and nothing else.
 * It cannot answer *may they do this*, because the only thing it has is a hint that carries no
 * claim about rank — deliberately, since a rank is exactly the thing that goes stale. That question
 * stays with the service, asked on mount and refused by the API on every call.
 */

/** Whether this request carries a live session hint. */
export async function sessionHint(): Promise<SessionHint | null> {
  const store = await cookies();
  return decodeSessionHint(store.get(SESSION_HINT_COOKIE)?.value);
}

/**
 * Sends somebody to sign in and back again.
 *
 * The path is carried as `next` so the trip is not a dead end — landing on the account page after
 * signing in from `/admin` would be a small betrayal of what they asked for.
 */
export function toSignIn(pathname: string): never {
  redirect(`/sign-in?next=${encodeURIComponent(pathname)}`);
}

/**
 * Renders only for a request that looks signed in.
 *
 * "Looks" is the honest word: a hint can be stale, and a stale one buys nothing but a rendered page
 * whose every call the API refuses. What it cannot do is let somebody in, because it grants
 * nothing — so the failure mode is a wasted render rather than an exposure.
 */
export async function requireSignedIn(pathname: string): Promise<SessionHint> {
  const hint = await sessionHint();
  if (!hint) toSignIn(pathname);
  return hint;
}
