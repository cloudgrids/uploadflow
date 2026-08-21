/**
 * The password rule the service enforces, restated once for the whole site.
 *
 * Duplicating the service's rule is deliberate. It lets a form say what is missing while somebody
 * is still typing, and — because the service answers a weak password and several other faults with
 * the same status — a password that passes here narrows what a rejection can mean.
 *
 * The character set is closed: symbols outside it are rejected, not merely uncounted. That is the
 * part people trip over, so it is stated rather than implied.
 *
 * Kept in one module because two forms now need it, and a copy that drifts would tell one of them
 * the wrong thing.
 */
export const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ALLOWED_SYMBOLS = '@ $ ! % * ? &';

/** A short, specific note on what a password is still missing, or `null` once it passes. */
export function describePassword(value: string): string | null {
  if (value.length === 0) return null;
  if (value.length < 8) return 'At least 8 characters.';
  if (!/[a-z]/.test(value)) return 'Add a lowercase letter.';
  if (!/[A-Z]/.test(value)) return 'Add an uppercase letter.';
  if (!/\d/.test(value)) return 'Add a number.';
  if (!/[@$!%*?&]/.test(value)) return `Add one of ${ALLOWED_SYMBOLS}.`;
  if (!STRONG_PASSWORD.test(value)) return `Only letters, numbers and ${ALLOWED_SYMBOLS} can be used.`;
  return null;
}

/** One line describing the whole rule, for a form to show before anything is typed. */
export const PASSWORD_HINT = `At least 8 characters, with an uppercase letter, a lowercase letter, a number, and one of ${ALLOWED_SYMBOLS}.`;
