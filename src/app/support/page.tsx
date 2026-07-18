import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | UploadFlow',
  description: 'Get help with UploadFlow, report a problem, or learn how to delete locally stored extension data.'
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#0b0d0f] px-5 py-12 text-white sm:px-8 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <a href="/" className="text-[10px] font-bold uppercase tracking-[.16em] text-[#eefb7a]">
          ← UploadFlow
        </a>
        <p className="mt-12 text-[9px] font-black uppercase tracking-[.22em] text-emerald-400">Extension support</p>
        <h1 className="mt-5 text-5xl leading-[.9] sm:text-7xl">
          Help with files
          <br />
          in motion.
        </h1>
        <p className="mt-7 text-base leading-7 text-white/60">
          Use the steps below before reporting an issue. Never include private files, signed media URLs, passwords, tokens, or personal
          information in a public report.
        </p>

        <div className="mt-14 space-y-8">
          <section id="launch-list" className="rounded-2xl border border-[#eefb7a]/25 bg-[#eefb7a]/8 p-6">
            <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#eefb7a]">Before Chrome Web Store approval</p>
            <h2 className="mt-3 text-xl">Join the launch list</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">
              Follow the UploadFlow repository and choose <strong className="text-white">Watch → Custom → Releases</strong> to receive the
              public-install announcement. The website’s primary button will switch to Add to Chrome when the Web Store URL is available.
            </p>
            <a
              href="https://github.com/cloudgrids/uploadflow"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#eefb7a] px-5 text-[9px] font-black uppercase tracking-wider text-[#0b0d0f]"
            >
              Follow launch updates ↗
            </a>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-xl">Troubleshooting</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-white/55">
              <li>Open UploadFlow Settings and confirm upload interception is enabled.</li>
              <li>After an extension update, reload the extension and refresh existing webpage tabs.</li>
              <li>Confirm the source URL is direct, still valid, and allows browser access.</li>
              <li>
                Try the supported flows at{' '}
                <a href="/test" className="text-[#eefb7a] underline underline-offset-2">
                  the test page
                </a>
                .
              </li>
            </ol>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-xl">Delete local data</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">
              Private workflow history is disabled by default and can be cleared completely or per destination from UploadFlow Settings.
              Remove shelf records individually, or uninstall UploadFlow from <code className="text-white">chrome://extensions</code> to
              remove every extension setting and local record.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <h2 className="text-xl">Report a problem</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">
              Open a GitHub issue and include the website, Chrome version, expected behavior, actual behavior, and reproducible steps.
              Replace private URLs with safe examples and never attach confidential files.
            </p>
            <a
              href="https://github.com/cloudgrids/uploadflow/issues/new/choose"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#eefb7a] px-5 text-[9px] font-black uppercase tracking-wider text-[#0b0d0f]"
            >
              Open an issue or feature request ↗
            </a>
          </section>

          <p className="text-sm text-white/45">
            For privacy information, see the{' '}
            <a href="/privacy" className="text-[#eefb7a] underline underline-offset-2">
              UploadFlow privacy policy
            </a>
            .
          </p>
        </div>
      </article>
    </main>
  );
}
