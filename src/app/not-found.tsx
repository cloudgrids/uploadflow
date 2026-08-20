import type { Metadata } from 'next';
import { PageHero, SitePage, StoreLink } from '../components/site/SiteChrome';

export const metadata: Metadata = {
  title: 'Page not found | UploadFlow',
  description: 'That page does not exist. Find the product guide, release notes, privacy policy or support instead.'
};

const destinations = [
  { href: '/how-it-works', title: 'How it works', copy: 'The full workflow, every setting, and what each one changes.' },
  { href: '/whats-new', title: 'What’s new', copy: 'Release notes, newest first, with the version in development at the head.' },
  { href: '/test', title: 'Test layer', copy: 'Try each upload method a page can use and watch UploadFlow intercept it.' },
  { href: '/support', title: 'Support', copy: 'Troubleshooting checks, deleting local data, and how to report a problem.' }
];

export default function NotFound() {
  return (
    <SitePage>
      <PageHero
        eyebrow="404"
        title={
          <>
            That page isn&rsquo;t <span className="uf-hl">on the shelf.</span>
          </>
        }
        lede="The link may be old, or the page may have moved. Everything the site has is one hop away."
        aside={
          <div className="uf-card uf-stack">
            <p className="uf-small">Looking for the extension itself?</p>
            <div className="uf-cta-row">
              <StoreLink className="uf-btn uf-btn-primary">
                Add to Chrome <span className="uf-arw">→</span>
              </StoreLink>
            </div>
          </div>
        }
      />

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-stack-6">
            <span className="uf-eyebrow">Try one of these</span>
            <h2>Where you were probably headed.</h2>
          </div>
          <div className="uf-grid uf-grid-2">
            {destinations.map((item) => (
              <a key={item.href} href={item.href} className="uf-card uf-stack">
                <div className="uf-row-top">
                  <h3>{item.title}</h3>
                  <span className="uf-chip uf-chip-plan">Go →</span>
                </div>
                <p className="uf-small">{item.copy}</p>
              </a>
            ))}
          </div>
          <div className="uf-cta-row">
            <a className="uf-btn uf-btn-ghost" href="/">
              Back to the home page
            </a>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
