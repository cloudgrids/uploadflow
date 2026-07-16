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
            <p className="mt-4 text-sm leading-6 text-white/55">Delete optimization history from UploadFlow Settings. Remove saved URLs individually from the URL library. To remove every setting and local record, uninstall UploadFlow from <code className="text-white">chrome://extensions</code>.</p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-xl">Report a problem</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">Open a public issue with the website, Chrome version, expected behavior, actual behavior, and reproducible steps. Replace private URLs with safe examples.</p>
            <a href="https://github.com/arijitchhatui/uploadflow/issues" target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-[#eefb7a] px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#101416]">Open GitHub issues ↗</a>
          </section>

          <p className="text-sm text-white/45">For privacy information, see the <a href="/privacy" className="text-[#eefb7a] underline underline-offset-2">UploadFlow privacy policy</a>.</p>
        </div>
      </article>
    </main>
  );
}
