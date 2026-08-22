import { request } from './client';
import type { PlanId } from '../../components/site/plansContent';

/**
 * What is running right now, as anybody can see it.
 *
 * Public and anonymous: this endpoint is answerable without an account, which is what makes a
 * campaign discoverable by somebody who does not have the product yet — the audience a time-boxed
 * offer most needs to reach.
 *
 * **Taking one is not done here.** What a drop gives attaches to your copy of the extension, and a
 * web page is not one. So this surface announces and the extension is where taking it happens;
 * offering a button that could not complete would be worse than offering none.
 */

/** The published build, which is the one a visitor to this site would install. */
const CHANNEL = 'stable';

export interface DropAssets {
  backdropUrl?: string;
  iconUrl?: string;
  accentColor?: string;
}

export interface Drop {
  slug: string;
  title: string;
  bodyMd: string;
  /** The tier it gives. Named from the site's own plan copy, never described here. */
  rewardPlan: PlanId;
  /** Counted from the moment it is taken, not from the window. */
  rewardDays: number;
  startsAt: string;
  endsAt: string;
  requiresAccount: boolean;
  claimed: boolean;
  /** Slots left when capped. `null` is uncapped — which is not nought, meaning exhausted. */
  remaining: number | null;
  assets: DropAssets;
}

/** Campaigns open right now. An empty list is an answer, not a failure. */
export function liveDrops(signal?: AbortSignal): Promise<Drop[]> {
  return request<Drop[]>(`/event-drops?channel=${CHANNEL}`, { signal });
}
