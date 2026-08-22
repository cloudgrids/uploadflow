'use client';

import { useState } from 'react';
import {
  CAMPAIGN_CHANNELS,
  MAX_REWARD_DAYS,
  saveCampaign,
  type Campaign,
  type CampaignChannel,
  type CampaignDraft,
  type RewardPlan
} from '../../../lib/api';
import { plans } from '../plansContent';
import { messageForFailure } from '../apiMessages';

/** The tiers a campaign may reward, read from the one place tiers are described. */
const REWARD_PLANS = plans.filter((plan) => plan.id !== 'free').map((plan) => ({ id: plan.id as RewardPlan, name: plan.name }));

/** `datetime-local` speaks local wall-clock with no zone; the service speaks ISO. */
function toLocalInput(iso: string): string {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  const offset = at.getTimezoneOffset() * 60_000;
  return new Date(at.getTime() - offset).toISOString().slice(0, 16);
}

function fromLocalInput(value: string): string {
  return new Date(value).toISOString();
}

function blank() {
  return {
    slug: '',
    title: '',
    bodyMd: '',
    rewardPlan: REWARD_PLANS[0].id,
    rewardDays: 7,
    startsAt: '',
    endsAt: '',
    requiresAccount: false,
    maxClaims: '',
    channels: [] as CampaignChannel[],
    backdropUrl: '',
    iconUrl: '',
    accentColor: ''
  };
}

function fromCampaign(campaign: Campaign) {
  return {
    slug: campaign.slug,
    title: campaign.title,
    bodyMd: campaign.bodyMd,
    rewardPlan: campaign.rewardPlan,
    rewardDays: campaign.rewardDays,
    startsAt: toLocalInput(campaign.startsAt),
    endsAt: toLocalInput(campaign.endsAt),
    requiresAccount: campaign.requiresAccount,
    maxClaims: campaign.maxClaims === null ? '' : String(campaign.maxClaims),
    channels: campaign.channels,
    backdropUrl: campaign.assets.backdropUrl ?? '',
    iconUrl: campaign.assets.iconUrl ?? '',
    accentColor: campaign.assets.accentColor ?? ''
  };
}

/**
 * Writing a campaign. **Not publishing one** — that is a separate call and a separate control.
 *
 * The service keeps them apart so that correcting a draft is never one keystroke away from putting
 * it in front of people, and a form whose submit button published would hand that distinction
 * straight back. So this saves, and says so.
 */
