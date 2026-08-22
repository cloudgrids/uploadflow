'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { isApiError, OPERATOR_PAGE_SIZE, type OperatorPage, type OperatorQuery } from '../../../lib/api';
import { messageForFailure } from '../apiMessages';

export interface Column<T> {
  key: string;
  head: string;
  cell: (row: T) => ReactNode;
  /** Long, unbreakable values — an address, an identifier — that must be allowed to wrap anywhere. */
  wrap?: boolean;
}

type Load<T> = { kind: 'loading' } | { kind: 'ready'; page: OperatorPage<T> } | { kind: 'failed'; message: string };

/**
 * A listing, its filter, and its paging.
 *
 * The refusal case is the one worth reading. A listing this account may not see comes back as a
 * refusal from the API, and that is reported as what it is rather than as an error — it is the
 * proof that the screen is a convenience and the service is the control. It is also why nothing
 * here offers a way to try again with different credentials: there is nothing wrong to retry.
 */
export function OperatorListing<T>({
  title,
  note,
  searchHint,
  columns,
  rowKey,
  load
}: {
  title: string;
  note: string;
  searchHint: string;
  columns: readonly Column<T>[];
  rowKey: (row: T) => string;
  load: (query: OperatorQuery, signal?: AbortSignal) => Promise<OperatorPage<T>>;
}) {
  const [typed, setTyped] = useState('');
  const [query, setQuery] = useState<OperatorQuery>({ offset: 0, limit: OPERATOR_PAGE_SIZE });
  // The answer is stored with the question it answered. Loading is then derived from the two not
  // matching, rather than set from inside the effect — which is the cascading render the repo's
  // lint rule forbids, and which would also blink the table on every re-render for no reason.
  const [answer, setAnswer] = useState<{ asked: OperatorQuery; state: Load<T> } | null>(null);

  useEffect(() => {
    const abort = new AbortController();

    load(query, abort.signal)
      .then((page) => {
        if (!abort.signal.aborted) setAnswer({ asked: query, state: { kind: 'ready', page } });
      })
      .catch((cause: unknown) => {
        if (abort.signal.aborted) return;
        // A refusal here is an answer about the account, not a fault: the API states who may read
        // this, and it has just said not you.
        const refused = isApiError(cause) && cause.status === 403;
        setAnswer({
          asked: query,
          state: {
            kind: 'failed',
            message: refused
              ? 'This account does not have access to this listing.'
              : messageForFailure(cause, 'Could not load this listing.')
          }
        });
      });

    return () => abort.abort();
  }, [load, query]);

  const state: Load<T> = answer?.asked === query ? answer.state : { kind: 'loading' };

  const page = state.kind === 'ready' ? state.page : null;
  const limit = page?.limit ?? OPERATOR_PAGE_SIZE;
  const offset = page?.offset ?? 0;
  const total = page?.total ?? 0;
  const shownTo = Math.min(offset + (page?.items.length ?? 0), total);

  const move = (by: number) => () => setQuery((q) => ({ ...q, offset: Math.max(0, (q.offset ?? 0) + by * limit) }));

  return (
    <section className="uf-op-section">
      {/* Title, then how many, then the note. The count is the first thing an operator wants and was
          previously only findable at the bottom of the table, next to the paging. */}
      <header className="uf-op-head">
        <div className="uf-op-head-text">
          <h2>
            {title}
            {page ? <span className="uf-op-count">{total.toLocaleString()}</span> : null}
          </h2>
          <p className="uf-small">{note}</p>
        </div>
      </header>

      <form
        className="uf-op-filter"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery({ offset: 0, limit, q: typed });
        }}
      >
        <label className="uf-op-search">
          <span className="uf-small">{searchHint}</span>
          <input type="search" value={typed} onChange={(event) => setTyped(event.target.value)} spellCheck={false} />
        </label>
        <button className="uf-btn uf-btn-ghost" type="submit">
          Search
        </button>
      </form>

      {state.kind === 'loading' ? <p className="uf-small">Loading…</p> : null}
      {state.kind === 'failed' ? <p className="uf-small">{state.message}</p> : null}

      {page ? (
        page.items.length === 0 ? (
          <p className="uf-small">Nothing matches that.</p>
        ) : (
          <>
            <div className="uf-op-scroll">
              <table className="uf-op-table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} scope="col">
                        {column.head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.items.map((row) => (
                    <tr key={rowKey(row)}>
                      {columns.map((column) => (
                        <td key={column.key} data-wrap={column.wrap ? '' : undefined}>
                          {column.cell(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="uf-op-page">
              <span className="uf-small">
                {offset + 1}–{shownTo} of {total}
              </span>
              <span className="uf-op-page-buttons">
                <button className="uf-btn uf-btn-ghost" type="button" onClick={move(-1)} disabled={offset === 0}>
                  Previous
                </button>
                <button className="uf-btn uf-btn-ghost" type="button" onClick={move(1)} disabled={shownTo >= total}>
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
