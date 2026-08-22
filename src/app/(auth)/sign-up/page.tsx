import type { Metadata } from 'next';
import { PageHero } from '../../../components/site/SiteChrome';
import { SignUpPanel } from '../../../components/site/SignUpPanel';

export const metadata: Metadata = {
  title: 'Create an account | UploadFlow',
  description: 'Create an UploadFlow account to manage a subscription.',
  alternates: { canonical: '/sign-up' }
  // `robots` is the group's, in (auth)/layout.tsx — page metadata replaces a layout's field rather
  // than merging with it, so repeating a weaker form here would quietly drop `follow: false`.
};

export default function SignUpPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title={
          <>
            Create an <span className="uf-hl">account.</span>
          </>
        }
        lede="An account is what a subscription belongs to. Setting one up takes a name, an address and a password."
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-card uf-stack">
            <SignUpPanel />
          </div>
        </div>
      </section>
    </>
  );
}
