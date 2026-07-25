import type { Metadata } from 'next';
import { LandingFooter, LandingHeader } from '../../components/landing/LandingChrome';
import { ContentCard, PageHero, StatusLine } from '../../components/ui/PageChrome';

export const metadata: Metadata = {
  title: 'Support | UploadFlow',
  description: 'Get help with UploadFlow, report a problem, or learn how to delete locally stored extension data.'
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#080b0d]/70 text-white">
      <LandingHeader />
      <main className="mx-auto max-w-360 px-5 pt-20 pb-16 sm:px-8 lg:px-12">
        <PageHero
          eyebrow="Extension support"
          title={<>Help with files<br /><span className="text-[#eefb7a]">in motion.</span></>}
          description="Start with the safe checks below, verify the behaviour on UploadFlow’s test page, and report only the details needed to reproduce the problem. Never include private files, signed URLs, passwords, tokens, or personal information in a public report."
          aside={
            <div className="content-card">
              <StatusLine label="Install source" value="Chrome Web Store" />
              <StatusLine label="Processing" value="Local-first" tone="green" />
              <StatusLine label="Reports" value="Sanitised" tone="violet" />
            </div>
          }
        />

        <div className="grid gap-5 py-14 md:grid-cols-2">
          <ContentCard id="install" className="md:col-span-2 border-emerald-500/22 bg-emerald-950/18">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow text-emerald-400">Official distribution</p>
                <h2 className="mt-4 text-3xl sm:text-4xl">Install UploadFlow from Chrome Web Store.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">
                  Use the official listing so Chrome owns installation, updates, permission review, and extension integrity.
                </p>
              </div>
              <a href="https://chromewebstore.google.com/detail/uploadflow/geaebpfeoobmmdodclaglapichfalifh" target="_blank" rel="noreferrer" className="hover-lift inline-flex min-h-12 items-center justify-center rounded-full bg-[#eefb7a] px-6 text-xs font-extrabold uppercase tracking-wider text-[#0b0d0f] transition hover:bg-[#f4ff94] sm:text-sm">
                Add to Chrome ↗
              </a>
            </div>
          </ContentCard>

          <ContentCard>
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow">01 · Diagnose</p>
                <h2 className="mt-4 text-2xl">Troubleshooting</h2>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/4 text-[#eefb7a]">⌁</span>
            </div>
            <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-white/58 sm:text-base">
              <li>Open UploadFlow Settings and confirm upload interception is enabled.</li>
              <li>After an extension update, reload the extension and refresh existing webpage tabs.</li>
              <li>Confirm the source URL is direct, still valid, and allows browser access.</li>
              <li>Try the supported flows on <a href="/test" className="text-[#eefb7a] underline underline-offset-2">the test page</a>.</li>
            </ol>
          </ContentCard>

          <ContentCard>
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow text-emerald-400">02 · Privacy</p>
                <h2 className="mt-4 text-2xl">Delete local data</h2>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/4 text-emerald-300">×</span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/58 sm:text-base">
              Private workflow history is disabled by default and can be cleared completely or per destination from UploadFlow Settings.
              Remove shelf records individually, or uninstall UploadFlow from <code className="text-white">chrome://extensions</code> to remove every extension setting and local record.
            </p>
          </ContentCard>

          <ContentCard className="md:col-span-2">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow text-violet-300">03 · Report</p>
                <h2 className="mt-4 text-3xl">Report a reproducible problem.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">
                  Include the website, Chrome version, expected behaviour, actual behaviour, and reproducible steps. Replace private URLs with safe examples and never attach confidential files.
                </p>
              </div>
              <a href="https://github.com/cloudgrids/uploadflow/issues/new/choose" target="_blank" rel="noreferrer" className="hover-lift inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/4 px-6 text-xs font-extrabold uppercase tracking-wider text-white transition hover:border-[#eefb7a]/35 hover:text-[#eefb7a] sm:text-sm">
                Open issue or request ↗
              </a>
            </div>
          </ContentCard>
        </div>

        <p className="pb-8 text-sm text-white/48" data-reveal>
          For privacy information, see the <a href="/privacy" className="text-[#eefb7a] underline underline-offset-2">UploadFlow privacy policy</a>.
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}
