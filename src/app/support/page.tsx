import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | UploadFlow',
  description: 'Get help with UploadFlow, report a problem, or learn how to delete locally stored extension data.'
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#0b0d0f] px-5 py-12 text-white sm:px-8 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <a href="/" className="text-[10px] font-bold uppercase tracking-[.16em] text-[#eefb7a]">← UploadFlow</a>
        <p className="mt-12 text-[9px] font-black uppercase tracking-[.22em] text-emerald-400">Extension support</p>
        <h1 className="mt-5 text-5xl leading-[.9] sm:text-7xl">Help with files<br />in motion.</h1>
        <p className="mt-7 text-base leading-7 text-white/60">Use the steps below before reporting an issue. Never include private files, signed media URLs, passwords, tokens, or personal information in a public report.</p>

        <div className="mt-14 space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-xl">Troubleshooting</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-white/55">
              <li>Open UploadFlow Settings and confirm upload interception is enabled.</li>
              <li>After an extension update, reload the extension and refresh existing webpage tabs.</li>
              <li>Confirm the source URL is direct, still valid, and allows browser access.</li>
              <li>Try the supported flows at <a href="/test" className="text-[#eefb7a] underline underline-offset-2">the test page</a>.</li>
            </ol>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-xl">Delete local data</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">Private workflow history is disabled by default and can be cleared completely or per destination from UploadFlow Settings. Remove shelf records individually, or uninstall UploadFlow from <code className="text-white">chrome://extensions</code> to remove every extension setting and local record.</p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-xl">Report a problem</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">Use the support contact shown on UploadFlow&apos;s Chrome Web Store listing. Include the website, Chrome version, expected behavior, actual behavior, and reproducible steps. Replace private URLs with safe examples and never attach confidential files.</p>
            <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/8 px-4 py-3 text-xs leading-5 text-amber-100">Public issue creation is not currently available in the website repository, so the previous GitHub issue link has been removed.</p>
          </section>

          <p className="text-sm text-white/45">For privacy information, see the <a href="/privacy" className="text-[#eefb7a] underline underline-offset-2">UploadFlow privacy policy</a>.</p>
        </div>
      </article>
    </main>
  );
}
