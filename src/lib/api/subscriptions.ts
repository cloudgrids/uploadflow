import type { BillingPeriod, PlanId } from '../../components/site/plansContent';
import { authedRequest } from './session';
import { request } from './client';

/**
 * Checkout, the billing portal, and the current subscription.
 *
 * **Prices are not read from here.** `plansContent.ts` remains the only source of what the site
 * displays; two sources could disagree, and the disagreement that matters is a marketing page
 * showing one figure while the card is charged another. The service is used for the plan
 * *identifier* checkout needs and for the account's own state — never for a number on a page.
 */

/** The identifiers the service uses. Identical to the site's `PlanId`, which is why the map is trivial. */
export type ApiPlan = 'free' | 'silver' | 'gold' | 'platinum';

/** The service calls the yearly interval `yearly`; the site calls the same thing `annual`. */
export type ApiInterval = 'monthly' | 'yearly';

/**
 * The one place the two vocabularies meet.
 *
 * Written as an exhaustive map rather than a cast so that adding a period to the site is a compile
 * error here instead of a request the service rejects at the moment somebody tries to pay.
 */
const INTERVAL_FOR_PERIOD: Readonly<Record<BillingPeriod, ApiInterval>> = {
  monthly: 'monthly',
  annual: 'yearly'
};

/**
 * The plan a checkout can be started for.
 *
 * `free` is excluded deliberately: it is what an account has without a subscription, so there is
 * nothing to check out.
 */
export type PayablePlanId = Exclude<PlanId, 'free'>;

export function isPayablePlan(plan: PlanId): plan is PayablePlanId {
  return plan !== 'free';
}

export interface Subscription {
  plan: ApiPlan;
  status: string;
  provider: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: string | null;
}

export interface MySubscription {
  plan: ApiPlan;
  subscription: Subscription | null;
}

/** The plan catalogue. Used for identifiers and availability, never for displayed prices. */
export interface ApiPlanSummary {
  tier: ApiPlan;
  name: string;
}

export async function listPlanIdentifiers(signal?: AbortSignal): Promise<ApiPlanSummary[]> {
  const plans = await request<ApiPlanSummary[]>('/plans', { signal });
  return plans.map(({ tier, name }) => ({ tier, name }));
}

/**
 * Starts a checkout and returns the URL to send the browser to.
 *
 * Requires a signed-in account — a subscription belongs to one — so this throws an `auth` outcome
 * when nobody is signed in, and the caller should offer sign-in rather than reporting a failure.
 */
export async function startCheckout(plan: PayablePlanId, period: BillingPeriod, signal?: AbortSignal): Promise<string> {
  const { url } = await authedRequest<{ url: string }>('/subscriptions/checkout', {
    method: 'POST',
    body: { plan, interval: INTERVAL_FOR_PERIOD[period] },
    signal
  });
  return url;
}

/** The provider's own management page, for changing a card or cancelling there. */
export async function openBillingPortal(signal?: AbortSignal): Promise<string> {
  const { url } = await authedRequest<{ url: string }>('/subscriptions/portal', { method: 'POST', signal });
  return url;
}

/** The signed-in account's subscription. `plan` is `free` when there is no active one. */
export function mySubscription(signal?: AbortSignal): Promise<MySubscription> {
  return authedRequest<MySubscription>('/subscriptions/me', { signal });
}
