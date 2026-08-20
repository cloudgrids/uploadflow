'use client';

import { useEffect } from 'react';
import { PageHero, SitePage, StatusLine } from '../components/site/SiteChrome';

/**
 * Route-level error boundary for every page below the root layout.
 * Client-only by contract: Next renders it in place of `main`, so it reuses the
 * ordinary page shell rather than inventing a second chrome.
 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('UploadFlow site error', error);
  }, [error]);

  return (
    <SitePage>
      <PageHero
        eyebrow="Something broke"
        title={
          <>
            This page stopped <span className="uf-hl">mid-flow.</span>
          </>
        }
        lede="The site hit an unexpected error while rendering. Nothing you captured or delivered with the extension is affected — UploadFlow works locally and does not depend on this page."
        aside={
          <div className="uf-card">
            <StatusLine label="Scope" value="This page only" />
            <StatusLine label="Extension" value="Unaffected" />
            <StatusLine label="Your media" value="Untouched" />
          </div>
        }
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-card uf-stack">
            <div className="uf-row-top">
              <h2>Try again.</h2>
              <span className="uf-chip uf-chip-beta">First step</span>
            </div>
            <p className="uf-lede">
              Most failures here are transient. Retrying re-renders this route without reloading the whole site.
            </p>
            <div className="uf-cta-row">
              <button type="button" className="uf-btn uf-btn-primary" onClick={reset}>
                Retry this page <span className="uf-arw">→</span>
              </button>
              <a className="uf-btn uf-btn-ghost" href="/">
                Back to home
              </a>
            </div>
          </div>

          <div className="uf-grid uf-grid-2">
            <div className="uf-card uf-stack">
              <h3>If it keeps happening</h3>
              <ul className="uf-dots">
                <li>Reload the tab once — a stale chunk from a deploy resolves itself on a fresh load.</li>
                <li>
                  Check the extension itself on <a href="/test">the test page</a>, which runs independently of this route.
                </li>
                <li>
                  Report it from <a href="/support">Support</a> with the reference below and what you were doing.
                </li>
              </ul>
            </div>

            <div className="uf-card uf-stack uf-prose">
              <h3>Error reference</h3>
              {error.digest ? (
                <p>
                  Quote this digest in a report: <code>{error.digest}</code>
                </p>
              ) : (
                <p>No digest was attached to this error. Describe the page and the steps that led here instead.</p>
              )}
              <p className="uf-limit">
                <b>Nothing is sent automatically.</b> Details stay in your browser console until you choose to report them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
