import type { Metadata } from 'next';
import { PageHero, SitePage, StatusLine } from '../../components/site/SiteChrome';

export const metadata: Metadata = {
  title: 'Privacy Policy | UploadFlow',
  description:
    'How the UploadFlow Chrome extension handles files, website content, Post Bundles, Site presets, pending drafts, local memory, and optional network features.'
};

const updatedAt = 'July 18, 2026';

export default function PrivacyPage() {
  return (
    <SitePage>
      <article>
          <PageHero
            eyebrow={`Privacy policy · Updated ${updatedAt}`}
            title={<>Your files stay <span className="uf-hl">under your control.</span></>}
            lede="This policy explains how the UploadFlow Chrome extension handles information when you use upload interception, file editing, media inspection, URL import, Post Bundles, Site presets, pending-draft replacement, downloads, optional Media Memory, and optional image upscaling."
            aside={
              <div className="uf-card">
                <StatusLine label="Default processing" value="Local" />
                <StatusLine label="Media Memory" value="Optional" />
                <StatusLine label="Publishing" value="Never automatic" />
              </div>
            }
          />

          <div className="uf-wrap uf-section uf-stack">
            <section id="purpose" className="uf-card uf-prose">
              <h2>Single purpose</h2>
              <p>
                UploadFlow’s single purpose is to let users move and prepare media they own or are authorized to use for another website’s
                upload flow without first managing a permanent local download. URL capture, Post Bundles, Site presets, on-demand fetching,
                review, editing, pending-draft replacement, upload interception, and optional Chrome downloads are related parts of that
                user-directed media handoff.
              </p>
            </section>

            <section id="information" className="uf-card uf-prose">
              <h2>Information handled</h2>
              <ul>
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

            <section id="local-processing" className="uf-card uf-prose">
              <h2>Local processing and storage</h2>
              <p>
                Image optimization, privacy scanning and redaction, smart cropping, background tools, watermarking, fingerprint calculation,
                Post Bundle assembly, platform-pack creation, ZIP assembly, and packaged FFmpeg Wasm video editing run locally in your
                browser. Settings, saved URLs, Post Bundles, Site presets, brand kits, platform packs, download identifiers, and aggregate
                file statistics are stored in Chrome’s local extension storage. If Private Media Memory is enabled, its bounded media-family,
                version, delivery, and fingerprint metadata is also stored locally. Privacy scan findings, video frames, corrected Live Draft
                Sync file bytes, rollback file bytes, and temporary editor output bytes are not written to persistent extension storage.
              </p>
              <p>
                Experimental Live Draft Sync is disabled by default. When enabled, it keeps its connected-input registry in Chrome session storage and keeps a reversible previous{' '}
                <code>FileList</code> only in the receiving content script’s memory. Corrected file bytes pass
                temporarily between UploadFlow extension contexts so the selected open draft can be updated; they are not sent to an
                UploadFlow server by that feature. UploadFlow does not operate an analytics service, advertising service, user account system,
                or cloud file drive.
              </p>
            </section>

            <section id="bundles-presets" className="uf-card uf-prose">
              <h2>Post Bundles, Site presets, and draft insertion</h2>
              <p>
                Post capture begins only after you choose UploadFlow’s capture action. UploadFlow detects the nearest supported post or
                carousel and presents the detected media and text fields for review. Only the fields you approve are saved to the bundle. A
                Post Bundle can later insert ordered media into a compatible upload input and, where you have configured a matching Site
                preset, fill the draft fields represented by that preset’s selectors.
              </p>
              <p>
                Site presets and Post Bundle insertion prepare a local draft. They do not click a website’s publish, post, schedule, purchase,
                or submit control. Destination websites may reject files or fields according to their own rules, and UploadFlow does not treat
                attempted insertion as proof of publication.
              </p>
            </section>

            <section id="live-draft-sync" className="uf-card uf-prose">
              <h2>Pending attachments and Live Draft Sync</h2>
              <p>
                Live Draft Sync is an opt-in experimental feature whose compatibility varies by website. UploadFlow tracks an attachment only when it placed the file into a supported, currently connected webpage input and the input still
                contains the exact expected files after its change handlers run. Before replacing a file, UploadFlow checks the exact
                fingerprint again and requires you to select and confirm the connected destinations.
              </p>
              <p>
                Tracking stops when the input changes, its form is submitted, the tab or frame disconnects, UploadFlow is disabled, or you
                clear the draft session. UploadFlow does not use Live Draft Sync to alter submitted, published, scheduled, reloaded,
                disconnected, identity-mismatched, or unsupported content. A site that manages attachments outside its file input requires
                manual replacement.
              </p>
            </section>

            <section id="network-transfers" className="uf-card uf-prose">
              <h2>Network transfers</h2>
              <p>UploadFlow transfers data only when needed for an action you initiate:</p>
              <ul>
                <li>
                  <strong>Cross-site media handoff:</strong> the extension requests the source URL you selected so it
                  can create a temporary file for the destination website’s input. The request is sent to the source website only when you
                  choose that item.
                </li>
                <li>
                  <strong>Downloads:</strong> URLs you choose to download are handed to Chrome’s Downloads API and
                  requested from the source website.
                </li>
              </ul>
              <p>
                Upscaling no longer appears in this list. It once used an external image-processing provider and now runs
                entirely in your browser, so the image is not transmitted anywhere.
              </p>
              <p>
                UploadFlow does not grant rights to media. You are responsible for ensuring you own or are authorized to reuse and upload the
                selected content.
              </p>
            </section>

            <section id="sharing" className="uf-card uf-prose">
              <h2>Sharing, advertising, and sale</h2>
              <p>
                UploadFlow does not sell user data, use it for advertising, transfer it to data brokers, or allow humans to read file
                contents. Data is transferred only as necessary to perform a user-requested feature, comply with law, or protect against
                security abuse.
              </p>
            </section>

            <section id="retention" className="uf-card uf-prose">
              <h2>Retention and deletion</h2>
              <p>
                Files being edited and Live Draft Sync rollback files are kept in browser memory for the active connected workflow.
                Pending-draft registry records use session storage and are removed when their receiver disconnects or another clearing
                condition described above occurs. Private Media Memory is optional; if enabled, it uses the retention period you select—7, 30,
                or 90 days—and supports export, per-destination deletion, and clear-all deletion.
              </p>
              <p>
                Post Bundles, saved URLs, Site presets, brand kits, platform packs, other settings, and aggregate statistics remain in local
                extension storage until you delete or reset the applicable record or uninstall the extension. Saved URLs and bundles can be
                removed through their workspaces. Third-party source websites and the optional upscaling provider may have their own retention
                policies.
              </p>
            </section>

            <section id="limited-use" className="uf-card uf-prose">
              <h2>Chrome Web Store Limited Use</h2>
              <p>
                The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited
                Use requirements. UploadFlow limits use of data to providing its disclosed file-control features.
              </p>
            </section>

            <section id="security" className="uf-card uf-prose">
              <h2>Security and changes</h2>
              <p>
                Network features use HTTPS. No method of storage or transmission is completely secure. This policy may be updated when
                UploadFlow’s behavior or legal obligations change; the updated date will appear above.
              </p>
            </section>

            <section id="contact" className="uf-card uf-prose">
              <h2>Contact</h2>
              <p>
                For privacy questions or deletion assistance, use the publisher support contact shown on UploadFlow’s Chrome Web Store listing
                or visit the{' '}
                <a href="/support">
                  support page
                </a>
                .
              </p>
            </section>
          </div>
      </article>
    </SitePage>
  );
}
