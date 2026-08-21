'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { consumeMagicLink, isApiError, requestMagicLink, startSession } from '../../lib/api';
import { messageForFailure } from './apiMessages';

type Phase =
  | { kind: 'form' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'exchanging' }
  | { kind: 'signedIn' }
  | { kind: 'failed'; message: string };

/**
 * Sign-in, and the place a sign-in link lands.
 *
 * Two jobs. Without a token it asks for an address and requests a link. With one — arriving from an
 * emailed link, or from a completed provider sign-in — it exchanges that token for a session.
 *
 * The token is single-use, so the exchange runs once and only once. Re-running it on a re-render
 * would spend a token that has already been spent and report a working sign-in as broken.
 */
export function SignInPanel() {
  const params = useSearchParams();
  const token = params.get('token');
  const failedProvider = params.get('error') === 'oauth';

  const [phase, setPhase] = useState<Phase>(() =>
    token ? { kind: 'exchanging' } : failedProvider ? { kind: 'failed', message: 'That sign-in did not complete. Try again.' } : { kind: 'form' }
  );
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    consumeMagicLink(token)
      .then((tokens) => {
        if (cancelled) return;
        startSession(tokens);
        setPhase({ kind: 'signedIn' });
        // Clear the token from the address bar so a reload does not retry a spent one.
        window.history.replaceState(null, '', '/sign-in');
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setPhase({ kind: 'failed', message: messageForFailure(cause, 'That link has expired or has already been used.') });
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase.kind === 'sending') return;

    setPhase({ kind: 'sending' });
    try {
      await requestMagicLink(email.trim());
      setPhase({ kind: 'sent' });
    } catch (cause) {
      const invalid = isApiError(cause) && cause.outcome === 'request';
      setPhase({ kind: 'failed', message: messageForFailure(cause, invalid ? 'That address does not look right.' : 'Could not send the link. Try again.') });
    }
  };

  if (phase.kind === 'exchanging') {
    return <p className="uf-lede">Signing you in…</p>;
  }

  if (phase.kind === 'signedIn') {
    return (
      <div className="uf-stack">
        <p className="uf-lede">You are signed in.</p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-primary" href="/account">
            Go to your account <span className="uf-arw">→</span>
          </a>
        </div>
      </div>
    );
  }

  if (phase.kind === 'sent') {
    return (
      <div className="uf-stack">
        <p className="uf-lede">Check your email for a sign-in link.</p>
        <p className="uf-small">It works once, and only for a short while. Request another if it expires.</p>
      </div>
    );
  }

  const sending = phase.kind === 'sending';

  return (
    <form className="uf-stack" onSubmit={submit} noValidate>
      <label className="uf-small" htmlFor="uf-signin-email">
        Email address
      </label>
      <input
        id="uf-signin-email"
        className="uf-field"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        disabled={sending}
        onChange={(event) => {
          setEmail(event.target.value);
          setPhase({ kind: 'form' });
        }}
        placeholder="you@example.com"
      />
      <div className="uf-cta-row">
        <button type="submit" className="uf-btn uf-btn-primary" disabled={sending || email.trim().length === 0}>
          {sending ? 'Sending…' : 'Email me a link'}
        </button>
      </div>
      <p className="uf-small" role="status" aria-live="polite">
        {phase.kind === 'failed' ? phase.message : ''}
      </p>
    </form>
  );
}
