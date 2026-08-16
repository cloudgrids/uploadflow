import type { Metadata } from 'next';
import { PageHero, SitePage, StatusLine, StoreLink } from '../../components/site/SiteChrome';
import { ReleaseTimeline } from '../../components/whats-new/ReleaseTimeline';
import { upcomingRelease } from '../../components/whats-new/content';

export const metadata: Metadata = {
  title: 'What’s New in UploadFlow',
  description: `Release notes for the UploadFlow Chrome extension, including the ${upcomingRelease.version} profile studio, icon-rail navigation, and capture and editor fixes now in development.`,
  alternates: { canonical: '/whats-new' }
};

export default function WhatsNewPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Release notes"
        title={
          <>
            What changed, <span className="uf-hl">and what is next.</span>
          </>
        }
        lede="Every UploadFlow release is catalogued here and inside the extension itself. The version in development sits at the head of the timeline; shipped versions follow it, newest first."
        aside={
          <div className="uf-card">
            <StatusLine label="In development" value={upcomingRelease.version} />
            <StatusLine label="Notes" value="Also in-product" />
            <StatusLine label="Scope" value="Subject to change" />
          </div>
        }
      />

      <section className="uf-wrap uf-section">
        <ReleaseTimeline />
      </section>

      <section className="uf-wrap uf-section">
        <div className="uf-card uf-stack">
          <span className="uf-eyebrow">Get the updates</span>
          <h2>Install once, update automatically.</h2>
          <p className="uf-lede">
            Chrome keeps the extension current. Open <b>What&rsquo;s new</b> from the workspace header to see which release you are running.
          </p>
          <div className="uf-cta-row">
            <StoreLink className="uf-btn uf-btn-primary">
              Add to Chrome <span className="uf-arw">→</span>
            </StoreLink>
            <a className="uf-btn uf-btn-ghost" href="/how-it-works">
              Product guide
            </a>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
