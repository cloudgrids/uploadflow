'use client';

import { useEffect, useState } from 'react';
import {
  CAMPAIGN_PAGE_SIZE,
  isApiError,
  listCampaigns,
  setCampaignStatus,
  type Campaign,
  type CampaignPage,
  type CampaignStatus
} from '../../../lib/api';
import { messageForFailure } from '../apiMessages';
import { CampaignForm } from './CampaignForm';
import { onOrDash, titleCase } from './formats';

type Query = { status?: CampaignStatus; offset: number };
type Load = { kind: 'loading' } | { kind: 'ready'; page: CampaignPage } | { kind: 'failed'; message: string };

const FILTERS: readonly { label: string; status?: CampaignStatus }[] = [
  { label: 'All' },
  { label: 'Drafts', status: 'DRAFT' },
  { label: 'Published', status: 'PUBLISHED' },
  { label: 'Closed', status: 'CLOSED' }
];

/** How the window reads, given that a phase already says whether it is running. */
function windowOf(campaign: Campaign): string {
  return `${onOrDash(campaign.startsAt)} → ${onOrDash(campaign.endsAt)}`;
}

function takenOf(campaign: Campaign): string {
  return campaign.maxClaims === null ? String(campaign.claimCount) : `${campaign.claimCount} of ${campaign.maxClaims}`;
}

/**
 * Campaigns, and the two decisions that are deliberately not the same one.
 *
 * Saving a campaign and publishing it are separate calls in the service, so they are separate
 * controls here. Collapsing them would mean every correction to a draft was one mistaken click away
 * from putting it in front of everybody, which is precisely what the split exists to prevent.
 *
 * Closing is terminal — a closed campaign is not reopened, only replaced — so it asks first. The
 * reason is optional and goes to the service's own record of who did what.
 */
