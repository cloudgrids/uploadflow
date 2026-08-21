'use client';

import { useEffect, useState } from 'react';
import { isApiError, mySubscription, openBillingPortal, signOut, useSession, type MySubscription } from '../../lib/api';
import { StatusLine } from './SiteChrome';
import { messageForFailure } from './apiMessages';

type Load = { kind: 'loading' } | { kind: 'ready'; data: MySubscription } | { kind: 'failed'; message: string };

/** Title case for a plan or status identifier. The service sends them lowercase. */
function label(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** A renewal date, or nothing. Rendered in the reader's own locale rather than a fixed one. */
function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const at = new Date(iso);
  return Number.isNaN(at.getTime()) ? null : at.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Account state, and the two things you can do with it.
 *
 * Deliberately states *what* the account is on and nothing about what that opens — the plans page
 * is where the offer is described, and repeating it here would be a second copy to keep in step.
 */
export function AccountPanel() {
  const session = useSession();
  const [load, setLoad] = useState<Load>({ kind: 'loading' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    mySubscription()
      .then((data) => {
        if (!cancelled) setLoad({ kind: 'ready', data });
      })
      .catch((cause: unknown) => {
        if (!cancelled) setLoad({ kind: 'failed', message: messageForFailure(cause, 'Could not load your account.') });
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!session) {
    return (
      <div className="uf-stack">
        <p className="uf-lede">You are not signed in.</p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-primary" href="/sign-in">
            Sign in <span className="uf-arw">→</span>
          </a>
        </div>
      </div>
    );
  }

  const manage = async () => {
    if (busy) return;
    setBusy(true);
    setNotice('');
    try {
      window.location.assign(await openBillingPortal());
    } catch (cause) {
      // An account that has never been billed has no portal; that is an answer, not a fault.
      const never = isApiError(cause) && cause.status === 404;
      setNotice(messageForFailure(cause, never ? 'There is nothing to manage yet.' : 'Could not open the billing portal.'));
      setBusy(false);
    }
  };

  const leave = async () => {
    if (busy) return;
    setBusy(true);
    await signOut();
    setBusy(false);
  };

  return (
    <div className="uf-stack">
      {load.kind === 'loading' ? <p className="uf-lede">Loading your account…</p> : null}
      {load.kind === 'failed' ? <p className="uf-lede">{load.message}</p> : null}

      {load.kind === 'ready' ? (
        <div className="uf-card">
          <StatusLine label="Plan" value={label(load.data.plan)} />
          {load.data.subscription ? <StatusLine label="Status" value={label(load.data.subscription.status)} /> : null}
          {load.data.subscription && formatDate(load.data.subscription.currentPeriodEnd) ? (
            <StatusLine
              label={load.data.subscription.cancelAtPeriodEnd ? 'Ends' : 'Renews'}
              value={formatDate(load.data.subscription.currentPeriodEnd) as string}
            />
          ) : null}
        </div>
      ) : null}

      <div className="uf-cta-row">
        <button type="button" className="uf-btn uf-btn-primary" onClick={manage} disabled={busy || load.kind !== 'ready'}>
          Manage subscription
        </button>
        <button type="button" className="uf-btn uf-btn-ghost" onClick={leave} disabled={busy}>
          Sign out
        </button>
      </div>

      <p className="uf-small" role="status" aria-live="polite">
        {notice}
      </p>
    </div>
  );
}
