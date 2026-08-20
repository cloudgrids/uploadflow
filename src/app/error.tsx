'use client';

import { useEffect } from 'react';
import { SiteFooter, SiteHeader, StoreLink } from '../components/site/SiteChrome';

/**
 * Route-level error boundary. It cannot use `SitePage` because that renders a
 * `<main>` and this needs its own; it also cannot export `metadata`, since an
 * error boundary is a client component.
 *
 * The raw message is deliberately not shown — it can carry internals — but the
 * digest is, because that is the only handle a person can quote in a report.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surfaces the real error where a developer will look, without putting it on screen.
    console.error(error);
  }, [error]);

  return (
    <div className="uf">
      <div className="uf-inner">
        <SiteHeader />
        <main>
          <section className="uf-wrap uf-page-hero">
            <div className="uf-page-hero-in">
              <div className="uf-stack-6">
                <span className="uf-eyebrow">Something broke</span>
                <h1>
                  This page didn&rsquo;t <span className="uf-hl">load.</span>
                </h1>
                <p className="uf-lede">
                  The error is on our side, not yours. Nothing you captured or prepared in the extension is affected — this is the marketing
                  site, and it holds none of your media.
                </p>
                <div className="uf-cta-row">
                  <button type="button" className="uf-btn uf-btn-primary" onClick={reset}>
                    Try again
                  </button>
                  <a className="uf-btn uf-btn-ghost" href="/">
                    Back to the home page
                  </a>
                </div>
              </div>

              <div className="uf-page-hero-aside">
                <div className="uf-card uf-stack">
                  <div className="uf-row-top">
                    <h3>Reporting it</h3>
                    <span className="uf-chip uf-chip-exp">Error</span>
                  </div>
                  <p className="uf-small">If it keeps happening, quote this reference so the failure can be found in the logs.</p>
                  <p className="uf-small uf-mono" style={{ wordBreak: 'break-all' }}>
                    {error.digest ?? 'no reference available'}
                  </p>
                  <div className="uf-cta-row">
                    <a
                      className="uf-btn uf-btn-ghost"
                      href="https://github.com/cloudgrids/uploadflow/issues/new/choose"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Report it ↗
                    </a>
                    <StoreLink className="uf-btn uf-btn-ghost">Chrome Web Store</StoreLink>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
