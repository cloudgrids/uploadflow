'use client';

import { useEffect, useState } from 'react';
import type { AccountProfile } from './auth';
import { myProfile } from './profile';
import { asGlobalRole, roleAtLeast, type GlobalRole } from './roles';
import { useSession } from './useSession';

/**
 * Whether the account may see a screen, as far as the site can tell.
 *
 * **As far as the site can tell** is the whole of it. This decides what to draw and nothing else —
 * every call the drawn screen makes is refused by the API on its own account, so a person who
 * reaches past the affordance finds the same closed door.
 */
export type Access =
  /** Still asking. No claim in either direction yet, so draw neither. */
  | { state: 'deciding' }
  | { state: 'anonymous' }
  /** Signed in, and the service says this account does not hold the rank. */
  | { state: 'refused'; role: GlobalRole | null }
  /**
   * The question could not be put. Distinct from a refusal, and must never be shown as one.
   *
   * The failure is handed on rather than turned into a sentence here: wording belongs to the
   * surface that shows it, and `lib/api` has no business reaching up into the component layer to
   * borrow one.
   */
  | { state: 'unavailable'; cause: unknown; retry: () => void }
  | { state: 'granted'; profile: AccountProfile; role: GlobalRole };

/** What a resolved answer was an answer *to*, so a stale one is never shown beside a new question. */
interface Resolved {
  key: string;
  access: Access;
}

/**
 * Asks the service what this account is, and compares it against the bar a screen sets.
 *
 * **The role is asked for, never remembered.** A session in storage carries roles from the moment
 * it was minted, and a role that was true at sign-in is exactly the thing that can stop being true
 * — a demotion, a mistake being corrected. Anything the browser is holding is a claim the browser
 * makes about itself, so the question goes to the service instead.
 *
 * Failing to ask is not the same as being told no, and the two states stay apart for the same
 * reason the client separates a request that never arrived from one that came back refused. Both
 * withhold the screen; only one of them is about the person.
 *
 * Everything except the answer itself is derived rather than stored. Storing "still deciding" would
 * mean setting it from inside the effect, which is the cascading render this repo's lint rule
 * exists to prevent — so the hook reports deciding whenever the answer it holds was to a different
 * question, which is the same fact without the extra render.
 */
export function useAccess(required: GlobalRole): Access {
  const session = useSession();
  const [resolved, setResolved] = useState<Resolved | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Keyed on the account rather than on the token: a refresh mints a new token for the same person
  // and must not look like a new question, or every renewal would blank the screen.
  //
  // The attempt count is in the key because everything here hangs off it. Without it a failed check
  // is permanent — the same account asking the same question is the same key, so nothing re-runs
  // and a moment of bad network locks the area shut until the page is reloaded.
  const key = session ? `${session.userId}:${required}:${attempt}` : '';

  useEffect(() => {
    if (!key) return;

    const abort = new AbortController();

    // No token is passed: the call goes through the session, which refreshes an expired one rather
    // than reporting a signed-in account as signed out.
    myProfile(abort.signal)
      .then((profile) => {
        if (abort.signal.aborted) return;
        const role = asGlobalRole(profile.globalRole);
        setResolved({
          key,
          access: roleAtLeast(profile.globalRole, required) && role ? { state: 'granted', profile, role } : { state: 'refused', role }
        });
      })
      .catch((cause: unknown) => {
        if (!abort.signal.aborted) {
          setResolved({ key, access: { state: 'unavailable', cause, retry: () => setAttempt((count) => count + 1) } });
        }
      });

    return () => abort.abort();
  }, [key, required]);

  if (!session) return { state: 'anonymous' };
  return resolved?.key === key ? resolved.access : { state: 'deciding' };
}
