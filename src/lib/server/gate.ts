import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeSessionHint, SESSION_HINT_COOKIE, type SessionHint } from '../api/sessionHint';
import { PATHNAME_HEADER } from '../../proxy';

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

/** The page being wrapped, from the header the proxy sets. */
export async function currentPath(fallback: string): Promise<string> {
  const store = await headers();
  return store.get(PATHNAME_HEADER) || fallback;
}

/**
 * Renders only for a request that looks signed in, and otherwise sends them to sign in and back.
 *
 * "Looks" is the honest word: a hint can be stale, and a stale one buys nothing but a rendered page
 * whose every call the API refuses anyway. What it cannot do is let somebody in, because it grants
 * nothing — so the failure mode is a wasted render rather than an exposure.
 *
 * The path they were going to travels as `next`, because landing on the account page after asking
 * for the operator area is an answer rather than help.
 */
export async function requireSignedIn(fallbackPath: string): Promise<SessionHint> {
  const hint = await sessionHint();
  if (hint) return hint;

  const from = await currentPath(fallbackPath);
  redirect(`/sign-in?next=${encodeURIComponent(from)}`);
}
