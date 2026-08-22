'use client';

import { useState } from 'react';
import {
  CAMPAIGN_CHANNELS,
  previewAudience,
  saveAnnouncement,
  SEVERITIES,
  type Announcement,
  type AnnouncementDraft,
  type Audience,
  type AudiencePreview,
  type CampaignChannel,
  type Severity
} from '../../../lib/api';
import { plans, type PlanId } from '../plansContent';
import { messageForFailure } from '../apiMessages';

/** How long an announcement runs unless somebody says otherwise. */
const DEFAULT_RUN_DAYS = 14;

function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  return new Date(at.getTime() - at.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function defaultEnd(): string {
  const at = new Date(Date.now() + DEFAULT_RUN_DAYS * 86_400_000);
  return new Date(at.getTime() - at.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

/** A pasted list, however it was pasted — commas, spaces, one per line. */
function parseIds(value: string): string[] {
  return value
    .split(/[\s,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const SCOPE_WORDS: Readonly<Record<AudiencePreview['scope'], string>> = {
  everyone: 'Everyone',
  people: 'Named accounts',
  segment: 'A segment'
};

function blank(): {
  id?: string;
  title: string;
  bodyMd: string;
  severity: Severity;
  channels: CampaignChannel[];
  plans: PlanId[];
  userIds: string;
  actionUrl: string;
  actionLabel: string;
  startsAt: string;
  endsAt: string;
} {
  return {
    title: '',
    bodyMd: '',
    // The quietest level, deliberately. A composer that opens on the loudest makes shouting the
    // thing you have to remember to turn off.
    severity: 'INFO',
    channels: [],
    plans: [],
    userIds: '',
    actionUrl: '',
    actionLabel: '',
    startsAt: '',
    // Prefilled so that running forever is something somebody has to choose. Anything with no end
    // becomes furniture, and furniture is not read.
    endsAt: defaultEnd()
  };
}

function fromAnnouncement(announcement: Announcement) {
  return {
    id: announcement.id,
    title: announcement.title,
    bodyMd: announcement.bodyMd,
    severity: announcement.severity,
    channels: announcement.audience.channels ?? [],
    plans: (announcement.audience.plans ?? []) as PlanId[],
    userIds: (announcement.audience.userIds ?? []).join('\n'),
    actionUrl: announcement.actionUrl ?? '',
    actionLabel: announcement.actionLabel ?? '',
    startsAt: toLocalInput(announcement.startsAt),
    endsAt: toLocalInput(announcement.endsAt)
  };
}

/**
 * Composing an announcement, and the step that stops it going to everybody by accident.
 *
 * **An announcement cannot be unsent.** It can be expired or retired, and neither of those unsees
 * it. The difference between telling a segment and telling everyone is one empty field, so this
 * refuses to send until the audience it is about to use has been looked at — and it stops counting
 * a look as current the moment the audience changes underneath it.
 *
 * There is no send *moment*. An announcement has a window, and giving it a future start is what
 * scheduling is, so the form says so rather than implying a button fires something.
 */
export function AnnouncementComposer({
  editing,
  onSaved,
  onCancel
}: {
  editing: Announcement | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(() => (editing ? fromAnnouncement(editing) : blank()));
  const [preview, setPreview] = useState<{ forAudience: string; result: AudiencePreview } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((current) => ({ ...current, [key]: value }));

  const audience: Audience = {
    ...(form.channels.length ? { channels: form.channels } : {}),
    ...(form.plans.length ? { plans: form.plans } : {}),
    ...(parseIds(form.userIds).length ? { userIds: parseIds(form.userIds) } : {})
  };

  // Comparing the shape rather than a flag: a preview of a different audience is not a preview of
  // this one, and a stale count is worse than none because it reads as checked.
  const audienceKey = JSON.stringify(audience);
  const checked = preview?.forAudience === audienceKey ? preview.result : null;

  const look = async () => {
    if (busy) return;
    setBusy(true);
    setNotice('');
    try {
      setPreview({ forAudience: audienceKey, result: await previewAudience(audience) });
    } catch (cause) {
      setNotice(messageForFailure(cause, 'Could not work out who this would reach.'));
    }
    setBusy(false);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !checked) return;

    if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) {
      setNotice('The window has to end after it starts.');
      return;
    }

    setBusy(true);
    setNotice('');

    const draft: AnnouncementDraft = {
      ...(form.id ? { id: form.id } : {}),
      title: form.title.trim(),
      bodyMd: form.bodyMd,
      severity: form.severity,
      audience,
      ...(form.actionUrl.trim() ? { actionUrl: form.actionUrl.trim() } : {}),
      ...(form.actionLabel.trim() ? { actionLabel: form.actionLabel.trim() } : {}),
      ...(form.startsAt ? { startsAt: new Date(form.startsAt).toISOString() } : {}),
      ...(form.endsAt ? { endsAt: new Date(form.endsAt).toISOString() } : {})
    };

    try {
      await saveAnnouncement(draft);
      onSaved();
    } catch (cause) {
      setNotice(messageForFailure(cause, 'Could not save this announcement.'));
      setBusy(false);
    }
  };

  const toggle = <T,>(list: T[], value: T): T[] => (list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value]);

  return (
    <form className="uf-stack" onSubmit={submit}>
      <div className="uf-stack-6">
        <h3>{editing ? 'Editing an announcement' : 'New announcement'}</h3>
        <p className="uf-small">
          This cannot be unsent. It can be given an end, or retired early — neither of which unsees it.
        </p>
      </div>

      <label className="uf-op-field">
        <span className="uf-small">Title</span>
        <input value={form.title} onChange={(event) => set('title', event.target.value)} required maxLength={160} />
      </label>

      <label className="uf-op-field">
        <span className="uf-small">Message</span>
        <textarea value={form.bodyMd} onChange={(event) => set('bodyMd', event.target.value)} required maxLength={4000} rows={5} />
        <span className="uf-small">Markdown.</span>
      </label>

      <div className="uf-op-fields">
        <label className="uf-op-field">
          <span className="uf-small">How it reads</span>
          <select value={form.severity} onChange={(event) => set('severity', event.target.value as Severity)}>
            {SEVERITIES.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
          <span className="uf-small">Starts at the quietest. Raise it because this warrants it, not by default.</span>
        </label>

        <label className="uf-op-field">
          <span className="uf-small">Button address (optional)</span>
          <input type="url" value={form.actionUrl} onChange={(event) => set('actionUrl', event.target.value)} placeholder="https://…" />
        </label>

        <label className="uf-op-field">
          <span className="uf-small">Button words (optional)</span>
          <input value={form.actionLabel} onChange={(event) => set('actionLabel', event.target.value)} maxLength={80} />
        </label>
      </div>

      <fieldset className="uf-op-group">
        <legend className="uf-small">When it runs</legend>
        <div className="uf-op-fields">
          <label className="uf-op-field">
            <span className="uf-small">Starts</span>
            <input type="datetime-local" value={form.startsAt} onChange={(event) => set('startsAt', event.target.value)} />
            <span className="uf-small">Leave empty to start at once. A future time is what scheduling is.</span>
          </label>
          <label className="uf-op-field">
            <span className="uf-small">Ends</span>
            <input type="datetime-local" value={form.endsAt} onChange={(event) => set('endsAt', event.target.value)} />
            <span className="uf-small">
              {form.endsAt ? `Filled in for you — ${DEFAULT_RUN_DAYS} days.` : 'Empty means it runs until somebody retires it.'}
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset className="uf-op-group">
        <legend className="uf-small">Who sees it</legend>
        <p className="uf-small">Nothing chosen reaches everybody. Narrowing is what the boxes below do.</p>

        <div className="uf-op-checks">
          <span className="uf-small">Builds</span>
          {CAMPAIGN_CHANNELS.map((channel) => (
            <label className="uf-op-check" key={channel}>
              <input type="checkbox" checked={form.channels.includes(channel)} onChange={() => set('channels', toggle(form.channels, channel))} />
              <span className="uf-small">{channel}</span>
            </label>
          ))}
        </div>

        <div className="uf-op-checks">
          <span className="uf-small">Tiers</span>
          {plans.map((plan) => (
            <label className="uf-op-check" key={plan.id}>
              <input type="checkbox" checked={form.plans.includes(plan.id)} onChange={() => set('plans', toggle(form.plans, plan.id))} />
              <span className="uf-small">{plan.name}</span>
            </label>
          ))}
        </div>

        <label className="uf-op-field">
          <span className="uf-small">Particular accounts (optional)</span>
          <textarea value={form.userIds} onChange={(event) => set('userIds', event.target.value)} rows={3} spellCheck={false} />
          <span className="uf-small">One id per line, or separated however you pasted them. Only reaches somebody signed in.</span>
        </label>
      </fieldset>

      <div className="uf-op-confirm uf-stack-6">
        <button className="uf-btn uf-btn-ghost" type="button" onClick={look} disabled={busy}>
          {busy ? 'Working it out…' : checked ? 'Check again' : 'Who would this reach?'}
        </button>

        {checked ? (
          <>
            <p className="uf-op-scope">{SCOPE_WORDS[checked.scope]}</p>
            <p className="uf-small">
              {checked.installations} of {checked.totalInstallations} recently active installations, and {checked.accounts}{' '}
              {checked.accounts === 1 ? 'account' : 'accounts'} behind them. Installations not seen since{' '}
              {new Date(checked.activeSince).toLocaleDateString()} are not counted.
            </p>
            {checked.unknownUserIds.length ? (
              <p className="uf-small">
                {checked.unknownUserIds.length} of the ids you gave match no account. That is what a mis-pasted list looks like.
              </p>
            ) : null}
          </>
        ) : (
          <p className="uf-small">Check who this reaches before sending it. Changing the audience asks again.</p>
        )}
      </div>

      {notice ? <p className="uf-small">{notice}</p> : null}

      <div className="uf-op-actions">
        <button className="uf-btn uf-btn-primary" type="submit" disabled={busy || !checked}>
          {busy ? 'Saving…' : editing ? 'Save changes' : 'Send it'}
        </button>
        <button className="uf-btn uf-btn-ghost" type="button" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}
