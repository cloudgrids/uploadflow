/**
 * Plan and account copy.
 *
 * Deliberately customer-facing only: what each tier opens and what signing in
 * does. How entitlement is proved is an implementation detail and never appears
 * here.
 *
 * Prices live here and nowhere else. `monthly` and `annual` are whole US dollars;
 * `annual` is the total charged once a year, not a per-month figure. The card
 * derives the effective monthly and the saving from these two numbers, so the
 * three can never drift apart on screen — change these and every surface follows.
 */
export type PlanId = 'free' | 'silver' | 'gold' | 'platinum';

export interface PlanFeature {
  title: string;
  copy: string;
  /** `soon` renders a quiet badge; it never explains why something is withheld. */
  state: 'included' | 'soon';
}

export type BillingPeriod = 'monthly' | 'annual';

export interface PlanPrice {
  /** Whole US dollars per month, billed monthly. */
  monthly: number;
  /** Whole US dollars charged once a year. */
  annual: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  access: string;
  line: string;
  cta: string;
  /** `null` on Free — it has no price rather than a price of zero. */
  price: PlanPrice | null;
  /**
   * The tier the page steers people toward. Exactly one plan carries it, and it
   * yields to `data-current` — telling someone their own plan is "most popular"
   * is noise, so the card shows one flag or the other, never both.
   */
  recommended?: true;
  features: PlanFeature[];
}

export const billingPeriods = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'annual', label: 'Annual' }
] as const satisfies ReadonlyArray<{ id: BillingPeriod; label: string }>;

/** Effective per-month cost of the annual plan, for the headline figure. */
export function monthlyEquivalent(price: PlanPrice): number {
  return Math.round(price.annual / 12);
}

/** What a year on annual saves against twelve monthly charges. */
export function annualSaving(price: PlanPrice): number {
  return price.monthly * 12 - price.annual;
}

/**
 * Lookup by display name, for the landing page's own tier cards. They are a
 * separate, shorter list in `content.ts`, but the figures must come from here
 * so the two pages can never quote different prices.
 */
export function priceForPlanName(name: string): PlanPrice | null {
  return plans.find((plan) => plan.name === name)?.price ?? null;
}

