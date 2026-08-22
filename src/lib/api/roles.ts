/**
 * The service's role ladder, restated.
 *
 * **This is a copy of a vocabulary the service owns, and the copy has no link to the original.**
 * Nothing here fails if the two drift; the site simply starts believing something the service does
 * not. So the names and the order are the service's, spelled exactly as it spells them, and a
 * change there is a change here by hand.
 *
 * The site never decides anything with this. Every operator call is refused by the API for an
 * account that may not make it, and that refusal is the control — what the ladder decides is only
 * which affordances are worth drawing.
 */

/** In rank order, lowest first. */
export const GLOBAL_ROLES = ['USER', 'SUPPORT', 'ADMIN', 'SUPER_ADMIN'] as const;

export type GlobalRole = (typeof GLOBAL_ROLES)[number];

/**
 * Whether a role reaches the bar another one sets.
 *
 * The ladder is why a screen names the *lowest* role that may see it: anything above clears it
 * without being listed, so adding a rank never silently locks out the ranks above it.
 *
 * **An unrecognised role clears nothing.** A role the service adds later arrives here as a string
 * this file has never heard of, and the only safe reading of one is that it does not qualify —
 * guessing the other way would hand a new role every screen the site has.
 */
export function roleAtLeast(held: string | null | undefined, required: GlobalRole): boolean {
  const rank = held ? GLOBAL_ROLES.indexOf(held as GlobalRole) : -1;
  return rank >= 0 && rank >= GLOBAL_ROLES.indexOf(required);
}

/** Narrows a role the service sent to one this build knows about. */
export function asGlobalRole(value: string | null | undefined): GlobalRole | null {
  return value && (GLOBAL_ROLES as readonly string[]).includes(value) ? (value as GlobalRole) : null;
}

/** The lowest role that has anything to do in the operator area. */
export const OPERATOR_ROLE: GlobalRole = 'SUPPORT';
