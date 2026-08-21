'use client';

import { useState } from 'react';
import { isApiError, signup, startSession } from '../../lib/api';
import { messageForFailure } from './apiMessages';
import { PASSWORD_HINT, describePassword } from './passwordRules';

/** What the service accepts for a display name. Checked here so it is caught before sending. */
const NAME_LIMIT = 120;

type State =
  | { kind: 'form' }
  | { kind: 'creating' }
  | { kind: 'done'; email: string }
  | { kind: 'taken' }
  | { kind: 'failed'; message: string };

/**
 * Creating an account.
 *
 * Sign-up answers with a session, so somebody who completes this is signed in and does not have to
 * sign in again straight away. A confirmation email is sent separately; nothing here waits on it,
 * because the account already works.
 */
export function SignUpPanel() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState<State>({ kind: 'form' });

  const passwordProblem = describePassword(password);
  const mismatch = confirm.length > 0 && confirm !== password;
  const nameTooLong = fullName.trim().length > NAME_LIMIT;
  const complete =
    fullName.trim().length > 0 && !nameTooLong && email.trim().length > 0 && password.length > 0 && !passwordProblem && !mismatch;
  const creating = state.kind === 'creating';

  const edit = (set: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    set(event.target.value);
    setState({ kind: 'form' });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creating || !complete) return;

    const address = email.trim();
    setState({ kind: 'creating' });
    try {
      startSession(await signup({ email: address, password, fullName: fullName.trim() }));
      setState({ kind: 'done', email: address });
      setPassword('');
      setConfirm('');
    } catch (cause) {
      // Everything in the form already passed the rules the service applies, so a refusal of the
      // request itself is the address being taken — the one remaining thing it can be.
      if (isApiError(cause) && cause.outcome === 'request') {
        setState({ kind: 'taken' });
        return;
      }
      setState({ kind: 'failed', message: messageForFailure(cause, 'Could not create the account. Try again.') });
    }
  };

  if (state.kind === 'done') {
    return (
      <div className="uf-stack">
        <h2>Your account is ready.</h2>
        <p className="uf-lede">You are signed in already, so there is nothing else to do here.</p>
        <p className="uf-small">
          We have sent a message to {state.email} to confirm the address. You can do that whenever it suits you.
        </p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-primary" href="/account">
            Go to your account <span className="uf-arw">&rarr;</span>
          </a>
        </div>
      </div>
    );
  }

  if (state.kind === 'taken') {
    return (
      <div className="uf-stack">
        <h2>That address already has an account.</h2>
        <p className="uf-lede">Sign in instead — and if the password has slipped your mind, you can ask for a new one from there.</p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-primary" href="/sign-in">
            Sign in <span className="uf-arw">&rarr;</span>
          </a>
          <button type="button" className="uf-btn uf-btn-ghost" onClick={() => setState({ kind: 'form' })}>
            Use a different address
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="uf-stack" onSubmit={submit} noValidate>
      <label className="uf-small" htmlFor="uf-signup-name">
        Your name
      </label>
      <input
        id="uf-signup-name"
        className="uf-field"
        type="text"
        name="name"
        autoComplete="name"
        required
        maxLength={NAME_LIMIT}
        value={fullName}
        disabled={creating}
        onChange={edit(setFullName)}
      />

      <label className="uf-small" htmlFor="uf-signup-email">
        Email address
      </label>
      <input
        id="uf-signup-email"
        className="uf-field"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        disabled={creating}
        onChange={edit(setEmail)}
        placeholder="you@example.com"
      />

      <label className="uf-small" htmlFor="uf-signup-password">
        Password
      </label>
      <input
        id="uf-signup-password"
        className="uf-field"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        value={password}
        disabled={creating}
        onChange={edit(setPassword)}
      />
      <p className="uf-small">{PASSWORD_HINT}</p>

      <label className="uf-small" htmlFor="uf-signup-confirm">
        Password again
      </label>
      <input
        id="uf-signup-confirm"
        className="uf-field"
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        required
        value={confirm}
        disabled={creating}
        onChange={edit(setConfirm)}
      />

      <div className="uf-cta-row">
        <button type="submit" className="uf-btn uf-btn-primary" disabled={creating || !complete}>
          {creating ? 'Creating…' : 'Create account'}
        </button>
      </div>

      <p className="uf-small" role="status" aria-live="polite">
        {passwordProblem ??
          (mismatch
            ? 'The two entries do not match.'
            : nameTooLong
              ? `A name can be up to ${NAME_LIMIT} characters.`
              : state.kind === 'failed'
                ? state.message
                : '')}
      </p>

      <p className="uf-small">
        Already have an account? <a href="/sign-in">Sign in</a>.
      </p>
    </form>
  );
}
