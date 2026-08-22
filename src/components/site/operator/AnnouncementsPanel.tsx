'use client';

import { useEffect, useState } from 'react';
import {
  ANNOUNCEMENT_PAGE_SIZE,
  isApiError,
  listAnnouncements,
  retireAnnouncement,
  type Announcement,
  type AnnouncementPage,
  type AnnouncementPhase
} from '../../../lib/api';
import { messageForFailure } from '../apiMessages';
import { AnnouncementComposer } from './AnnouncementComposer';
import { onOrDash, titleCase } from './formats';

type Query = { phase?: AnnouncementPhase; offset: number };
type Load = { kind: 'loading' } | { kind: 'ready'; page: AnnouncementPage } | { kind: 'failed'; message: string };

const FILTERS: readonly { label: string; phase?: AnnouncementPhase }[] = [
  { label: 'All' },
  { label: 'Scheduled', phase: 'SCHEDULED' },
  { label: 'Live', phase: 'LIVE' },
  { label: 'Expired', phase: 'EXPIRED' },
  { label: 'Retired', phase: 'RETIRED' }
];

/** What the audience narrows to, in the words the form uses. */
function audienceOf(announcement: Announcement): string {
  const { channels, plans, userIds } = announcement.audience;
  const parts = [
    channels?.length ? channels.join(', ') : null,
    plans?.length ? plans.map(titleCase).join(', ') : null,
    userIds?.length ? `${userIds.length} named` : null
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Everyone';
}

/**
 * What has been said, and to whom.
 *
 * Retiring is the only way back and it is not an undo: it stops an announcement being served from
 * that moment, and the record of who already saw it survives — which is why the service deletes it
 * softly and why this says so rather than offering "delete".
 */
export function AnnouncementsPanel() {
  const [query, setQuery] = useState<Query>({ offset: 0 });
  const [answer, setAnswer] = useState<{ asked: Query; state: Load } | null>(null);
  const [composing, setComposing] = useState<{ announcement: Announcement | null } | null>(null);
  const [retiring, setRetiring] = useState<Announcement | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const abort = new AbortController();

    listAnnouncements({ phase: query.phase, offset: query.offset, limit: ANNOUNCEMENT_PAGE_SIZE }, abort.signal)
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
            message: refused
              ? 'This account does not have access to announcements.'
              : messageForFailure(cause, 'Could not load announcements.')
          }
        });
      });

    return () => abort.abort();
  }, [query]);

  const state: Load = answer?.asked === query ? answer.state : { kind: 'loading' };
  const page = state.kind === 'ready' ? state.page : null;
  const reload = (next: Partial<Query> = {}) => setQuery((current) => ({ ...current, ...next }));

  const confirmRetire = async () => {
    if (!retiring || busy) return;
    setBusy(true);
    setNotice('');
    try {
      await retireAnnouncement(retiring.id);
      setRetiring(null);
      reload();
    } catch (cause) {
      setNotice(messageForFailure(cause, 'Could not retire this announcement.'));
    }
    setBusy(false);
  };

  if (composing) {
    return (
      <section className="uf-card uf-stack">
        <AnnouncementComposer
          editing={composing.announcement}
          onSaved={() => {
            setComposing(null);
            reload({ offset: 0 });
          }}
          onCancel={() => setComposing(null)}
        />
      </section>
    );
  }

  return (
    <section className="uf-card uf-stack">
      <div className="uf-stack-6">
        <h2>Announcements</h2>
        <p className="uf-small">
          What has been said, what is queued behind a start time, and what has stopped. Retiring one stops it being shown;
          it does not unsay it.
        </p>
      </div>

      <div className="uf-op-filter">
        <div className="uf-op-checks">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              className="uf-btn uf-btn-ghost uf-btn-xs"
              type="button"
              aria-pressed={query.phase === filter.phase}
              onClick={() => setQuery({ phase: filter.phase, offset: 0 })}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button className="uf-btn uf-btn-primary" type="button" onClick={() => setComposing({ announcement: null })}>
          New announcement
        </button>
      </div>

      {notice ? <p className="uf-small">{notice}</p> : null}
      {state.kind === 'loading' ? <p className="uf-small">Loading…</p> : null}
      {state.kind === 'failed' ? <p className="uf-small">{state.message}</p> : null}
      {page?.truncated ? (
        <p className="uf-small">This listing hit its ceiling, so it is not all of them. Narrow it with a filter.</p>
      ) : null}

      {retiring ? (
        <div className="uf-op-confirm uf-stack-6">
          <p className="uf-small">
            Retire <b>{retiring.title}</b>? It stops being shown from now on. Anybody who has already seen it has seen it,
            and the record of who did is kept.
          </p>
          <div className="uf-op-actions">
            <button className="uf-btn uf-btn-primary" type="button" onClick={confirmRetire} disabled={busy}>
              {busy ? 'Retiring…' : 'Retire it'}
            </button>
            <button className="uf-btn uf-btn-ghost" type="button" onClick={() => setRetiring(null)} disabled={busy}>
              Leave it
            </button>
          </div>
        </div>
      ) : null}

      {page ? (
        page.items.length === 0 ? (
          <p className="uf-small">Nothing here.</p>
        ) : (
          <>
            <div className="uf-op-scroll">
              <table className="uf-op-table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">State</th>
                    <th scope="col">Reads as</th>
                    <th scope="col">Audience</th>
                    <th scope="col">Runs</th>
                    <th scope="col">Seen</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {page.items.map((announcement) => (
                    <tr key={announcement.id}>
                      <td data-wrap="">{announcement.title}</td>
                      <td>{titleCase(announcement.phase)}</td>
                      <td>{titleCase(announcement.severity)}</td>
                      <td data-wrap="">{audienceOf(announcement)}</td>
                      <td>
                        {announcement.startsAt ? onOrDash(announcement.startsAt) : 'At once'} →{' '}
                        {announcement.endsAt ? onOrDash(announcement.endsAt) : 'No end'}
                      </td>
                      <td>
                        {announcement.seenCount}
                        {announcement.dismissedCount ? ` (${announcement.dismissedCount} put away)` : ''}
                      </td>
                      <td>
                        <span className="uf-op-row-actions">
                          <button
                            className="uf-btn uf-btn-ghost uf-btn-xs"
                            type="button"
                            onClick={() => setComposing({ announcement })}
                          >
                            Edit
                          </button>
                          {announcement.phase !== 'RETIRED' ? (
                            <button className="uf-btn uf-btn-ghost uf-btn-xs" type="button" onClick={() => setRetiring(announcement)}>
                              Retire
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
                  onClick={() => reload({ offset: Math.max(0, query.offset - ANNOUNCEMENT_PAGE_SIZE) })}
                  disabled={query.offset === 0}
                >
                  Previous
                </button>
                <button
                  className="uf-btn uf-btn-ghost"
                  type="button"
                  onClick={() => reload({ offset: query.offset + ANNOUNCEMENT_PAGE_SIZE })}
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
