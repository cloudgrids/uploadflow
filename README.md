# UploadFlow

![UploadFlow — control every upload](public/og-image.png)

UploadFlow is a Chrome extension that intercepts files before they leave the browser. Review, optimize, redact, watermark, or upscale a file in a private workspace, then return the finished file to the webpage that requested it.

Everything except optional AI upscaling runs locally. Original files remain untouched until you approve the result.

[Visit UploadFlow](https://uploadflow.cloudgrids.tech) · [Watch the vertical demo](public/media/uploadflow-social-vertical.mp4)

## Preview

[![Watch the UploadFlow product demo](public/social/share-preview.png)](public/media/uploadflow-social-vertical.mp4)

The demo follows the complete flow: intercept a file, review it in the workspace, apply an edit, and return it to the original page. Select the image above to play the MP4.

![UploadFlow demo states](public/social/demo-contact-sheet.png)

## Features

- Intercepts file inputs, drag and drop, paste, and supported page API uploads.
- Optimizes and converts PNG, JPEG, and WebP images before upload.
- Redacts email addresses, phone numbers, payment-card numbers, and IP addresses.
- Adds configurable text watermarks with a live preview.
- Upscales images through the UploadFlow API when enabled.
- Detects webpage images, video, and audio through an optional media inspector.
- Hands downloads to Chrome so progress and completed transfers remain visible in the browser.
- Offers either the native file picker or an UploadFlow URL picker.
- Stores settings and statistics in Chrome extension storage.

## How it works

```mermaid
flowchart LR
    A[Choose, drop, or paste a file] --> B[UploadFlow intercepts the event]
    B --> C[Review and edit locally]
    C -->|Continue| D[Return the processed File]
    D --> E[Original webpage upload resumes]
    C -->|Cancel| F[Discard the result]
```

UploadFlow listens before the website receives the file event. When you continue, it supplies the processed `File` back to the original input or page API. Cancelling closes the workspace without uploading the edited result.

## Install locally

Requirements: Node.js 20 or newer, npm, and a Chromium-based browser.

```bash
npm install
npm run build
```

Then install the generated extension:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project's `dist` directory.
5. Pin UploadFlow and enable upload interception from its popup.

After rebuilding, select **Reload** on the extension card. Existing tabs may also need to be refreshed because their old content-script context is no longer valid.

## Development

```bash
npm run dev       # start the Vite web app
npm run build     # type-check and build web, content, and main-world bundles
npm run lint      # run ESLint
npm run preview   # preview the production web build
```

The local Vite page is useful for the landing and test routes. Chrome runs the production extension from `dist`; it does not depend on the Vite development server after `npm run build`.

## Project structure

```text
api/                    optional serverless API routes
public/                 manifest, icons, screenshots, and social media
src/background/         service worker, downloads, and URL file fetching
src/content/            DOM interception, overlay, media inspector, URL picker
src/main-world/         wrappers that run in the webpage's JavaScript world
src/components/         workspace, landing page, editors, and downloads UI
src/settings/           extension settings panels and models
src/services/           storage, configuration, statistics, and API clients
src/upscaler/           image upscaling integration
```

## Permissions

UploadFlow uses these Manifest V3 permissions:

- `storage` — save settings and local statistics.
- `downloads` — create browser-managed downloads.
- `scripting` and `activeTab` — connect extension behavior to the current page.
- `http://*/*` and `https://*/*` host access — detect upload targets and retrieve user-selected URL files where the remote server permits access.

Some protected, expiring, authenticated, or hotlink-blocked media URLs can still return `403`. UploadFlow does not bypass a website's authentication or access controls.

## Privacy

Image optimization, redaction, and watermarking happen on the device. UploadFlow does not use a cloud drive as an intermediary. Network access is required for URL imports and optional upscaling, and those operations remain subject to the source site's access policy.

## Social assets

- [Open Graph image](public/og-image.png)
- [Landscape share preview](public/share-preview.png)
- [Vertical video poster](public/media/uploadflow-social-poster.jpg)
- [Vertical social video](public/media/uploadflow-social-vertical.mp4)
- [Storyboard](public/social/storyboard-contact-sheet.png)
