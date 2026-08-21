'use client';

import { useState } from 'react';
import { isApiError, submitSupportTicket } from '../../lib/api';
import { messageForFailure } from './apiMessages';

type State = { status: 'idle' | 'sending' } | { status: 'done'; message: string } | { status: 'failed'; message: string };

const SUBJECT_LIMIT = 200;
const BODY_LIMIT = 5000;

/**
 * Sends a support message. Public — the endpoint takes no credentials.
 *
 * The limits below match what the service accepts. They are enforced here as well so an
 * over-length message is caught while it can still be edited, rather than coming back as a
 * validation failure that names no field.
 */
export function SupportForm() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [state, setState] = useState<State>({ status: 'idle' });

  const sending = state.status === 'sending';
  const complete = email.trim().length > 0 && subject.trim().length > 0 && body.trim().length > 0;

  const edit = (set: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    set(event.target.value);
    setState({ status: 'idle' });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    setState({ status: 'sending' });
    try {
      await submitSupportTicket({ email: email.trim(), subject: subject.trim(), body: body.trim() });
      setState({ status: 'done', message: 'Message sent. We will reply to that address.' });
      setSubject('');
      setBody('');
    } catch (cause) {
      const invalid = isApiError(cause) && cause.outcome === 'request';
      setState({
        status: 'failed',
        message: messageForFailure(cause, invalid ? 'Check the address and message, then try again.' : 'Could not send the message. Try again.')
      });
    }
  };

  return (
    <form className="uf-stack" onSubmit={submit} noValidate>
      <label className="uf-small" htmlFor="uf-support-email">
        Your email
      </label>
      <input
        id="uf-support-email"
        className="uf-field"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        disabled={sending}
        onChange={edit(setEmail)}
        placeholder="you@example.com"
      />

      <label className="uf-small" htmlFor="uf-support-subject">
        Subject
      </label>
      <input
        id="uf-support-subject"
        className="uf-field"
        type="text"
        name="subject"
        required
        maxLength={SUBJECT_LIMIT}
        value={subject}
        disabled={sending}
        onChange={edit(setSubject)}
        placeholder="What went wrong, in a line"
      />

      <label className="uf-small" htmlFor="uf-support-body">
        What happened
      </label>
      <textarea
        id="uf-support-body"
        className="uf-field"
        name="body"
        required
        rows={6}
        maxLength={BODY_LIMIT}
        value={body}
        disabled={sending}
        onChange={edit(setBody)}
        placeholder="The website, your Chrome version, what you expected, what happened, and the steps to repeat it."
      />

      <div className="uf-cta-row">
        <button type="submit" className="uf-btn uf-btn-primary" disabled={sending || !complete}>
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </div>

      <p className="uf-small" role="status" aria-live="polite">
        {state.status === 'done' || state.status === 'failed' ? state.message : ''}
      </p>
    </form>
  );
}
