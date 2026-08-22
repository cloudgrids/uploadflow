import type { Metadata } from 'next';
import { PageHero, SitePage } from '../../../components/site/SiteChrome';
import { VerifyEmailPanel } from '../../../components/site/VerifyEmailPanel';

/**
 * `referrer` and `robots` are the point of this block, not decoration.
 *
 * The link that reaches this page carries its token in the query string, so the URL itself is
 * sensitive until the token is stripped. `no-referrer` stops that URL travelling in a `Referer`
 * header, and `noindex` keeps a pasted link out of search results.
 */
export const metadata: Metadata = {
  title: 'Confirm your email | UploadFlow',
  description: 'Confirm the email address on your UploadFlow account.',
  referrer: 'no-referrer',
  robots: { index: false, follow: false }
};

export default function VerifyEmailPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Account"
        title={
          <>
            Confirming <span className="uf-hl">your address.</span>
          </>
        }
        lede="You reached this page from a link we emailed you."
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-card uf-stack">
            <VerifyEmailPanel />
          </div>
        </div>
      </section>
    </SitePage>
  );
}