export function CampaignsPanel() {
  const [query, setQuery] = useState<Query>({ offset: 0 });
  const [answer, setAnswer] = useState<{ asked: Query; state: Load } | null>(null);
  const [editing, setEditing] = useState<{ campaign: Campaign | null } | null>(null);
  const [closing, setClosing] = useState<Campaign | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const abort = new AbortController();

    listCampaigns({ status: query.status, offset: query.offset, limit: CAMPAIGN_PAGE_SIZE }, abort.signal)
      .then((page) => {
        if (!abort.signal.aborted) setAnswer({ asked: query, state: { kind: 'ready', page } });
      })
      .catch((cause: unknown) => {
        if (abort.signal.aborted) return;
        const refused = isApiError(cause) && cause.status === 403;
        setAnswer({
          asked: query,
          state: {
            kind: 'failed',
            message: refused ? 'This account does not have access to campaigns.' : messageForFailure(cause, 'Could not load campaigns.')
          }
        });
      });

    return () => abort.abort();
  }, [query]);

  const state: Load = answer?.asked === query ? answer.state : { kind: 'loading' };
  const page = state.kind === 'ready' ? state.page : null;

  /** A fresh object identity is the reload: the effect keys on it. */
  const reload = (next: Partial<Query> = {}) => setQuery((current) => ({ ...current, ...next }));

  const publish = (campaign: Campaign) => async () => {
    if (busy) return;
    setBusy(true);
    setNotice('');
    try {
      await setCampaignStatus(campaign.slug, 'PUBLISHED', undefined);
      reload();
    } catch (cause) {
      setNotice(messageForFailure(cause, `Could not publish ${campaign.slug}.`));
    }
    setBusy(false);
  };

  const confirmClose = async () => {
    if (!closing || busy) return;
    setBusy(true);
    setNotice('');
    try {
      await setCampaignStatus(closing.slug, 'CLOSED', reason);
      setClosing(null);
      setReason('');
      reload();
    } catch (cause) {
      setNotice(messageForFailure(cause, `Could not close ${closing.slug}.`));
    }
    setBusy(false);
  };

  if (editing) {
    return (
      <section className="uf-card uf-stack">
        <CampaignForm
          editing={editing.campaign}
          onSaved={() => {
            setEditing(null);
            reload({ offset: 0 });
          }}
          onCancel={() => setEditing(null)}
        />
      </section>
    );
  }

  return (
    <section className="uf-card uf-stack">
      <div className="uf-stack-6">
        <h2>Campaigns</h2>
        <p className="uf-small">
          Time-boxed offers and where each one stands. A campaign is written first and published as a separate decision;
          closing one early cannot be undone.
        </p>
      </div>

      <div className="uf-op-filter">
        <div className="uf-op-checks">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              className="uf-btn uf-btn-ghost uf-btn-xs"
              type="button"
              aria-pressed={query.status === filter.status}
              onClick={() => setQuery({ status: filter.status, offset: 0 })}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button className="uf-btn uf-btn-primary" type="button" onClick={() => setEditing({ campaign: null })}>
          New campaign
        </button>
      </div>

      {notice ? <p className="uf-small">{notice}</p> : null}
      {state.kind === 'loading' ? <p className="uf-small">Loading…</p> : null}
      {state.kind === 'failed' ? <p className="uf-small">{state.message}</p> : null}

      {closing ? (
        <div className="uf-op-confirm uf-stack-6">
          <p className="uf-small">
            Close <b>{closing.slug}</b>? It stops being offered immediately and cannot be reopened — running it again means a
            new campaign. Anybody who already took it keeps what they were given.
          </p>
          <label className="uf-op-field">
            <span className="uf-small">Why (optional)</span>
            <input value={reason} onChange={(event) => setReason(event.target.value)} maxLength={200} placeholder="artwork was wrong" />
          </label>
          <div className="uf-op-actions">
            <button className="uf-btn uf-btn-primary" type="button" onClick={confirmClose} disabled={busy}>
              {busy ? 'Closing…' : 'Close it'}
            </button>
            <button className="uf-btn uf-btn-ghost" type="button" onClick={() => setClosing(null)} disabled={busy}>
              Keep it running
            </button>
          </div>
        </div>
      ) : null}

      {page ? (
        page.items.length === 0 ? (
          <p className="uf-small">No campaigns yet.</p>
        ) : (
          <>
            <div className="uf-op-scroll">
              <table className="uf-op-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Title</th>
                    <th scope="col">State</th>
                    <th scope="col">Window</th>
                    <th scope="col">Gives</th>
                    <th scope="col">Taken</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {page.items.map((campaign) => (
                    <tr key={campaign.id}>
                      <td data-wrap="">{campaign.slug}</td>
                      <td data-wrap="">{campaign.title}</td>
                      <td>{titleCase(campaign.phase)}</td>
                      <td>{windowOf(campaign)}</td>
                      <td>
                        {titleCase(campaign.rewardPlan)}, {campaign.rewardDays} {campaign.rewardDays === 1 ? 'day' : 'days'}
                      </td>
                      <td>{takenOf(campaign)}</td>
                      <td>
                        <span className="uf-op-row-actions">
                          <button className="uf-btn uf-btn-ghost uf-btn-xs" type="button" onClick={() => setEditing({ campaign })}>
                            Edit
                          </button>
                          {campaign.status === 'DRAFT' ? (
                            <button className="uf-btn uf-btn-ghost uf-btn-xs" type="button" onClick={publish(campaign)} disabled={busy}>
                              Publish
                            </button>
                          ) : null}
                          {campaign.status === 'PUBLISHED' ? (
                            <button className="uf-btn uf-btn-ghost uf-btn-xs" type="button" onClick={() => setClosing(campaign)}>
                              Close
                            </button>
                          ) : null}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="uf-op-page">
              <span className="uf-small">
                {page.offset + 1}–{Math.min(page.offset + page.items.length, page.total)} of {page.total}
              </span>
              <span className="uf-op-page-buttons">
                <button
                  className="uf-btn uf-btn-ghost"
                  type="button"
                  onClick={() => reload({ offset: Math.max(0, query.offset - CAMPAIGN_PAGE_SIZE) })}
                  disabled={query.offset === 0}
                >
                  Previous
                </button>
                <button
                  className="uf-btn uf-btn-ghost"
                  type="button"
                  onClick={() => reload({ offset: query.offset + CAMPAIGN_PAGE_SIZE })}
                  disabled={page.offset + page.items.length >= page.total}
                >
                  Next
                </button>
              </span>
            </div>
          </>
        )
      ) : null}
    </section>
  );
}
