import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | UploadFlow',
  description: 'How the UploadFlow Chrome extension handles files, website content, URLs, settings, and optional network features.'
};

const updatedAt = 'July 18, 2026';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0b0d0f] px-5 py-12 text-white sm:px-8 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <a href="/" className="text-[10px] font-bold uppercase tracking-[.16em] text-[#eefb7a]">← UploadFlow</a>
        <p className="mt-12 text-[9px] font-black uppercase tracking-[.22em] text-emerald-400">Privacy policy · Updated {updatedAt}</p>
        <h1 className="mt-5 text-5xl leading-[.9] sm:text-7xl">Your files stay<br />under your control.</h1>
        <p className="mt-7 text-base leading-7 text-white/60">This policy explains how the UploadFlow Chrome extension handles information when you use upload interception, file editing, media inspection, URL import, downloads, and optional image upscaling.</p>

        <div className="mt-14 space-y-10 text-sm leading-7 text-white/60">
          <section>
            <h2 className="text-xl text-white">Single purpose</h2>
            <p className="mt-3">UploadFlow’s single purpose is to let users move media they own or are authorized to use from one webpage into another website’s upload flow without first downloading a permanent local copy. URL capture, on-demand fetching, review, editing, upload interception, and optional Chrome downloads are related parts of that cross-site media handoff.</p>
          </section>

          <section>
            <h2 className="text-xl text-white">Information handled</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Files that you select, paste, drop, import, edit, or approve for upload.</li>
              <li>Website content and resources needed to detect file-upload actions and, when Inspect Mode is enabled, media URLs on the page.</li>
              <li>Media URLs you explicitly capture or save for use on another website, limited to 20 entries.</li>
              <li>Local settings, download identifiers, file names, file sizes, and optimization totals.</li>
              <li>If you explicitly enable Private Workflow History, bounded local records containing destination hostname, source filename reference, editor tool, output metadata, and timestamp.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white">Local processing and storage</h2>
            <p className="mt-3">Image optimization, privacy scanning and redaction, smart cropping, background tools, watermarking, duplicate fingerprints, platform-pack creation, ZIP assembly, and packaged FFmpeg Wasm video editing run locally in your browser. Settings, saved URLs, download identifiers, presets, brand kits, platform packs, and aggregate file statistics are stored in Chrome’s local extension storage. Duplicate fingerprints, scan findings, video frames, and temporary output bytes are not persisted. UploadFlow does not operate an analytics service, advertising service, user account system, or cloud file drive.</p>
          </section>

          <section>
            <h2 className="text-xl text-white">Network transfers</h2>
            <p className="mt-3">UploadFlow transfers data only when needed for an action you initiate:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-white">Cross-site media handoff:</strong> the extension requests the source URL you selected so it can create a temporary file for the destination website’s input. The request is sent to the source website only when you choose that item.</li>
              <li><strong className="text-white">AI upscaling:</strong> when you explicitly start upscaling, the selected image is sent over HTTPS to UploadFlow’s API and its image-processing provider, iLoveIMG, to produce the requested result.</li>
              <li><strong className="text-white">Downloads:</strong> URLs you choose to download are handed to Chrome’s Downloads API and requested from the source website.</li>
            </ul>
            <p className="mt-3">Do not use AI upscaling for a file you do not want transmitted to the stated processing providers.</p>
            <p className="mt-3">UploadFlow does not grant rights to media. You are responsible for ensuring you own or are authorized to reuse and upload the selected content.</p>
          </section>

          <section>
            <h2 className="text-xl text-white">Sharing, advertising, and sale</h2>
            <p className="mt-3">UploadFlow does not sell user data, use it for advertising, transfer it to data brokers, or allow humans to read file contents. Data is transferred only as necessary to perform a user-requested feature, comply with law, or protect against security abuse.</p>
          </section>

          <section>
            <h2 className="text-xl text-white">Retention and deletion</h2>
            <p className="mt-3">Files being edited are kept in browser memory for the active workflow. Private Workflow History is disabled by default; if enabled, it uses the retention period you select—7, 30, or 90 days—and supports per-destination and clear-all deletion. Other local settings and aggregate statistics remain until you delete or reset them, or uninstall the extension. Saved URL records can be removed individually. Third-party source websites and the optional upscaling provider may have their own retention policies.</p>
          </section>

          <section>
            <h2 className="text-xl text-white">Chrome Web Store Limited Use</h2>
            <p className="mt-3">The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements. UploadFlow limits use of data to providing its disclosed file-control features.</p>
          </section>

          <section>
            <h2 className="text-xl text-white">Security and changes</h2>
            <p className="mt-3">Network features use HTTPS. No method of storage or transmission is completely secure. This policy may be updated when UploadFlow’s behavior or legal obligations change; the updated date will appear above.</p>
          </section>

          <section>
            <h2 className="text-xl text-white">Contact</h2>
            <p className="mt-3">For privacy questions or deletion assistance, use the publisher support contact shown on UploadFlow’s Chrome Web Store listing or visit the <a href="/support" className="text-[#eefb7a] underline underline-offset-2">support page</a>.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
