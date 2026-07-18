import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | UploadFlow',
  description:
    'How the UploadFlow Chrome extension handles files, website content, Post Bundles, Site presets, pending drafts, local memory, and optional network features.'
};

const updatedAt = 'July 18, 2026';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0b0d0f] px-5 py-12 text-white sm:px-8 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <a href="/" className="text-[10px] font-bold uppercase tracking-[.16em] text-[#eefb7a]">
          ← UploadFlow
        </a>
        <p className="mt-12 text-[9px] font-black uppercase tracking-[.22em] text-emerald-400">Privacy policy · Updated {updatedAt}</p>
        <h1 className="mt-5 text-5xl leading-[.9] sm:text-7xl">
          Your files stay
          <br />
          under your control.
        </h1>
        <p className="mt-7 text-base leading-7 text-white/60">
          This policy explains how the UploadFlow Chrome extension handles information when you use upload interception, file editing, media
          inspection, URL import, Post Bundles, Site presets, pending-draft replacement, downloads, optional Media Memory, and optional
          image upscaling.
        </p>

        <div className="mt-14 space-y-10 text-sm leading-7 text-white/60">
          <section>
            <h2 className="text-xl text-white">Single purpose</h2>
            <p className="mt-3">
              UploadFlow’s single purpose is to let users move and prepare media they own or are authorized to use for another website’s
              upload flow without first managing a permanent local download. URL capture, Post Bundles, Site presets, on-demand fetching,
              review, editing, pending-draft replacement, upload interception, and optional Chrome downloads are related parts of that
              user-directed media handoff.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Information handled</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Files that you select, paste, drop, import, edit, or approve for upload.</li>
              <li>
                Website content and resources needed to detect file-upload actions and, when Inspect Mode is enabled, media URLs on the
                page.
              </li>
              <li>Media URLs you explicitly capture or save for use on another website, limited to 20 entries.</li>
              <li>
                Post Bundle fields you explicitly approve during capture or editing, which may include ordered media references, title,
                caption, attribution, links, hashtags, cover relationships, and per-media alt text. Unrelated webpage content is not
                included by default.
              </li>
              <li>
                Site presets you create, including hostname patterns, file limits, filename templates, preparation choices, optional brand
                references, and optional CSS selectors for destination draft fields. UploadFlow stores the selectors, not a continuing copy
                of the field values found on websites.
              </li>
              <li>Local settings, download identifiers, file names, file types, file sizes, and optimization totals.</li>
              <li>
                If you explicitly enable experimental Live Draft Sync, session-only records identifying connected destination tabs, frames, upload inputs,
                accepted file types, file metadata, exact file fingerprints, and destination page URL. These records describe pending local
                attachments and do not indicate that a post was published.
              </li>
              <li>
                If you explicitly enable Private Media Memory, bounded local records containing source references, destination hostnames,
                media-family and version relationships, editor tool, output metadata, timestamps, descriptions, tags, deliveries, and
                fingerprints used for local identity or similarity features.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white">Local processing and storage</h2>
            <p className="mt-3">
              Image optimization, privacy scanning and redaction, smart cropping, background tools, watermarking, fingerprint calculation,
              Post Bundle assembly, platform-pack creation, ZIP assembly, and packaged FFmpeg Wasm video editing run locally in your
              browser. Settings, saved URLs, Post Bundles, Site presets, brand kits, platform packs, download identifiers, and aggregate
              file statistics are stored in Chrome’s local extension storage. If Private Media Memory is enabled, its bounded media-family,
              version, delivery, and fingerprint metadata is also stored locally. Privacy scan findings, video frames, corrected Live Draft
              Sync file bytes, rollback file bytes, and temporary editor output bytes are not written to persistent extension storage.
            </p>
            <p className="mt-3">
              Experimental Live Draft Sync is disabled by default. When enabled, it keeps its connected-input registry in Chrome session storage and keeps a reversible previous{' '}
              <code className="text-white/80">FileList</code> only in the receiving content script’s memory. Corrected file bytes pass
              temporarily between UploadFlow extension contexts so the selected open draft can be updated; they are not sent to an
              UploadFlow server by that feature. UploadFlow does not operate an analytics service, advertising service, user account system,
              or cloud file drive.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Post Bundles, Site presets, and draft insertion</h2>
            <p className="mt-3">
              Post capture begins only after you choose UploadFlow’s capture action. UploadFlow detects the nearest supported post or
              carousel and presents the detected media and text fields for review. Only the fields you approve are saved to the bundle. A
              Post Bundle can later insert ordered media into a compatible upload input and, where you have configured a matching Site
              preset, fill the draft fields represented by that preset’s selectors.
            </p>
            <p className="mt-3">
              Site presets and Post Bundle insertion prepare a local draft. They do not click a website’s publish, post, schedule, purchase,
              or submit control. Destination websites may reject files or fields according to their own rules, and UploadFlow does not treat
              attempted insertion as proof of publication.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Pending attachments and Live Draft Sync</h2>
            <p className="mt-3">
              Live Draft Sync is an opt-in experimental feature whose compatibility varies by website. UploadFlow tracks an attachment only when it placed the file into a supported, currently connected webpage input and the input still
              contains the exact expected files after its change handlers run. Before replacing a file, UploadFlow checks the exact
              fingerprint again and requires you to select and confirm the connected destinations.
            </p>
            <p className="mt-3">
              Tracking stops when the input changes, its form is submitted, the tab or frame disconnects, UploadFlow is disabled, or you
              clear the draft session. UploadFlow does not use Live Draft Sync to alter submitted, published, scheduled, reloaded,
              disconnected, identity-mismatched, or unsupported content. A site that manages attachments outside its file input requires
              manual replacement.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Network transfers</h2>
            <p className="mt-3">UploadFlow transfers data only when needed for an action you initiate:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Cross-site media handoff:</strong> the extension requests the source URL you selected so it
                can create a temporary file for the destination website’s input. The request is sent to the source website only when you
                choose that item.
              </li>
              <li>
                <strong className="text-white">AI upscaling:</strong> when you explicitly start upscaling, the selected image is sent over
                HTTPS to UploadFlow’s API and its image-processing provider, iLoveIMG, to produce the requested result.
              </li>
              <li>
                <strong className="text-white">Downloads:</strong> URLs you choose to download are handed to Chrome’s Downloads API and
                requested from the source website.
              </li>
            </ul>
            <p className="mt-3">Do not use AI upscaling for a file you do not want transmitted to the stated processing providers.</p>
            <p className="mt-3">
              UploadFlow does not grant rights to media. You are responsible for ensuring you own or are authorized to reuse and upload the
              selected content.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Sharing, advertising, and sale</h2>
            <p className="mt-3">
              UploadFlow does not sell user data, use it for advertising, transfer it to data brokers, or allow humans to read file
              contents. Data is transferred only as necessary to perform a user-requested feature, comply with law, or protect against
              security abuse.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Retention and deletion</h2>
            <p className="mt-3">
              Files being edited and Live Draft Sync rollback files are kept in browser memory for the active connected workflow.
              Pending-draft registry records use session storage and are removed when their receiver disconnects or another clearing
              condition described above occurs. Private Media Memory is optional; if enabled, it uses the retention period you select—7, 30,
              or 90 days—and supports export, per-destination deletion, and clear-all deletion.
            </p>
            <p className="mt-3">
              Post Bundles, saved URLs, Site presets, brand kits, platform packs, other settings, and aggregate statistics remain in local
              extension storage until you delete or reset the applicable record or uninstall the extension. Saved URLs and bundles can be
              removed through their workspaces. Third-party source websites and the optional upscaling provider may have their own retention
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Chrome Web Store Limited Use</h2>
            <p className="mt-3">
              The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited
              Use requirements. UploadFlow limits use of data to providing its disclosed file-control features.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Security and changes</h2>
            <p className="mt-3">
              Network features use HTTPS. No method of storage or transmission is completely secure. This policy may be updated when
              UploadFlow’s behavior or legal obligations change; the updated date will appear above.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white">Contact</h2>
            <p className="mt-3">
              For privacy questions or deletion assistance, use the publisher support contact shown on UploadFlow’s Chrome Web Store listing
              or visit the{' '}
              <a href="/support" className="text-[#eefb7a] underline underline-offset-2">
                support page
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
