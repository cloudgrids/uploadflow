import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageHero, SitePage } from '../../components/site/SiteChrome';
import { SignInPanel } from '../../components/site/SignInPanel';

export const metadata: Metadata = {
  title: 'Sign in | UploadFlow',
  description: 'Sign in to manage your UploadFlow subscription.',
  alternates: { canonical: '/sign-in' },
  robots: { index: false }
};

export default function SignInPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Account"
        title={
          <>
            Sign in to <span className="uf-hl">your account.</span>
          </>
        }
        lede="Enter your email address and we will send you a link to sign in."
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-card uf-stack">
            {/* `useSearchParams` opts this subtree out of static rendering; the boundary keeps the rest of the page static. */}
            <Suspense fallback={<p className="uf-lede">Loading…</p>}>
              <SignInPanel />
            </Suspense>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
