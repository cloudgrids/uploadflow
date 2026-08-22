'use client';

import { OPERATOR_ROLE, useAccess } from '../../lib/api';

/**
 * The way from an account into the operator area, for an account that has one.
 *
 * `meowfans-client` does this at the app boundary: its fan app reads the token, sees an operator
 * rank and sends the browser to a different origin. There is one origin here, so the equivalent is
 * a door rather than a redirect — and a door is the better behaviour anyway, since an operator with
 * a subscription of their own has a genuine reason to be on this page.
 *
 * **It renders nothing unless the service says so**, and it is an affordance rather than a control:
 * the address is not a secret, `/admin` is reachable by typing it, and what stops anybody who
 * should not be there is that the API refuses every call the area makes.
 */
export function OperatorHandoff() {
  const access = useAccess(OPERATOR_ROLE);

  // Anything but a clear yes shows nothing at all. A "checking…" line here would advertise that
  // there is something to check, on a page most people have no business being told about.
  if (access.state !== 'granted') return null;

  return (
    <section className="uf-card uf-stack">
      <div className="uf-stack-6">
        <h2>Operational tools</h2>
        <p className="uf-small">This account also has access to the tools for running UploadFlow.</p>
      </div>
      <a className="uf-btn uf-btn-ghost" href="/admin">
        Go to operations <span className="uf-arw">&rarr;</span>
      </a>
    </section>
  );
}
