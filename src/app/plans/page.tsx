import type { Metadata } from 'next';
import { PageHero, SitePage, StoreLink } from '../../components/site/SiteChrome';
import { PlanExplorer } from '../../components/site/PlanExplorer';
import { PlanMarquee } from '../../components/site/PlanMarquee';
import { planNotes } from '../../components/site/plansContent';

export const metadata: Metadata = {
  title: 'Plans & access | UploadFlow',
  description:
    'UploadFlow Free needs no account and carries the whole workflow. Silver from $4, Gold from $9 and Platinum from $19 a month add preparation depth and repeatable delivery.',
  alternates: { canonical: '/plans' }
};

export default function PlansPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Plans & access"
        title={
          <>
            Free stays free. <span className="uf-hl">Sign in when you need more.</span>
          </>
        }
        lede="Everything you need to move a file from one site to another is free, and needs no account. Paid plans add depth to the preparation tools and let you save the rules you use again and again."
        aside={
          <div className="uf-card uf-stack">
            <p className="uf-small">Free is not a trial. It carries the whole journey.</p>
            <div className="uf-cta-row">
              <StoreLink className="uf-btn uf-btn-primary">
                Add to Chrome <span className="uf-arw">&rarr;</span>
              </StoreLink>
            </div>
          </div>
        }
      />

      <section className="uf-wrap uf-section">
        <PlanMarquee />
        <PlanExplorer />
      </section>

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-stack-6">
            <span className="uf-eyebrow">Good to know</span>
            <h2>What signing in does, and doesn&rsquo;t.</h2>
          </div>
          <div className="uf-grid uf-grid-2">
            {planNotes.map((note) => (
              <div key={note.title} className="uf-card uf-stack-6">
                <h3>{note.title}</h3>
                <p className="uf-small">{note.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SitePage>
  );
}
