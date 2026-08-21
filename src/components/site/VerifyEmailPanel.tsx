'use client';

import { useEffect, useState } from 'react';
import { isApiError, verifyEmail } from '../../lib/api';
import { messageForFailure } from './apiMessages';
import { useOneTimeToken } from './useOneTimeToken';

/**
 * Only the outcome of the call is state. Whether a token was present is derived from the URL, so it
 * needs no `setState` in an effect — the rule this repo enforces, and the right shape anyway.
 */
type State = { kind: 'working' } | { kind: 'done' } | { kind: 'rejected' } | { kind: 'failed'; message: string };

/**
 * Confirms an email address from a link.
 *
 * The token is spent by opening the page, so there is nothing to submit and no button to press —
 * arriving here *is* the action.
 */
export function VerifyEmailPanel() {
  const { token, hydrated } = useOneTimeToken();
  const [state, setState] = useState<State>({ kind: 'working' });

  useEffect(() => {
    if (!hydrated || !token) return;

    let cancelled = false;
    verifyEmail(token)
      .then(() => {
        if (!cancelled) setState({ kind: 'done' });
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        // The service answers the same way for a link that has expired, one already used, and one
        // it does not recognise, so this cannot be split into those cases honestly.
        if (isApiError(cause) && cause.outcome === 'request') {
          setState({ kind: 'rejected' });
          return;
        }
        setState({ kind: 'failed', message: messageForFailure(cause, 'Could not confirm the address. Try the link again.') });
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, token]);

  if (!hydrated) return <p className="uf-lede">Loading…</p>;

  if (!token) {
    return (
      <div className="uf-stack">
        <h2>This link is incomplete.</h2>
        <p className="uf-lede">
          It is missing the part that identifies your address, which usually means it was cut short somewhere between the email and the
          browser. Open it straight from the message, or copy the whole address across in one piece.
        </p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-ghost" href="/sign-in">
            Go to sign-in
          </a>
        </div>
      </div>
    );
  }

  if (state.kind === 'working') {
    return <p className="uf-lede">Confirming your email address…</p>;
  }

  if (state.kind === 'done') {
    return (
      <div className="uf-stack">
        <h2>Your email address is confirmed.</h2>
        <p className="uf-lede">Nothing else is needed. You can sign in whenever you want to manage your subscription.</p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-primary" href="/sign-in">
            Sign in <span className="uf-arw">&rarr;</span>
          </a>
        </div>
      </div>
    );
  }


  if (state.kind === 'rejected') {
    return (
      <div className="uf-stack">
        <h2>This link is no longer valid.</h2>
        <p className="uf-lede">
          Confirmation links work once and expire after a while, and asking for a new one retires the old. So this is either a link that has
          been used already or one that has run out.
        </p>
        <p className="uf-limit">
          <b>If you have already confirmed this address, you are done.</b> Nothing here needs doing again — sign in as normal. Request a new
          link only if signing in tells you the address is still unconfirmed.
        </p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-primary" href="/sign-in">
            Sign in <span className="uf-arw">&rarr;</span>
          </a>
          <a className="uf-btn uf-btn-ghost" href="/support">
            Get help
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="uf-stack">
      <h2>That did not go through.</h2>
      <p className="uf-lede" role="status" aria-live="polite">
        {state.message}
      </p>
      <p className="uf-small">Your link has not been used up, so opening it again should work.</p>
      <div className="uf-cta-row">
        <a className="uf-btn uf-btn-ghost" href="/support">
          Get help
        </a>
      </div>
    </div>
  );
}
