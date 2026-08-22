'use client';

import { useEffect, useState } from 'react';
import { liveDrops, type Drop } from '../../lib/api';
import { plans } from './plansContent';
import { messageForFailure } from './apiMessages';
import { StoreLink } from './SiteChrome';
import { timeLeft, useNow } from './useNow';

type Load = { kind: 'loading' } | { kind: 'ready'; drops: Drop[] } | { kind: 'failed'; message: string };

/** The tier's name as this site writes it, so a campaign does not become a second description of one. */
function tierName(id: string): string {
  return plans.find((plan) => plan.id === id)?.name ?? id;
}

/**
 * Paragraphs, and deliberately nothing else.
 *
 * The copy arrives as markdown and this renders blank-line-separated blocks as paragraphs without
 * interpreting anything inside them. Interpreting it would mean turning text somebody typed into
 * markup, and the only safe way to do that needs a parser this site does not carry.
 */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block, index) => (
          <p className="uf-small" key={index}>
            {block}
          </p>
        ))}
    </>
  );
}

function DropCard({ drop, now }: { drop: Drop; now: number }) {
  const left = timeLeft(drop.endsAt, now);

  return (
    <article className="uf-card uf-stack">
      <div className="uf-stack-6">
        <span className="uf-chip uf-chip-plan">{tierName(drop.rewardPlan)}</span>
        <h2>{drop.title}</h2>
      </div>

      <Paragraphs text={drop.bodyMd} />

      <div className="uf-drop-facts">
        {/* The clock is the content: a window with no visible end is just a page. It renders only
            once the browser has a time, so nothing here was baked into the HTML. */}
        <span className="uf-drop-clock">{left ?? ' '}</span>
        <span className="uf-small">
          {tierName(drop.rewardPlan)} for {drop.rewardDays} {drop.rewardDays === 1 ? 'day' : 'days'}, counted from when you take
          it.
        </span>
        {drop.remaining !== null ? (
          <span className="uf-small">{drop.remaining > 0 ? `${drop.remaining} left` : 'All taken'}</span>
        ) : null}
        {drop.requiresAccount ? <span className="uf-small">Needs an account.</span> : null}
      </div>

      {/* No button that takes it. What you are given attaches to your copy of the extension, and a
          web page does not have one — so this points at the place where it can actually happen
          instead of offering something that would fail. */}
      <p className="uf-small">Open UploadFlow while this is running and it is there to take.</p>
      <StoreLink className="uf-btn uf-btn-primary">Add to Chrome</StoreLink>
    </article>
  );
}

/**
 * What is running, and when it stops.
 *
 * Most visits land outside a window, so *nothing right now* is a designed answer rather than an
 * empty page — and it is deliberately not the same as *we could not find out*, which is a fault and
 * says so.
 */
export function DropsPanel() {
  const [load, setLoad] = useState<Load>({ kind: 'loading' });
  const now = useNow();

  useEffect(() => {
    const abort = new AbortController();

    liveDrops(abort.signal)
      .then((drops) => {
        if (!abort.signal.aborted) setLoad({ kind: 'ready', drops });
      })
      .catch((cause: unknown) => {
        if (!abort.signal.aborted) setLoad({ kind: 'failed', message: messageForFailure(cause, 'Could not check what is running.') });
      });

    return () => abort.abort();
  }, []);

  if (load.kind === 'loading') return <p className="uf-small">Checking what is running…</p>;

  if (load.kind === 'failed') {
    return (
      <div className="uf-card uf-stack">
        <h2>Could not check</h2>
        <p className="uf-small">{load.message}</p>
        <p className="uf-small">This is not the same as nothing running — we could not find out either way.</p>
      </div>
    );
  }

  if (load.drops.length === 0) {
    return (
      <div className="uf-card uf-stack">
        <h2>Nothing running right now</h2>
        <p className="uf-small">
          Drops open for a while and then close. There is nothing open at the moment, which is the usual state — they are
          occasional by design rather than always on.
        </p>
        <p className="uf-small">Having UploadFlow installed is how you find out about the next one.</p>
        <StoreLink className="uf-btn uf-btn-primary">Add to Chrome</StoreLink>
      </div>
    );
  }

  return (
    <>
      {load.drops.map((drop) => (
        <DropCard drop={drop} key={drop.slug} now={now} />
      ))}
    </>
  );
}
