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
export {
  accountStatus,
  consumeMagicLink,
  login,
  logout,
  oauthProviders,
  refreshTokens,
  requestMagicLink,
  requestPasswordReset,
  resetPassword,
  signup,
  type AccountProfile,
  type AuthTokens
} from './auth';
export {
  authedRequest,
  clearSession,
  getSession,
  signOut,
  startSession,
  subscribeToSession,
  type Session
} from './session';
export { useIsSignedIn, useSession } from './useSession';
export {
  isPayablePlan,
  listPlanIdentifiers,
  mySubscription,
  openBillingPortal,
  startCheckout,
  type ApiPlan,
  type MySubscription,
  type PayablePlanId,
  type Subscription
} from './subscriptions';
