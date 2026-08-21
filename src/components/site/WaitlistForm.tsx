'use client';

import { useState } from 'react';
import { isApiError, joinWaitlist } from '../../lib/api';
import { messageForFailure } from './apiMessages';

type State = { status: 'idle' | 'sending' } | { status: 'done'; message: string } | { status: 'failed'; message: string };

/**
 * Email capture, posted to the service.
 *
 * The endpoint answers the same way whether or not the address is already recorded, so the success
 * message must not imply either — saying "you are already on the list" would report who is.
 */
export function WaitlistForm({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>({ status: 'idle' });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.status === 'sending') return;

    setState({ status: 'sending' });
    try {
      await joinWaitlist({ email: email.trim(), source });
      setState({ status: 'done', message: 'Thanks — we will let you know.' });
      setEmail('');
    } catch (cause) {
      const invalid = isApiError(cause) && cause.outcome === 'request';
      setState({ status: 'failed', message: messageForFailure(cause, invalid ? 'That address does not look right.' : 'Could not sign you up. Try again.') });
    }
  };

  const sending = state.status === 'sending';

  return (
    <form className="uf-stack" onSubmit={submit} noValidate>
      <label className="uf-small" htmlFor="uf-waitlist-email">
        Email address
      </label>
      <input
        id="uf-waitlist-email"
        className="uf-field"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        disabled={sending}
        onChange={(event) => {
          setEmail(event.target.value);
          // Clear a previous result once they start correcting it, so stale text is not read as current.
          setState({ status: 'idle' });
        }}
        placeholder="you@example.com"
      />
      <div className="uf-cta-row">
        <button type="submit" className="uf-btn uf-btn-primary" disabled={sending || email.trim().length === 0}>
          {sending ? 'Sending…' : 'Keep me posted'}
        </button>
      </div>
      <p className="uf-small" role="status" aria-live="polite">
        {state.status === 'done' || state.status === 'failed' ? state.message : ''}
      </p>
    </form>
  );
}
