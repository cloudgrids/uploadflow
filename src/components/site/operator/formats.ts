/** A date as the reader's own locale writes it, or an em dash when there is not one. */
export function onOrDash(iso: string | null | undefined): string {
  if (!iso) return '—';
  const at = new Date(iso);
  return Number.isNaN(at.getTime()) ? '—' : at.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * A service value as this design system writes words.
 *
 * **Nothing in the `uf-` system is uppercase**, and nothing re-cases anything at render time, so a
 * string arrives on the page exactly as it was written. The service sends plans and statuses
 * lowercase (`past_due`) and phases and ranks upper (`LIVE`, `SUPER_ADMIN`), and this used to only
 * capitalise the first letter — which left the shouted ones shouting, in a console that had just
 * become the only place on the site with capitals in it.
 *
 * Lower first, then one capital. The underscore is a word break, not a character.
 */
export function titleCase(value: string): string {
  const words = value.toLowerCase().replace(/_/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
