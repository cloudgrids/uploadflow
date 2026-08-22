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

  // Named before the outcome switch: this one must never be reported as a connectivity problem,
  // and the visitor should not be told to check a connection that is working.
  if (cause.code === 'API_URL_NOT_CONFIGURED') {
    return 'This site is not configured to reach its service. Nothing is wrong with your connection.';
  }

  // The other configuration fault, and the one that arrives from the service rather than from the
  // build. It derives to a `request` outcome, which is right about the only thing a caller acts on
  // — retrying unchanged will not help — but the fallback a caller supplies for that case is
  // written for a malformed request and usually ends "try again". Saying so here keeps every
  // caller honest without each of them having to know the code.
  if (isNotConfigured(cause)) {
    return 'That part of the service is not set up yet. Nothing is wrong on your side, and trying again will not change it.';
  }

  switch (cause.outcome) {
    case 'connectivity':
      // A failure that arrived is not a failure to arrive. Transport failures carry status 0; a
      // 5xx means the service answered, so the connection plainly works and telling somebody to
      // check it sends them to look at the one thing that is provably fine.
      return cause.status === 0
        ? 'Could not reach the service. Check your connection and try again.'
        : 'The service could not answer that just now. Nothing is wrong with your connection.';
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

/**
 * Whether the service says the thing being asked for has not been configured at its end.
 *
 * Exported so a caller with something more specific to say — the plan being bought, for one — can
 * say it, rather than re-testing the code string in a component and drifting from the sentence
 * above.
 */
export function isNotConfigured(cause: unknown): boolean {
  return isApiError(cause) && cause.code === 'NOT_CONFIGURED';
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
