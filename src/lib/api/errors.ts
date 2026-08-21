/**
 * One failure type for every call, and one place that decides what a failure means.
 *
 * Callers branch on `outcome`, never on the status and never on the message. The API states an
 * outcome alongside every error and the mapping below mirrors it, so a response that arrives
 * without one — or a request that never arrives at all — still lands in the same five cases.
 *
 * Message text is for people and may change at any time; `code` is the stable machine-readable
 * half. Switching on wording breaks the first time somebody improves it.
 */

/** What a failed call means, as opposed to what went wrong. */
export type FailureOutcome =
  /** The service could not answer — transport failure or a 5xx. Retrying later may work. */
  | 'connectivity'
  /** Credentials are missing, expired or invalid. */
  | 'auth'
  /** Authenticated, but this account may not do it. */
  | 'plan'
  /** Rate limited. `retryAfterSeconds` carries the wait when the response stated one. */
  | 'throttled'
  /** Malformed, or asking for something that is not there. Retrying unchanged will not help. */
  | 'request';

/** The error envelope the API returns. Every field is optional here; a proxy or a crash can eat it. */
interface ErrorEnvelope {
  statusCode?: number;
  code?: string;
  outcome?: string;
  message?: string | string[];
  path?: string;
  timestamp?: string;
}

const OUTCOMES: readonly FailureOutcome[] = ['connectivity', 'auth', 'plan', 'throttled', 'request'];

/**
 * The outcome a status implies.
 *
 * Kept as one function so the mapping is auditable in a single place. `0` is reserved for a request
 * that produced no response at all, which is a connectivity failure by definition.
 */
export function outcomeForStatus(status: number): FailureOutcome {
  if (status === 0 || status >= 500) return 'connectivity';
  if (status === 429) return 'throttled';
  if (status === 401) return 'auth';
  if (status === 403) return 'plan';
  return 'request';
}

function isFailureOutcome(value: unknown): value is FailureOutcome {
  return typeof value === 'string' && (OUTCOMES as readonly string[]).includes(value);
}

/** Collapses the envelope's `message`, which is a string for most errors and a list for validation. */
function readMessage(envelope: ErrorEnvelope, fallback: string): string {
  const { message } = envelope;
  if (Array.isArray(message)) return message.filter((entry) => typeof entry === 'string').join('. ') || fallback;
  return typeof message === 'string' && message.length > 0 ? message : fallback;
}

export class ApiError extends Error {
  /** HTTP status, or `0` when the request never produced a response. */
  readonly status: number;
  /** Stable machine-readable code from the envelope, or a derived one when it is absent. */
  readonly code: string;
  readonly outcome: FailureOutcome;
  /** Seconds to wait, from `Retry-After`, when the service stated one. */
  readonly retryAfterSeconds: number | null;

  constructor(init: { status: number; code: string; outcome: FailureOutcome; message: string; retryAfterSeconds?: number | null }) {
    super(init.message);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = init.code;
    this.outcome = init.outcome;
    this.retryAfterSeconds = init.retryAfterSeconds ?? null;
  }

  /** The request never reached the service, or the answer never came back. */
  static transport(cause: unknown): ApiError {
    return new ApiError({
      status: 0,
      code: 'NETWORK_UNAVAILABLE',
      outcome: 'connectivity',
      message: cause instanceof Error && cause.name === 'AbortError' ? 'The request was cancelled.' : 'Could not reach the service.'
    });
  }

  /**
   * Builds from a real response.
   *
   * The stated outcome wins when it is one we recognise, so a new status handled server-side does
   * not need a matching release here. An unrecognised or missing one falls back to the status.
   */
  static fromResponse(status: number, envelope: ErrorEnvelope, retryAfterSeconds: number | null): ApiError {
    const derived = outcomeForStatus(status);
    return new ApiError({
      status,
      code: typeof envelope.code === 'string' && envelope.code.length > 0 ? envelope.code : `HTTP_${status}`,
      outcome: isFailureOutcome(envelope.outcome) ? envelope.outcome : derived,
      message: readMessage(envelope, `The request failed (${status}).`),
      retryAfterSeconds
    });
  }
}

/** Narrowing helper, so callers do not have to import the class to check. */
export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
