import { authedRequest } from './session';
import type { PlanId } from '../../components/site/plansContent';

/**
 * Campaign authoring.
 *
 * Every call here is refused by the API below the rank that may run a campaign, and that refusal is
 * the control — this module is what draws the affordance, not what protects it.
 *
 * Two of the service's rules are worth restating where the form can see them, because both are the
 * kind that a convenient interface quietly breaks:
 *
 * - **Writing a campaign and putting it in front of people are separate calls**, so that correcting
 *   a draft is never one keystroke away from publishing it.
 * - **The slug is permanent** and identifies the campaign for good. Supplying an existing one edits;
 *   a new one creates.
 */

/** The tiers a campaign can reward. Never `free` — a campaign that grants nothing is refused. */
export type RewardPlan = Exclude<PlanId, 'free'>;

/** Where a campaign is in its authoring life. Not where it is in its running life — see `phase`. */
export type CampaignStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

/**
 * Authoring state and window folded together, which is what an operator actually wants in a column.
 *
 * **Derived by the service on every read and stored nowhere.** So it is reported, never chosen: an
 * operator publishes or closes a campaign and the clock decides the rest.
 */
export type CampaignPhase = 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CLOSED';

/** Which builds a campaign reaches. An empty list means all of them. */
export type CampaignChannel = 'stable' | 'preview' | 'development';

export const CAMPAIGN_CHANNELS: readonly CampaignChannel[] = ['stable', 'preview', 'development'];

/** The service's ceiling on how long a reward may last. Stated here so the form can refuse first. */
export const MAX_REWARD_DAYS = 30;

export interface CampaignAssets {
  backdropUrl?: string;
  iconUrl?: string;
  /** `#rrggbb`. */
  accentColor?: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  bodyMd: string;
  status: CampaignStatus;
  phase: CampaignPhase;
  rewardPlan: RewardPlan;
  rewardDays: number;
  startsAt: string;
  endsAt: string;
  requiresAccount: boolean;
  /** `null` means uncapped — which is not the same as nought, meaning exhausted. */
  maxClaims: number | null;
  claimCount: number;
  channels: CampaignChannel[];
  assets: CampaignAssets;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignPage {
  items: Campaign[];
  total: number;
  limit: number;
  offset: number;
}

export interface CampaignDraft {
  slug: string;
  title: string;
  bodyMd: string;
  rewardPlan: RewardPlan;
  rewardDays: number;
  startsAt: string;
  endsAt: string;
  requiresAccount?: boolean;
  maxClaims?: number | null;
  channels?: CampaignChannel[];
  assets?: CampaignAssets;
}

export const CAMPAIGN_PAGE_SIZE = 25;

/** Every campaign, drafts and closed ones included. */
export function listCampaigns(
  query: { status?: CampaignStatus; offset?: number; limit?: number } = {},
  signal?: AbortSignal
): Promise<CampaignPage> {
  const params = new URLSearchParams({
    offset: String(query.offset ?? 0),
    limit: String(query.limit ?? CAMPAIGN_PAGE_SIZE)
  });
  if (query.status) params.set('status', query.status);
  return authedRequest<CampaignPage>(`/event-drops/campaigns?${params}`, { signal });
}

/** Creates when the slug is new, corrects when it is not. Always lands as a draft; see `setStatus`. */
export function saveCampaign(draft: CampaignDraft, signal?: AbortSignal): Promise<Campaign> {
  return authedRequest<Campaign>('/event-drops/campaigns', { method: 'POST', body: draft, signal });
}

/**
 * Releases a draft, or retracts a running campaign.
 *
 * `DRAFT` is not a destination: a published campaign has been seen, and pretending otherwise would
 * be the console lying about what the world already knows.
 */
export function setCampaignStatus(
  slug: string,
  status: 'PUBLISHED' | 'CLOSED',
  reason: string | undefined,
  signal?: AbortSignal
): Promise<Campaign> {
  return authedRequest<Campaign>(`/event-drops/campaigns/${encodeURIComponent(slug)}/status`, {
    method: 'POST',
    body: reason?.trim() ? { status, reason: reason.trim() } : { status },
    signal
  });
}
