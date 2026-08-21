'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  apiUrl,
  consumeMagicLink,
  isApiError,
  login,
  oauthProviders,
  requestMagicLink,
  requestPasswordReset,
  startSession
} from '../../lib/api';
import { messageForFailure } from './apiMessages';

type Phase =
  | { kind: 'form' }
  | { kind: 'busy' }
  | { kind: 'linkSent' }
  | { kind: 'resetSent' }
  | { kind: 'exchanging' }
  | { kind: 'signedIn' }
  | { kind: 'failed'; message: string };

/** Password, emailed link, or a forgotten password. One panel, because they all start with an address. */
type Mode = 'password' | 'link' | 'forgot';

const MODE_LABEL: Record<Mode, string> = {
  password: 'Sign in',
  link: 'Email me a link',
  forgot: 'Email me a reset link'
};

/**
 * The service returns providers upper case (`GOOGLE`). Nothing in this design system is upper case,
 * and `globals.css` re-cases nothing, so the label has to be built rather than passed through. The
 * URL still uses the value as given — the route resolves either case, but echoing what was sent is
 * the safer habit.
 */
function providerLabel(provider: string): string {
  return provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase();
}

/**
 * Sign-in, and the place a sign-in link lands.
 *
 * Two jobs. Without a token it signs somebody in — by password, by emailed link, or via a provider —
 * and can also start a password reset. With a token, arriving from an emailed link or a completed
 * provider sign-in, it exchanges that token for a session.
 *
 * The token is single-use, so the exchange runs once and only once. Re-running it on a re-render
 * would spend a token that has already been spent and report a working sign-in as broken.
 */
export function SignInPanel() {
  const params = useSearchParams();
  const token = params.get('token');
  const failedProvider = params.get('error') === 'oauth';

  const [phase, setPhase] = useState<Phase>(() =>
    token
      ? { kind: 'exchanging' }
      : failedProvider
        ? { kind: 'failed', message: 'That sign-in did not complete. Try again, or use your password.' }
        : { kind: 'form' }
  );
  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [providers, setProviders] = useState<string[]>([]);

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

  useEffect(() => {
    // Only offer what this deployment actually has keys for; asking avoids a button that dead-ends.
    let cancelled = false;
    oauthProviders()
      .then((result) => {
        if (!cancelled) setProviders(result.providers ?? []);
      })
      .catch(() => {
        // A provider list that cannot be fetched is not worth reporting: password and link still work.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const busy = phase.kind === 'busy';
  const ready = mode === 'password' ? email.trim().length > 0 && password.length > 0 : email.trim().length > 0;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || !ready) return;

    const address = email.trim();
    setPhase({ kind: 'busy' });
    try {
      if (mode === 'password') {
        startSession(await login({ email: address, password }));
        setPhase({ kind: 'signedIn' });
        setPassword('');
        return;
      }
      if (mode === 'link') {
        await requestMagicLink(address);
        setPhase({ kind: 'linkSent' });
        return;
      }
      await requestPasswordReset(address);
      setPhase({ kind: 'resetSent' });
    } catch (cause) {
      // A refused password is the ordinary case here, and the service cannot tell a wrong password
      // from an unknown address — deliberately, since saying which would report who has an account.
      if (mode === 'password' && isApiError(cause) && cause.outcome === 'auth') {
        setPhase({ kind: 'failed', message: 'That email and password do not match an account.' });
        return;
      }
      const invalid = isApiError(cause) && cause.outcome === 'request';
      setPhase({ kind: 'failed', message: messageForFailure(cause, invalid ? 'That address does not look right.' : 'Could not sign you in. Try again.') });
    }
  };

  if (phase.kind === 'exchanging') return <p className="uf-lede">Signing you in…</p>;

  if (phase.kind === 'signedIn') {
    return (
      <div className="uf-stack">
        <p className="uf-lede">You are signed in.</p>
        <div className="uf-cta-row">
          <a className="uf-btn uf-btn-primary" href="/account">
            Go to your account <span className="uf-arw">&rarr;</span>
          </a>
        </div>
      </div>
    );
  }

  if (phase.kind === 'linkSent') {
    return (
      <div className="uf-stack">
        <p className="uf-lede">Check your email for a sign-in link.</p>
        <p className="uf-small">It works once, and only for a short while. Request another if it expires.</p>
      </div>
    );
  }

  if (phase.kind === 'resetSent') {
    return (
      <div className="uf-stack">
        <p className="uf-lede">Check your email for a link to set a new password.</p>
        <p className="uf-small">
          If that address has an account, the link is on its way. It works once, and replaces any earlier one.
        </p>
      </div>
    );
  }

  const change = (set: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    set(event.target.value);
    setPhase({ kind: 'form' });
  };

  const pick = (next: Mode) => () => {
    setMode(next);
    setPhase({ kind: 'form' });
  };

  return (
    <div className="uf-stack">
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
          disabled={busy}
          onChange={change(setEmail)}
          placeholder="you@example.com"
        />

        {mode === 'password' ? (
          <>
            <label className="uf-small" htmlFor="uf-signin-password">
              Password
            </label>
            <input
              id="uf-signin-password"
              className="uf-field"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              disabled={busy}
              onChange={change(setPassword)}
            />
          </>
        ) : null}

        <div className="uf-cta-row">
          <button type="submit" className="uf-btn uf-btn-primary" disabled={busy || !ready}>
            {busy ? 'Working…' : MODE_LABEL[mode]}
          </button>
        </div>

        <p className="uf-small" role="status" aria-live="polite">
          {phase.kind === 'failed' ? phase.message : ''}
        </p>
      </form>

      {/* Plain buttons, not a second form: switching is a change of mind, not a submission. */}
      <p className="uf-small">
        {mode !== 'password' ? (
          <button type="button" className="uf-linkish" onClick={pick('password')}>
            Use a password instead
          </button>
        ) : null}{' '}
        {mode !== 'link' ? (
          <button type="button" className="uf-linkish" onClick={pick('link')}>
            Email me a link instead
          </button>
        ) : null}{' '}
        {mode !== 'forgot' ? (
          <button type="button" className="uf-linkish" onClick={pick('forgot')}>
            Forgotten your password?
          </button>
        ) : null}
      </p>

      {providers.length > 0 ? (
        <div className="uf-stack-6">
          <span className="uf-eyebrow uf-eyebrow-dim">Or continue with</span>
          <div className="uf-cta-row">
            {providers.map((provider) => (
              // A plain link: the service redirects to the provider, so this must work without JavaScript.
              <a key={provider} className="uf-btn uf-btn-ghost" href={apiUrl(`/auth/oauth/${provider}`)}>
                {providerLabel(provider)}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