export const plans = [
  {
    id: 'free',
    name: 'Free',
    access: 'No account needed',
    line: 'Everything you need to move a file between two sites.',
    cta: 'Current plan',
    price: null,
    features: [
      { title: 'Capture from any page', copy: 'Save media you are allowed to reuse.', state: 'included' },
      { title: 'Media shelf', copy: 'Keep it to hand while you move between tabs.', state: 'included' },
      { title: 'Full editor', copy: 'Open any queued file and work on it.', state: 'included' },
      { title: 'Optimize, crop, cutout', copy: 'Resize, compress, convert, remove a background.', state: 'included' },
      { title: 'Deliver to another site', copy: 'Hand the finished file to an upload field.', state: 'included' },
      { title: 'Collections', copy: 'Group the media that belongs together.', state: 'included' }
    ]
  },
  {
    id: 'silver',
    name: 'Silver',
    access: 'Sign in required',
    line: 'For work that has to look a particular way.',
    cta: 'Choose Silver',
    price: { monthly: 4, annual: 36 },
    features: [
      { title: 'Redact', copy: 'Cover or blur anything private before it leaves.', state: 'included' },
      { title: 'Watermark', copy: 'Reusable text or a saved brand mark.', state: 'included' },
      { title: 'Alt text', copy: 'Write it once and keep it with the file.', state: 'included' },
      { title: 'Saved site rules', copy: 'Prepare files the way each site expects.', state: 'included' },
      { title: 'Automatic privacy check', copy: 'Flag sensitive details for you.', state: 'soon' }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    access: 'Sign in required',
    line: 'For delivering the same kind of thing, often.',
    cta: 'Choose Gold',
    price: { monthly: 9, annual: 84 },
    recommended: true,
    features: [
      { title: 'Video tools', copy: 'Trim, split, resize and adjust audio.', state: 'included' },
      { title: 'Upscale', copy: 'Recover resolution when a file is too small.', state: 'included' },
      { title: 'Post bundles', copy: 'Media, caption and links kept together.', state: 'included' },
      { title: 'Media history', copy: 'Find something you delivered before.', state: 'included' }
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    access: 'Sign in required',
    line: 'For many files, across many destinations.',
    cta: 'Choose Platinum',
    price: { monthly: 19, annual: 180 },
    features: [
      { title: 'Batch work', copy: 'Apply the same treatment to a whole selection.', state: 'included' },
      { title: 'Destination packs', copy: 'Produce every size a platform wants at once.', state: 'included' },
      { title: 'Brand kits', copy: 'One identity reused everywhere.', state: 'included' },
      { title: 'Everything in Gold', copy: 'Video, upscale, bundles, rules, history.', state: 'included' },
      { title: 'Scheduled delivery', copy: 'Hand a draft over at a chosen time.', state: 'soon' }
    ]
  }
] satisfies Plan[];

export type AccountStateId = 'out' | 'in' | 'active' | 'offline' | 'lapsed';

export interface AccountState {
  id: AccountStateId;
  label: string;
  name: string;
  sub: string;
  initials: string;
  chip: string;
  chipTone: 'quiet' | 'on' | 'outline';
  title: string;
  copy: string;
  primary: string;
  secondary: string;
  plan: PlanId;
}

export const accountStates = [
  {
    id: 'out',
    label: 'Signed out',
    name: 'Not signed in',
    sub: 'Using UploadFlow Free',
    initials: '—',
    chip: 'Free',
    chipTone: 'quiet',
    title: 'You already have a working product.',
    copy: 'Capture from a page, keep media on your shelf, open the full editor, optimize, crop and remove a background — all without an account. Sign in only when you want a paid plan.',
    primary: 'Sign in',
    secondary: 'Stay on Free',
    plan: 'free'
  },
  {
    id: 'in',
    label: 'Signed in, Free',
    name: 'Signed in',
    sub: 'No paid plan yet',
    initials: 'UF',
    chip: 'Free',
    chipTone: 'quiet',
    title: 'Signed in. Nothing has changed yet.',
    copy: 'Your account is linked and the free tools work exactly as before. Choosing a plan is a separate step, and it takes effect as soon as it is confirmed.',
    primary: 'Choose a plan',
    secondary: 'Account settings',
    plan: 'free'
  },
  {
    id: 'active',
    label: 'Plan active',
    name: 'Signed in',
    sub: 'Gold · renews 14 August',
    initials: 'UF',
    chip: 'Gold',
    chipTone: 'on',
    title: 'Gold is active on this browser.',
    copy: 'Every Gold tool is available now. Anything above your plan stays visible but locked, and always says which plan it belongs to rather than failing quietly.',
    primary: 'Manage plan',
    secondary: 'Sign out',
    plan: 'gold'
  },
  {
    id: 'offline',
    label: 'Offline',
    name: 'Signed in',
    sub: 'Gold · working offline',
    initials: 'UF',
    chip: 'Gold',
    chipTone: 'on',
    title: 'No connection, and nothing is locked.',
    copy: 'Your plan keeps working without a network. UploadFlow checks in again when you are back online — you do not need to be connected to finish what you are doing.',
    primary: 'Retry connection',
    secondary: 'Continue offline',
    plan: 'gold'
  },
  {
    id: 'lapsed',
    label: 'Plan ended',
    name: 'Signed in',
    sub: 'Plan ended 14 August',
    initials: 'UF',
    chip: 'Free',
    chipTone: 'outline',
    title: 'Back on Free, with your work intact.',
    copy: 'Your shelf, your captures and your saved files are untouched. The Gold tools are locked until the plan is renewed, and nothing you made has been removed.',
    primary: 'Renew plan',
    secondary: 'Stay on Free',
    plan: 'free'
  }
] satisfies AccountState[];

export const marqueeLines: Array<[string, string]> = [
  ['Free', 'no account'],
  ['Free', 'no card'],
  ['Paid plans', 'from $4 a month'],
  ['Your media', 'never leaves your browser'],
  ['Paid plans', 'work offline'],
  ['Cancel', 'keep everything you made'],
  ['One extension', 'every site you upload to']
];

export const planNotes = [
  { title: 'Free needs no account', copy: 'No sign-up, no card, no prompt. The free tools work the moment the extension is installed.' },
  { title: 'Your media stays with you', copy: 'An account carries your plan. It does not hold your files, your shelf, or the pages you visit.' },
  { title: 'It works offline', copy: 'Once a plan is active it keeps working without a connection, so a flaky network never locks you out mid-edit.' },
  { title: 'Nothing is taken away', copy: 'If a plan ends, your shelf and everything you captured stay exactly where they are. You return to Free.' }
];
