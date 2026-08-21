import { isApiError } from '../../lib/api';

/**
 * Turns a failed call into something worth showing a person.
 *
 * The service's own message is deliberately not surfaced. It is written for a developer and can be
 * as unhelpful as "Bad Request Exception", which tells a visitor nothing about the field they got
 * wrong. Branching on `outcome` gives an answer that is at least true and actionable.
 */
export function messageForFailure(cause: unknown, fallback: string): string {
  if (!isApiError(cause)) return fallback;

  switch (cause.outcome) {
    case 'connectivity':
      return 'Could not reach the service. Check your connection and try again.';
    case 'throttled':
      return `Too many attempts. Try again ${humanDelay(cause.retryAfterSeconds)}.`;
    case 'auth':
      return 'Sign in to continue.';
    case 'request':
    case 'plan':
    default:
      return fallback;
  }
}

/** `Retry-After` is seconds; an hour of them is not a useful thing to print. */
function humanDelay(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return 'in a moment';
  if (seconds < 90) return `in ${Math.max(1, Math.round(seconds))} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 90) return `in ${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? 'in about an hour' : `in about ${hours} hours`;
}
