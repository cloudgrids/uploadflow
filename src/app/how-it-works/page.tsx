import type { Metadata } from 'next';
import { ConfigurationGuide } from '../../components/how-it-works/ConfigurationGuide';
import { FeatureSection } from '../../components/how-it-works/FeatureSection';
import { featureGroups } from '../../components/how-it-works/content';
import { LandingFooter, LandingHeader } from '../../components/landing/LandingChrome';
import { PageHero, StatusLine } from '../../components/ui/PageChrome';

export const metadata: Metadata = {
  title: 'How UploadFlow Works',
  description:
    'A detailed guide to UploadFlow capture, configuration, media shelf, preparation tools, privacy review, batches, video editing, and cross-site handoff.'
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#080b0d]/70 text-white">
      <LandingHeader />
      <main className="mx-auto max-w-360 px-5 pt-20 sm:px-8 lg:px-12">
        <PageHero
          eyebrow="Product guide"
          title={
            <>
              From a webpage
              <br />
              <span className="text-[#eefb7a]">to a ready upload.</span>
            </>
          }
          description="Follow the complete local-first workflow, understand every major configuration boundary, and see how the popup, side panel, editor, background worker, and destination website work together."
          aside={
            <div className="content-card min-w-0">
              <StatusLine label="Capture" value="Source retained" />
              <StatusLine label="Prepare" value="Local-first" tone="green" />
              <StatusLine label="Deliver" value="User confirmed" tone="violet" />
            </div>
          }
        />

        <nav
          className="sticky top-16 z-30 -mx-5 flex gap-2 overflow-x-auto border-y border-white/10 bg-[#080b0d]/88 px-5 py-3 backdrop-blur-2xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
          aria-label="Page sections"
        >
          <a
            href="#configuration"
            className="shrink-0 rounded-full border border-[#eefb7a]/40 bg-[#eefb7a]/12 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#eefb7a] transition hover:bg-[#eefb7a]/20"
          >
            Configuration
          </a>
          {featureGroups.map((feature) => (
            <a
              key={feature.id}
              href={`#${feature.id}`}
              className="shrink-0 rounded-full border border-white/15 bg-white/3 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/60 transition hover:border-[#eefb7a]/40 hover:text-[#eefb7a]"
            >
              {feature.title}
            </a>
          ))}
        </nav>

        <ConfigurationGuide />
        {featureGroups.map((feature, index) => (
          <FeatureSection key={feature.id} feature={feature} index={index} />
        ))}
      </main>
      <LandingFooter />
    </div>
  );
}
