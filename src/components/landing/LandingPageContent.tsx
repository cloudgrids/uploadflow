import { LandingFooter, LandingHeader } from './LandingChrome';
import { AvailableTodaySection, ExtensionSection, HeroSection, TrustSections, WorkflowSection } from './LandingCoreSections';
import { CommonQuestionsSection, PlainEnglishSection, ProblemsAndUseCasesSection } from './LandingExplanationSections';
import { ShareAndCtaSections } from './LandingShare';
import { EditorToolsSection, MediaMemorySection, ProductSurfaceSection } from './ProductSections';

export function LandingPageContent() {
  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#0b0d0f] text-white selection:bg-[#eefb7a] selection:text-[#0b0d0f]">
      <LandingHeader />
      <main id="top">
        <HeroSection />
        <PlainEnglishSection />
        <ProblemsAndUseCasesSection />
        <AvailableTodaySection />
        <MediaMemorySection />
        <WorkflowSection />
        <ProductSurfaceSection />
        <ExtensionSection />
        <EditorToolsSection />
        <CommonQuestionsSection />
        <TrustSections />
        <ShareAndCtaSections />
      </main>
      <LandingFooter />
    </div>
  );
}
