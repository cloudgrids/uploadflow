import type { Metadata } from 'next';
import { FeatureSection } from '../../components/how-it-works/FeatureSection';
import { featureGroups } from '../../components/how-it-works/content';
import { LandingFooter, LandingHeader } from '../../components/landing/LandingChrome';

export const metadata: Metadata = { title: 'How UploadFlow Works', description: 'A detailed guide to UploadFlow capture, media shelf, preparation tools, privacy review, batches, video editing, and cross-site handoff.' };

export default function HowItWorksPage() {
  return <div className="min-h-screen bg-[#0b0d0f] text-white"><LandingHeader/><main className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12"><header className="py-20 sm:py-28"><p className="text-[9px] font-black uppercase tracking-[.22em] text-[#eefb7a]">Product guide</p><h1 className="mt-6 max-w-5xl text-5xl leading-[.86] sm:text-7xl lg:text-8xl">From a webpage<br/>to a ready upload.</h1><p className="mt-8 max-w-2xl text-base leading-7 text-white/50">Follow the complete local-first workflow, understand each preparation tool, and see where Chrome or the source website sets a capability boundary.</p><nav className="mt-10 flex flex-wrap gap-2" aria-label="Page sections">{featureGroups.map(feature=><a key={feature.id} href={`#${feature.id}`} className="rounded-full border border-white/15 px-4 py-2 text-[8px] font-bold uppercase tracking-wider text-white/55 hover:border-[#eefb7a]/40 hover:text-[#eefb7a]">{feature.title}</a>)}</nav></header>{featureGroups.map((feature,index)=><FeatureSection key={feature.id} feature={feature} index={index}/>)}</main><LandingFooter/></div>;
}
