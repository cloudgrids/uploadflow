import type { Metadata } from 'next';
import { PageHero, SitePage } from '../../../components/site/SiteChrome';
import { AccountPanel } from '../../../components/site/AccountPanel';

export const metadata: Metadata = {
  title: 'Your account | UploadFlow',
  description: 'View your UploadFlow subscription and manage billing.',
  alternates: { canonical: '/account' },
  robots: { index: false }
};

export default function AccountPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Account"
        title={
          <>
            Your <span className="uf-hl">account.</span>
          </>
        }
        lede="What your account is on, and where to change it."
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-card uf-stack">
            <AccountPanel />
          </div>
        </div>
      </section>
    </SitePage>
  );
}
