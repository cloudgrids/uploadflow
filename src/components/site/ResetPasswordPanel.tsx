'use client';

import { useState } from 'react';
import { clearSession, isApiError, requestPasswordReset, resetPassword } from '../../lib/api';
import { messageForFailure } from './apiMessages';
import { useOneTimeToken } from './useOneTimeToken';

/**
 * The rule the service enforces, restated so a password can be checked before it is sent.
 *
 * Two reasons to duplicate it rather than let the service decide. It tells somebody what is wrong
 * while they are still typing, and — because the service answers a bad password and a bad link with
 * the same status — a password that passes here makes a rejection almost certainly the link, which
 * is what lets the two be reported apart.
 *
 * Note the character set is closed: symbols outside this set are rejected, not merely uncounted.
 */
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const ALLOWED_SYMBOLS = '@ $ ! % * ? &';

type State =
  | { kind: 'form' }
  | { kind: 'saving' }
  | { kind: 'done' }
  | { kind: 'rejected' }
  | { kind: 'failed'; message: string };

function describePassword(value: string): string | null {
  if (value.length === 0) return null;
  if (value.length < 8) return 'At least 8 characters.';
  if (!/[a-z]/.test(value)) return 'Add a lowercase letter.';
  if (!/[A-Z]/.test(value)) return 'Add an uppercase letter.';
  if (!/\d/.test(value)) return 'Add a number.';
  if (!/[@$!%*?&]/.test(value)) return `Add one of ${ALLOWED_SYMBOLS}.`;
  if (!STRONG_PASSWORD.test(value)) return `Only letters, numbers and ${ALLOWED_SYMBOLS} can be used.`;
  return null;
}

export function ResetPasswordPanel() {
  const { token, hydrated } = useOneTimeToken();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState<State>({ kind: 'form' });

  const problem = describePassword(password);
  const mismatch = confirm.length > 0 && confirm !== password;
  const ready = password.length > 0 && !problem && !mismatch;
  const saving = state.kind === 'saving';

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !ready || !token) return;

    setState({ kind: 'saving' });
    try {
      await resetPassword({ token, password });
      // Every session was just revoked, including this browser's. Holding a dead token here would
      // show a signed-in view that fails on the next call.
      clearSession();
      setState({ kind: 'done' });
      setPassword('');
      setConfirm('');
    } catch (cause) {
      // The password passed the same rule the service applies, so a rejection here is the link.
      if (isApiError(cause) && cause.outcome === 'request') {
        setState({ kind: 'rejected' });
        return;
      }
      setState({ kind: 'failed', message: messageForFailure(cause, 'Could not change the password. Try again.') });
    }
  };

  if (!hydrated) return <p className="uf-lede">Loading…</p>;

  if (state.kind === 'done') {
    return (
      <div className="uf-stack">
        <h2>Your password has been changed.</h2>
        <p className="uf-lede">Sign in with the new one.</p>
        <p className="uf-limit">
          <b>You have been signed out everywhere.</b> Changing a password ends every session on every device, so anything still signed in
          with the old password will ask for the new one.
        </p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-primary" href="/sign-in">
            Sign in <span className="uf-arw">&rarr;</span>
          </a>
        </div>
      </div>
    );
  }

  if (!token) return <RequestNewLink title="This link is incomplete." lede="It is missing the part that identifies your account, which usually means it was cut short between the email and the browser. Open it straight from the message, or ask for a fresh one below." />;

  if (state.kind === 'rejected') {
    return <RequestNewLink title="This link is no longer valid." lede="Reset links work once and expire after a while, and asking for a new one retires the old. Your password has not been changed. Ask for a fresh link below." />;
  }

  return (
    <form className="uf-stack" onSubmit={submit} noValidate>
      <h2>Choose a new password.</h2>
      <p className="uf-small">
        At least 8 characters, with an uppercase letter, a lowercase letter, a number, and one of {ALLOWED_SYMBOLS}.
      </p>

      <label className="uf-small" htmlFor="uf-reset-password">
        New password
      </label>
      <input
        id="uf-reset-password"
        className="uf-field"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        disabled={saving}
        onChange={(event) => {
          setPassword(event.target.value);
          setState({ kind: 'form' });
        }}
      />

      <label className="uf-small" htmlFor="uf-reset-confirm">
        New password again
      </label>
      <input
        id="uf-reset-confirm"
        className="uf-field"
        type="password"
        autoComplete="new-password"
        required
        value={confirm}
        disabled={saving}
        onChange={(event) => {
          setConfirm(event.target.value);
          setState({ kind: 'form' });
        }}
      />

      <p className="uf-small" role="status" aria-live="polite">
        {problem ?? (mismatch ? 'The two entries do not match.' : state.kind === 'failed' ? state.message : '')}
      </p>

      <p className="uf-limit">
        <b>This signs you out everywhere.</b> Every session on every device ends when the password changes.
      </p>

      <div className="uf-cta-row">
        <button type="submit" className="uf-btn uf-btn-primary" disabled={saving || !ready}>
          {saving ? 'Saving…' : 'Change password'}
        </button>
      </div>
    </form>
  );
}

/**
 * Asking for a fresh link, shown wherever the one in hand cannot be used.
 *
 * The service answers the same way whether or not the address has an account, so the confirmation
 * below must not say which — a message that differed would report who has an account here.
 */
function RequestNewLink({ title, lede }: { title: string; lede: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>({ kind: 'form' });

  const sending = state.kind === 'saving';

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    setState({ kind: 'saving' });
    try {
      await requestPasswordReset(email.trim());
      setState({ kind: 'done' });
    } catch (cause) {
      const invalid = isApiError(cause) && cause.outcome === 'request';
      setState({
        kind: 'failed',
        message: messageForFailure(cause, invalid ? 'That address does not look right.' : 'Could not send the link. Try again.')
      });
    }
  };

  return (
    <div className="uf-stack">
      <h2>{title}</h2>
      <p className="uf-lede">{lede}</p>

      {state.kind === 'done' ? (
        <p className="uf-lede">If that address has an account, a new reset link is on its way. It replaces any earlier one.</p>
      ) : (
        <form className="uf-stack" onSubmit={submit} noValidate>
          <label className="uf-small" htmlFor="uf-reset-email">
            Email address
          </label>
          <input
            id="uf-reset-email"
            className="uf-field"
            type="email"
            autoComplete="email"
            required
            value={email}
            disabled={sending}
            onChange={(event) => {
              setEmail(event.target.value);
              setState({ kind: 'form' });
            }}
            placeholder="you@example.com"
          />
          <div className="uf-cta-row">
            <button type="submit" className="uf-btn uf-btn-primary" disabled={sending || email.trim().length === 0}>
              {sending ? 'Sending…' : 'Email me a new link'}
            </button>
          </div>
          <p className="uf-small" role="status" aria-live="polite">
            {state.kind === 'failed' ? state.message : ''}
          </p>
        </form>
      )}
    </div>
  );
}
