/**
 * A state, as something you can see rather than something you have to read.
 *
 * Every one of these screens is scanned before it is read — an operator is looking for the one
 * campaign that is live or the one account that is closed, not working through a list. Until now
 * every state was the same grey word in the same grey column, so finding it meant reading all of
 * them.
 *
 * **Four tones, and the fourth is the one that matters.** Over-because-the-clock-said-so is not the
 * same event as over-because-somebody-stopped-it, and a console that paints them alike will have
 * somebody investigating an expiry as though it were an intervention. So `done` is quiet and
 * `stopped` is not.
 *
 * The palette is the site's own semantic ink, which is separate from its accent by construction —
 * this site fills with black or white and never with a hue, so a coloured chip can only mean state.
 */
export type Tone = 'live' | 'waiting' | 'done' | 'stopped' | 'neutral';

/**
 * Their own family rather than more `uf-chip-` variants: `uf-chip-live` already exists, means an
 * accent-toned chip, and is used on three other surfaces. Adding a second definition would have
 * restyled all of them from the other end of the stylesheet with nothing to notice it by.
 */
const CLASS: Readonly<Record<Tone, string>> = {
  live: 'uf-chip uf-state-live',
  waiting: 'uf-chip uf-state-wait',
  done: 'uf-chip uf-state-done',
  stopped: 'uf-chip uf-state-stop',
  neutral: 'uf-chip uf-chip-plan'
};

/** Campaigns. `DRAFT` is neutral because nobody has decided anything about it yet. */
export const CAMPAIGN_TONE: Readonly<Record<string, Tone>> = {
  DRAFT: 'neutral',
  SCHEDULED: 'waiting',
  LIVE: 'live',
  ENDED: 'done',
  CLOSED: 'stopped'
};

/** Announcements. Same shape, and `RETIRED` is the one somebody did on purpose. */
export const ANNOUNCEMENT_TONE: Readonly<Record<string, Tone>> = {
  SCHEDULED: 'waiting',
  LIVE: 'live',
  EXPIRED: 'done',
  RETIRED: 'stopped'
};

/**
 * Subscriptions, from the billing provider's vocabulary. Read by the operator listing and by the
 * account page, which is why this sits a level above the operator screens.
 *
 * Unknown statuses fall to neutral rather than to an alarming tone: a provider adding a word we
 * have not seen is not evidence that anything is wrong, and guessing loudly would make every such
 * addition look like an incident.
 */
export const SUBSCRIPTION_TONE: Readonly<Record<string, Tone>> = {
  active: 'live',
  trialing: 'waiting',
  past_due: 'stopped',
  unpaid: 'stopped',
  canceled: 'stopped',
  cancelled: 'stopped',
  incomplete: 'waiting',
  incomplete_expired: 'done',
  paused: 'done',
  expired: 'done'
};

export function StateChip({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return <span className={CLASS[tone]}>{label}</span>;
}
