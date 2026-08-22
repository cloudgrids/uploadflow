/**
 * What this slot is on a route it has no page for.
 *
 * Without it, a hard navigation to a sub-route renders a 404 for the whole area rather than for the
 * one slot that does not match.
 */
export default function Default() {
  return null;
}
