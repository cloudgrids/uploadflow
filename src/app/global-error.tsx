'use client';

import { useEffect } from 'react';
import { UploadFlowIcon } from '../lib/icons';
import './globals.css';

/**
 * Last-resort boundary: this replaces the root layout, so it renders its own
 * `<html>`/`<body>` and imports the stylesheet itself.
 *
 * It deliberately imports nothing from `components/site`. The root layout is
 * what failed, ThemeProvider included, so anything mounted here has to stand on
 * its own — hence the inline pre-paint script below instead of next-themes, and
 * plain markup instead of `SitePage`.
 *
 * Only reachable in a production build; the dev overlay handles this in `pnpm dev`.
 */

/**
 * Mirrors next-themes: `attribute="class"`, default storage key, system fallback.
 *
 * Applied twice on purpose. The inline script covers a server-render failure,
 * where this HTML is streamed and the script executes before paint. But when the
 * failure happens during hydration React discards the tree and renders this
 * boundary client-side — a script inserted that way never runs, and the re-render
 * of `<html>` drops whatever class was on it. The effect is what covers that path.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}`;

function prefersDark() {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || ((!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  } catch {
    return false;
  }
}

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('UploadFlow site failed to render', error);
  }, [error]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', prefersDark());
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <title>Site error | UploadFlow</title>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <div className="uf">
          <div className="uf-inner">
            <header className="uf-bar">
              <div className="uf-bar-in">
                <a className="uf-logo" href="/">
                  <span className="uf-logo-tile" aria-hidden="true">
                    <UploadFlowIcon />
                  </span>
                  <span className="uf-logo-name">
                    <b>UploadFlow</b>
                    <span>Private toolkit</span>
                  </span>
                </a>
              </div>
            </header>

            <main className="uf-wrap uf-section">
              <div className="uf-stack-l">
                <div className="uf-stack-6">
                  <span className="uf-eyebrow">Site error</span>
                  <h1>
                    The site failed <span className="uf-hl">to load.</span>
                  </h1>
                  <p className="uf-lede">
                    Something broke before any page could render. This is the website, not the extension — UploadFlow runs locally in
                    your browser and keeps working while this is down.
                  </p>
                </div>

                <div className="uf-card uf-stack uf-prose">
                  <h2>What to try</h2>
                  <ul className="uf-dots">
                    <li>Reload once. A stale chunk left over from a deploy clears itself on a fresh load.</li>
                    <li>
                      If it persists, report it at <a href="/support">Support</a> with the reference below.
                    </li>
                  </ul>
                  {error.digest ? (
                    <p>
                      Error reference: <code>{error.digest}</code>
                    </p>
                  ) : (
                    <p>No error reference was attached. Describe the page you were on and what you were doing instead.</p>
                  )}
                </div>

                <div className="uf-cta-row">
                  <button type="button" className="uf-btn uf-btn-primary" onClick={reset}>
                    Reload the site <span className="uf-arw">→</span>
                  </button>
                  <a className="uf-btn uf-btn-ghost" href="/">
                    Back to home
                  </a>
                </div>
              </div>
            </main>

            <footer className="uf-foot uf-wrap">
              <p className="uf-small">UploadFlow by CloudGrids. Your media never left your browser.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
