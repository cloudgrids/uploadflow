import type { Metadata } from 'next';
import { PageHero, SitePage, StatusLine, StoreLink } from '../../components/site/SiteChrome';
import { SupportForm } from '../../components/site/SupportForm';

export const metadata: Metadata = {
  title: 'Support | UploadFlow',
  description: 'Get help with UploadFlow, report a problem, or learn how to delete locally stored extension data.'
};

export default function SupportPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Extension support"
        title={
          <>
            Help with files <span className="uf-hl">in motion.</span>
          </>
        }
        lede="Start with the safe checks below, verify the behaviour on UploadFlow’s test page, and report only the details needed to reproduce the problem."
        aside={
          <div className="uf-card">
            <StatusLine label="Install source" value="Chrome Web Store" />
            <StatusLine label="Processing" value="Local-first" />
            <StatusLine label="Reports" value="Sanitised" />
          </div>
        }
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-card uf-stack">
            <span className="uf-eyebrow">Official distribution</span>
            <h2>Install from the Chrome Web Store.</h2>
            <p className="uf-lede">
              Use the official listing so Chrome owns installation, updates, permission review, and extension integrity.
            </p>
            <div className="uf-cta-row">
              <StoreLink className="uf-btn uf-btn-primary">
                Add to Chrome <span className="uf-arw">→</span>
              </StoreLink>
            </div>
          </div>

          <div className="uf-grid uf-grid-2">
            <div className="uf-card uf-stack">
              <div className="uf-row-top">
                <h3>Troubleshooting</h3>
                <span className="uf-chip uf-chip-beta">Start here</span>
              </div>
              <ol className="uf-flow" style={{ flexDirection: 'column' }}>
                <li>
                  <p className="uf-small">Open UploadFlow Settings and confirm upload interception is enabled.</p>
                </li>
                <li>
                  <p className="uf-small">After an extension update, reload the extension and refresh any already-open tabs.</p>
                </li>
                <li>
                  <p className="uf-small">Confirm the source URL is direct, still valid, and allows browser access.</p>
                </li>
                <li>
                  <p className="uf-small">
                    Reproduce the flow on <a href="/test">the test page</a> to separate a site problem from an extension problem.
                  </p>
                </li>
              </ol>
            </div>

            <div className="uf-card uf-stack">
              <div className="uf-row-top">
                <h3>Delete local data</h3>
                <span className="uf-chip uf-chip-ok">Your control</span>
              </div>
              <ul className="uf-dots">
                <li>Private workflow history is disabled by default and can be cleared completely or per destination from Settings.</li>
                <li>Remove shelf records individually at any time.</li>
                <li>
                  Uninstall from <code>chrome://extensions</code> to remove every extension setting and local record at once.
                </li>
              </ul>
            </div>
          </div>

          <div className="uf-card uf-stack">
            <span className="uf-eyebrow">Report</span>
            <h2>Report a reproducible problem.</h2>
            <p className="uf-lede">
              Include the website, Chrome version, expected behaviour, actual behaviour, and reproducible steps.
            </p>
            <p className="uf-limit">
              <b>Never attach confidential files.</b> Replace private URLs with safe examples, and keep signed URLs, passwords and tokens
              out of a public report.
            </p>

            <SupportForm />

            <p className="uf-small">Prefer to report in the open? Use the issue tracker instead.</p>
            <div className="uf-cta-row">
              <a
                className="uf-btn uf-btn-ghost"
                href="https://github.com/cloudgrids/uploadflow/issues/new/choose"
                target="_blank"
                rel="noreferrer"
              >
                Open issue or request ↗
              </a>
              <a className="uf-btn uf-btn-ghost" href="/privacy">
                Privacy policy
              </a>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
