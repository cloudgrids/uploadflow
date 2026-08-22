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
  verifyEmail,
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
export { asGlobalRole, roleAtLeast, GLOBAL_ROLES, OPERATOR_ROLE, type GlobalRole } from './roles';
export { myProfile } from './profile';
export { useAccess, type Access } from './useAccess';
export {
  listAccounts,
  listSubscriptions,
  OPERATOR_PAGE_SIZE,
  type OperatorAccount,
  type OperatorPage,
  type OperatorQuery,
  type OperatorSubscription
} from './operators';
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
export {
  CAMPAIGN_CHANNELS,
  CAMPAIGN_PAGE_SIZE,
  listCampaigns,
  MAX_REWARD_DAYS,
  saveCampaign,
  setCampaignStatus,
  type Campaign,
  type CampaignAssets,
  type CampaignChannel,
  type CampaignDraft,
  type CampaignPage,
  type CampaignPhase,
  type CampaignStatus,
  type RewardPlan
} from './campaigns';
export {
  ANNOUNCEMENT_PAGE_SIZE,
  listAnnouncements,
  previewAudience,
  retireAnnouncement,
  saveAnnouncement,
  SEVERITIES,
  type Announcement,
  type AnnouncementDraft,
  type AnnouncementPage,
  type AnnouncementPhase,
  type Audience,
  type AudiencePreview,
  type AudienceScope,
  type Severity
} from './announcements';

export { liveDrops, type Drop, type DropAssets } from './drops';
