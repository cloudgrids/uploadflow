import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageHero } from '../../../components/site/SiteChrome';
import { SignInPanel } from '../../../components/site/SignInPanel';

export const metadata: Metadata = {
  title: 'Sign in | UploadFlow',
  description: 'Sign in to manage your UploadFlow subscription.',
  alternates: { canonical: '/sign-in' }
  // `robots` is the group's, in (auth)/layout.tsx — page metadata replaces a layout's field rather
  // than merging with it, so repeating a weaker form here would quietly drop `follow: false`.
};

export default function SignInPage() {
  return (
    <>
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

          {/*
            Outside the boundary above on purpose. That subtree reads a query parameter, so it is
            rendered on the client and is absent from the served HTML — a way in that only exists
            once JavaScript has run is not a way in. This link is in the page itself.
          */}
          <p className="uf-small">
            No account yet? <a href="/sign-up">Create one</a>.
          </p>
        </div>
      </section>
    </>
  );
}
