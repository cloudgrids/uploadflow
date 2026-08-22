import type { Metadata } from 'next';
import { PageHero, SitePage } from '../../components/site/SiteChrome';
import { DropsPanel } from '../../components/site/DropsPanel';

export const metadata: Metadata = {
  title: 'Drops | UploadFlow',
  description: 'Occasional time-boxed offers: what is open now, what it gives you, and when it closes.',
  alternates: { canonical: '/drops' }
};

export default function DropsPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Drops"
        title={
          <>
            Open for a <span className="uf-hl">while.</span>
          </>
        }
        lede="Every so often something is on offer for a limited stretch. This is what is open now and when it closes."
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <DropsPanel />
        </div>
      </section>
    </SitePage>
  );
}
