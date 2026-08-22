/** A date as the reader's own locale writes it, or an em dash when there is not one. */
export function onOrDash(iso: string | null | undefined): string {
  if (!iso) return '—';
  const at = new Date(iso);
  return Number.isNaN(at.getTime()) ? '—' : at.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/** The service sends plans and statuses lowercase; a table reads better with them capitalised. */
export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
}
