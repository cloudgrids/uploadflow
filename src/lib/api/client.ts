import { apiPointsAtTheVisitorsMachine, apiUrl } from './config';
import { ApiError } from './errors';

/**
 * The one place that builds a request and the one place that turns a failure into an `ApiError`.
 *
 * Call sites state a path and a body; they do not assemble URLs, set headers, read statuses or
 * parse error envelopes. Scattering that is how two call sites end up disagreeing about what a 403
 * means, and the disagreement only shows up in production.
 */

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  /** Serialised as JSON. Omit for a request with no body. */
  body?: unknown;
  /** Bearer token, for the routes that require one. */
  token?: string;
  signal?: AbortSignal;
}

/** Said once, not per request: a broken deployment should be obvious in the console, not a flood. */
let warned = false;
function warnOnce(): void {
  if (warned) return;
  warned = true;
  console.error(
    '[uploadflow] NEXT_PUBLIC_API_URL was not set when this site was built, so the API address ' +
      'fell back to http://localhost:8080 — which is this browser\'s own machine. The value is ' +
      'inlined at build time: set it and rebuild.'
  );
}

/** `Retry-After` in seconds. The header may also carry an HTTP date, which is converted here. */
function readRetryAfter(headers: Headers): number | null {
  const raw = headers.get('retry-after');
  if (!raw) return null;

  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.max(0, Math.round(seconds));

  const at = Date.parse(raw);
  return Number.isNaN(at) ? null : Math.max(0, Math.round((at - Date.now()) / 1000));
}

/**
 * Unwraps the success envelope.
 *
 * Successful responses arrive as `{ message, success, data }`; callers want the payload inside. It
 * is unwrapped here because this is the one module that knows the transport's shape — doing it at
 * call sites means every caller carries a `.data` that is easy to forget and invisible until it is.
 *
 * Anything not matching that shape is passed through untouched, so a bare body still works.
 */
function unwrapEnvelope(payload: unknown): unknown {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) return payload;
  const body = payload as Record<string, unknown>;
  return body.success === true && 'data' in body ? body.data : payload;
}

/** A body that is not JSON, or is empty, must not throw here — the status is what matters. */
async function readJson(response: Response): Promise<unknown> {
  const text = await response.text().catch(() => '');
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * Performs a request and returns the parsed body.
 *
 * Throws `ApiError` for every failure — a refused request and an unreachable service both arrive
 * as the same type, distinguished by `outcome`. Nothing else escapes.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // Refuse before the fetch. Left alone, this becomes a connection failure and the visitor is told
  // to check their internet — which is the specific wrong answer worth engineering against.
  if (apiPointsAtTheVisitorsMachine()) {
    warnOnce();
    throw ApiError.notConfigured();
  }

  const { method = 'GET', body, token, signal } = options;

  const headers: Record<string, string> = { accept: 'application/json' };
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (token) headers.authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal
    });
  } catch (cause) {
    // Transport failure: DNS, refused connection, CORS, offline, or an abort. No response exists.
    throw ApiError.transport(cause);
  }

  const payload = await readJson(response);

  if (!response.ok) {
    // Only a plain object can be an envelope. A string or an array body is a proxy or a crash page,
    // not something to read fields off, and treating it as one invents a code that was never sent.
    const envelope = payload !== null && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
    throw ApiError.fromResponse(response.status, envelope, readRetryAfter(response.headers));
  }

  return unwrapEnvelope(payload) as T;
}
