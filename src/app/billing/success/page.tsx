import type { Metadata } from 'next';
import { PageHero, SitePage } from '../../../components/site/SiteChrome';

export const metadata: Metadata = {
  title: 'Payment complete | UploadFlow',
  description: 'Where checkout returns after a completed payment.',
  alternates: { canonical: '/billing/success' },
  robots: { index: false }
};

/**
 * Where checkout sends the browser after a completed payment.
 *
 * Static on purpose. The payment provider tells the service the outcome directly, so this page has
 * nothing to confirm and nothing to fetch — reading a subscription here would race that callback and
 * could show a stale answer to somebody who has just paid. The account page is the place to look.
 */
export default function BillingSuccessPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Checkout"
        title={
          <>
            Payment <span className="uf-hl">complete.</span>
          </>
        }
        lede="Thank you. Your receipt is on its way by email."
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-card uf-stack">
            <h2>What happens now.</h2>
            <p className="uf-lede">
              Your account is being updated. It can take a moment for the change to appear.
            </p>
            <div className="uf-cta-row">
              <a className="uf-btn uf-btn-primary" href="/account">
                View your account <span className="uf-arw">→</span>
              </a>
              <a className="uf-btn uf-btn-ghost" href="/support">
                Get help
              </a>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
