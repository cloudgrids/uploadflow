/**
 * The site's API client.
 *
 * Import from here rather than from the modules directly, so the surface stays one thing that can
 * be reviewed in one place.
 */
export { apiBaseUrl, apiUrl, isApiConfigured } from './config';
export { ApiError, isApiError, outcomeForStatus, type FailureOutcome } from './errors';
export { request, type RequestOptions } from './client';
export { joinWaitlist, submitSupportTicket, type AcceptedResponse, type SupportTicketRequest, type WaitlistRequest } from './support';