export function CampaignForm({
  editing,
  onSaved,
  onCancel
}: {
  editing: Campaign | null;
  onSaved: (campaign: Campaign) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(() => (editing ? fromCampaign(editing) : blank()));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  // The service refuses to change the terms once anybody has taken them: two cohorts holding
  // different rewards under one campaign name is not a state anything downstream can tell apart.
  const rewardFrozen = (editing?.claimCount ?? 0) > 0;
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((current) => ({ ...current, [key]: value }));

  const toggleChannel = (channel: CampaignChannel) =>
    set('channels', form.channels.includes(channel) ? form.channels.filter((c) => c !== channel) : [...form.channels, channel]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;

    if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) {
      setNotice('The window has to end after it starts.');
      return;
    }

    setBusy(true);
    setNotice('');

    const assets = {
      ...(form.backdropUrl.trim() ? { backdropUrl: form.backdropUrl.trim() } : {}),
      ...(form.iconUrl.trim() ? { iconUrl: form.iconUrl.trim() } : {}),
      ...(form.accentColor.trim() ? { accentColor: form.accentColor.trim() } : {})
    };

    const draft: CampaignDraft = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      bodyMd: form.bodyMd,
      rewardPlan: form.rewardPlan,
      rewardDays: Number(form.rewardDays),
      startsAt: fromLocalInput(form.startsAt),
      endsAt: fromLocalInput(form.endsAt),
      requiresAccount: form.requiresAccount,
      // Empty means uncapped, and has to travel as null rather than be omitted — omitting it would
      // leave an existing cap in place on a correction that meant to remove it.
      maxClaims: form.maxClaims.trim() ? Number(form.maxClaims) : null,
      channels: form.channels,
      ...(Object.keys(assets).length ? { assets } : {})
    };

    try {
      onSaved(await saveCampaign(draft));
    } catch (cause) {
      setNotice(messageForFailure(cause, 'Could not save this campaign.'));
      setBusy(false);
    }
  };

  return (
    <form className="uf-stack" onSubmit={submit}>
      <div className="uf-stack-6">
        <h3>{editing ? `Editing ${editing.slug}` : 'New campaign'}</h3>
        <p className="uf-small">
          Saving writes a draft. Nothing here puts a campaign in front of anybody — publishing is its own decision, from
          the list.
        </p>
      </div>

      <div className="uf-op-fields">
        <label className="uf-op-field">
          <span className="uf-small">Name in links</span>
          <input
            value={form.slug}
            onChange={(event) => set('slug', event.target.value)}
            readOnly={Boolean(editing)}
            required
            pattern="[a-z0-9][a-z0-9-]*"
            maxLength={64}
            spellCheck={false}
            placeholder="winter-2026"
          />
          <span className="uf-small">
            {editing ? 'Permanent — it identifies this campaign everywhere it has been seen.' : 'Lowercase, numbers and hyphens. Permanent once saved.'}
          </span>
        </label>

        <label className="uf-op-field">
          <span className="uf-small">Title</span>
          <input value={form.title} onChange={(event) => set('title', event.target.value)} required maxLength={160} />
        </label>
      </div>

      <label className="uf-op-field">
        <span className="uf-small">Description</span>
        <textarea value={form.bodyMd} onChange={(event) => set('bodyMd', event.target.value)} required maxLength={4000} rows={5} />
        <span className="uf-small">Markdown. This is what somebody reads to decide whether they want it.</span>
      </label>

      <fieldset className="uf-op-group" disabled={rewardFrozen}>
        <legend className="uf-small">What it gives</legend>
        {rewardFrozen ? (
          <p className="uf-small">
            Fixed — {editing?.claimCount} {editing?.claimCount === 1 ? 'person has' : 'people have'} already taken this. Changing the
            terms now would leave two groups holding different ones under the same name.
          </p>
        ) : null}
        <div className="uf-op-fields">
          <label className="uf-op-field">
            <span className="uf-small">Tier</span>
            <select value={form.rewardPlan} onChange={(event) => set('rewardPlan', event.target.value as RewardPlan)}>
              {REWARD_PLANS.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </label>

          <label className="uf-op-field">
            <span className="uf-small">For how many days</span>
            <input
              type="number"
              min={1}
              max={MAX_REWARD_DAYS}
              value={form.rewardDays}
              onChange={(event) => set('rewardDays', Number(event.target.value))}
              required
            />
            <span className="uf-small">Counted from the moment somebody takes it, not from the window. At most {MAX_REWARD_DAYS}.</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="uf-op-group">
        <legend className="uf-small">When it runs</legend>
        <div className="uf-op-fields">
          <label className="uf-op-field">
            <span className="uf-small">Opens</span>
            <input type="datetime-local" value={form.startsAt} onChange={(event) => set('startsAt', event.target.value)} required />
          </label>
          <label className="uf-op-field">
            <span className="uf-small">Closes</span>
            <input type="datetime-local" value={form.endsAt} onChange={(event) => set('endsAt', event.target.value)} required />
          </label>
        </div>
        <p className="uf-small">Your own clock. Both are required — a drop with no end is not a drop.</p>
      </fieldset>

      <fieldset className="uf-op-group">
        <legend className="uf-small">Who can take it</legend>
        <label className="uf-op-check">
          <input type="checkbox" checked={form.requiresAccount} onChange={(event) => set('requiresAccount', event.target.checked)} />
          <span className="uf-small">Needs an account</span>
        </label>
        <label className="uf-op-field">
          <span className="uf-small">Limit</span>
          <input
            type="number"
            min={1}
            value={form.maxClaims}
            onChange={(event) => set('maxClaims', event.target.value)}
            placeholder="No limit"
          />
          <span className="uf-small">Leave empty for no limit.</span>
        </label>
        <div className="uf-op-checks">
          <span className="uf-small">Builds</span>
          {CAMPAIGN_CHANNELS.map((channel) => (
            <label className="uf-op-check" key={channel}>
              <input type="checkbox" checked={form.channels.includes(channel)} onChange={() => toggleChannel(channel)} />
              <span className="uf-small">{channel}</span>
            </label>
          ))}
          <span className="uf-small">None ticked reaches every build.</span>
        </div>
      </fieldset>

      <fieldset className="uf-op-group">
        <legend className="uf-small">Artwork</legend>
        <div className="uf-op-fields">
          <label className="uf-op-field">
            <span className="uf-small">Backdrop</span>
            <input type="url" value={form.backdropUrl} onChange={(event) => set('backdropUrl', event.target.value)} placeholder="https://…" />
          </label>
          <label className="uf-op-field">
            <span className="uf-small">Icon</span>
            <input type="url" value={form.iconUrl} onChange={(event) => set('iconUrl', event.target.value)} placeholder="https://…" />
          </label>
          <label className="uf-op-field">
            <span className="uf-small">Accent</span>
            <input value={form.accentColor} onChange={(event) => set('accentColor', event.target.value)} placeholder="#7c3aed" pattern="#[0-9a-fA-F]{6}" />
          </label>
        </div>
        <p className="uf-small">Addresses have to be https — they end up in an image on somebody else&rsquo;s screen.</p>
      </fieldset>

      {notice ? <p className="uf-small">{notice}</p> : null}

      <div className="uf-op-actions">
        <button className="uf-btn uf-btn-primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : editing ? 'Save changes' : 'Save draft'}
        </button>
        <button className="uf-btn uf-btn-ghost" type="button" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}
