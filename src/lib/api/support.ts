import { request } from './client';

/**
 * Waitlist and support intake.
 *
 * Both are public — they take no credentials — and both are rate limited by the service, so a
 * caller should expect a `throttled` outcome as an ordinary result rather than a bug.
 */

/** Both endpoints answer with this. `accepted` is false only where the service declined to record it. */
export interface AcceptedResponse {
  accepted: boolean;
}

export interface WaitlistRequest {
  email: string;
  /** Where the signup came from, for attribution. Free text, kept short. */
  source?: string;
}

export interface SupportTicketRequest {
  email: string;
  subject: string;
  body: string;
}

/** Joins the waitlist. Succeeds whether or not the address is already on it. */
export function joinWaitlist(input: WaitlistRequest, signal?: AbortSignal): Promise<AcceptedResponse> {
  return request<AcceptedResponse>('/waitlist', { method: 'POST', body: input, signal });
}

/** Sends a support message. No account needed. */
export function submitSupportTicket(input: SupportTicketRequest, signal?: AbortSignal): Promise<AcceptedResponse> {
  return request<AcceptedResponse>('/support/tickets', { method: 'POST', body: input, signal });
}
