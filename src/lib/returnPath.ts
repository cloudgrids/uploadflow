/**
 * Where to send somebody once they have signed in.
 *
 * A gate that sends everybody to the same place after sign-in quietly loses what they asked for:
 * somebody who wanted the operator area and got the account page has been answered, but not helped.
 * So the gate carries the path they were going to, and this decides whether to believe it.
 *
 * **It is a value from the address bar, so it is not trusted.** An unchecked one is an open
 * redirect: `?next=https://elsewhere.example` would turn our own sign-in page into a convincing way
 * to bounce somebody somewhere else, wearing our domain on the way. Only a path on this site is
 * accepted, and anything else falls back rather than failing — a suspicious value is not worth an
 * error page.
 */

export const DEFAULT_RETURN_PATH = '/account';

export function safeReturnPath(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_RETURN_PATH;

  // Must be a path on this site. `//host` is the one that catches people out: the browser reads it
  // as protocol-relative and leaves the site, while it still looks like a path.
  if (!raw.startsWith('/') || raw.startsWith('//')) return DEFAULT_RETURN_PATH;

  // A backslash is treated as a slash by some parsers and not others, which is exactly the gap a
  // bypass lives in.
  if (raw.includes('\\')) return DEFAULT_RETURN_PATH;

  // Sending somebody back to sign in after they have signed in is a loop.
  if (raw === '/sign-in' || raw.startsWith('/sign-in?')) return DEFAULT_RETURN_PATH;

  return raw;
}
