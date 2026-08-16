import type { Metadata } from 'next';
import { configurationGroups, featureGroups } from '../../components/how-it-works/content';
import { productStatus, type ProductStatus } from '../../components/landing/content';
import { PageHero, SitePage, StatusLine } from '../../components/site/SiteChrome';

export const metadata: Metadata = {
  title: 'How UploadFlow Works',
  description:
    'A detailed guide to UploadFlow capture, configuration, media shelf, preparation tools, privacy review, batches, video editing, and cross-site handoff.'
};

const statusChip: Record<ProductStatus, string> = {
  available: 'uf-chip-ok',
  beta: 'uf-chip-beta',
  early: 'uf-chip-beta',
  experimental: 'uf-chip-exp',
  next: 'uf-chip',
  planned: 'uf-chip'
};

export default function HowItWorksPage() {
  return (
    <SitePage>
      <PageHero
        eyebrow="Product guide"
        title={
          <>
            From a webpage <span className="uf-hl">to a ready upload.</span>
          </>
        }
        lede="Follow the complete local-first workflow, understand every major configuration boundary, and see how the popup, side panel, editor, background worker, and destination website work together."
        aside={
          <div className="uf-card">
            <StatusLine label="Capture" value="Source retained" />
            <StatusLine label="Prepare" value="Local-first" />
            <StatusLine label="Deliver" value="User confirmed" />
          </div>
        }
      />

      <nav className="uf-toc" aria-label="Page sections">
        <a href="#configuration">Configuration</a>
        {featureGroups.map((feature) => (
          <a key={feature.id} href={`#${feature.id}`}>
            {feature.title}
          </a>
        ))}
      </nav>

      <section className="uf-wrap uf-section" id="configuration">
        <div className="uf-stack-l">
          <div className="uf-stack-6">
            <span className="uf-eyebrow">Settings</span>
            <h2>Every switch, and what it changes.</h2>
            <p className="uf-lede">
              Each of these lives in UploadFlow Settings. Read the boundaries — several of them decide whether a feature runs at all.
            </p>
          </div>
          <div className="uf-grid uf-grid-2">
            {configurationGroups.map((group) => (
              <div key={group.id} className="uf-card uf-stack" id={group.id}>
                <h3>{group.title}</h3>
                <p className="uf-small">{group.summary}</p>
                <ul className="uf-dots">
                  {group.choices.map((choice) => (
                    <li key={choice}>{choice}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="uf-wrap uf-section">
        <div className="uf-stack-l">
          <div className="uf-stack-6">
            <span className="uf-eyebrow">The workflow</span>
            <h2>Capture, prepare, deliver.</h2>
          </div>

          {featureGroups.map((feature, index) => {
            const status = feature.status ?? (feature.comingSoon ? 'beta' : 'available');
            return (
              <div key={feature.id} className="uf-card uf-stack" id={feature.id}>
                <div className="uf-row-top">
                  <span className="uf-eyebrow uf-eyebrow-dim">{feature.eyebrow}</span>
                  <span className={`uf-chip ${statusChip[status]}`}>{productStatus[status].label}</span>
                </div>
                <div className={index % 2 === 1 ? 'uf-split uf-split-rev' : 'uf-split'}>
                  <div className="uf-stack">
                    <h3>{feature.title}</h3>
                    <p className="uf-small">{feature.copy}</p>
                    <ul className="uf-dots">
                      {feature.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  {feature.image ? (
                    <figure className="uf-shot">
                      <div className="uf-shot-frame">
                        <img
                          src={feature.image}
                          alt={feature.imageLabel ?? `${feature.title} in the UploadFlow workspace`}
                          width={1500}
                          height={1120}
                          loading="lazy"
                        />
                      </div>
                      {feature.imageLabel ? <figcaption className="uf-shot-cap">{feature.imageLabel}</figcaption> : null}
                    </figure>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </SitePage>
  );
}
