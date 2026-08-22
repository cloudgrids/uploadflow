'use client';

import type { ReactNode } from 'react';
import { OPERATOR_ROLE, roleAtLeast, useAccess } from '../../../lib/api';
import { PageHero, SitePage, StatusLine } from '../SiteChrome';
import { messageForFailure } from '../apiMessages';
import { titleCase } from './formats';

/** The rank each slot asks for. Stated once, so a screen and its gate cannot drift apart. */
const SLOT_ROLE = {
  people: OPERATOR_ROLE,
  campaigns: 'ADMIN',
  announcements: 'ADMIN',
  billing: 'ADMIN'
} as const;

function Frame({ lede, children }: { lede: string; children: ReactNode }) {
  return (
    <SitePage>
      <PageHero
        eyebrow="Operations"
        title={
          <>
            Running <span className="uf-hl">UploadFlow.</span>
          </>
        }
        lede={lede}
      />
      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">{children}</div>
      </section>
    </SitePage>
  );
}

/**
 * The gate, and the chrome around what it lets through.
 *
 * Four ways in and only one of them draws anything: still asking, nobody signed in, signed in
 * without the rank, and unable to ask at all. The last two look the same from outside and are kept
 * apart deliberately — one is a fact about the account and the other is a fault, and reporting a
 * fault as a refusal tells somebody they have been demoted when the truth is that a request failed.
 */
export function OperatorShell({
  children,
  people,
  campaigns,
  announcements,
  billing
}: {
  children: ReactNode;
  people: ReactNode;
  campaigns: ReactNode;
  announcements: ReactNode;
  billing: ReactNode;
}) {
  const access = useAccess(OPERATOR_ROLE);

  if (access.state === 'deciding') {
    return (
      <Frame lede="Checking what this account may do.">
        <p className="uf-small">One moment.</p>
      </Frame>
    );
  }

  if (access.state === 'anonymous') {
    return (
      <Frame lede="These tools need an account that has been given access to them.">
        <div className="uf-card uf-stack">
          <p className="uf-small">Sign in first, then come back to this page.</p>
          <a className="uf-btn uf-btn-primary" href="/sign-in">
            Sign in
          </a>
        </div>
      </Frame>
    );
  }

  if (access.state === 'unavailable') {
    return (
      <Frame lede="These tools need an account that has been given access to them.">
        <div className="uf-card uf-stack">
          <p className="uf-small">{messageForFailure(access.cause, 'Could not check what this account may do.')}</p>
          <p className="uf-small">This is not an answer about your account — the question could not be asked.</p>
          <button className="uf-btn uf-btn-ghost" type="button" onClick={access.retry}>
            Try again
          </button>
        </div>
      </Frame>
    );
  }

  if (access.state === 'refused') {
    return (
      <Frame lede="These tools need an account that has been given access to them.">
        <div className="uf-card uf-stack">
          <p className="uf-small">This account does not have access to the operational tools.</p>
          {/* Deliberately no route onward. Access here is granted by somebody, not bought, so an
              upgrade link would be an offer that cannot be taken. */}
          <a className="uf-linkish" href="/account">
            Go to your account
          </a>
        </div>
      </Frame>
    );
  }

  const { profile, role } = access;
  const name = profile.displayName || profile.username || profile.email;

  return (
    <Frame lede="Tools for the people who run UploadFlow. What you see here depends on the access your account holds.">
      <div className="uf-card uf-stack">
        <StatusLine label="Signed in as" value={name} />
        <StatusLine label="Access" value={titleCase(role)} />
      </div>

      {children}

      {roleAtLeast(role, SLOT_ROLE.people) ? people : null}
      {roleAtLeast(role, SLOT_ROLE.campaigns) ? campaigns : null}
      {roleAtLeast(role, SLOT_ROLE.announcements) ? announcements : null}
      {roleAtLeast(role, SLOT_ROLE.billing) ? billing : null}
    </Frame>
  );
}
