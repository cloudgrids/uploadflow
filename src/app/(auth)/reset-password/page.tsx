import type { Metadata } from 'next';
import { PageHero } from '../../../components/site/SiteChrome';
import { ResetPasswordPanel } from '../../../components/site/ResetPasswordPanel';

/**
 * `referrer` and `robots` are the point of this block, not decoration.
 *
 * The link that reaches this page carries its token in the query string, so the URL itself is
 * sensitive until the token is stripped. `no-referrer` stops that URL travelling in a `Referer`
 * header, and `noindex` keeps a pasted link out of search results.
 */
export const metadata: Metadata = {
  title: 'Choose a new password | UploadFlow',
  description: 'Set a new password for your UploadFlow account.',
  referrer: 'no-referrer',
  robots: { index: false, follow: false }
};

export default function ResetPasswordPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title={
          <>
            Set a <span className="uf-hl">new password.</span>
          </>
        }
        lede="You reached this page from a link we emailed you."
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-card uf-stack">
            <ResetPasswordPanel />
          </div>
        </div>
      </section>
    </>
  );
}
