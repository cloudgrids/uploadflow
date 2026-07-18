# UploadFlow

![UploadFlow moving authorized media between websites](public/features/product-overview-actual.png)

[UploadFlow](https://uploadflow.cloudgrids.tech) is a local-first Chrome extension for moving media you own or are authorized to reuse from one website into another website’s upload flow—without first saving a permanent copy in Downloads.

It brings capture, organization, preparation, review, and upload handoff into one private browser workspace. UploadFlow does not bypass authentication, paywalls, expiring signatures, hotlink protection, access controls, or usage rights.

## How UploadFlow works

1. **Capture the source.** Hover or right-click supported media, use Inspect Mode, or paste a direct HTTP/HTTPS media URL.
2. **Save the reference.** UploadFlow keeps a bounded URL reference in the local media shelf instead of silently downloading every file.
3. **Prepare the media.** Optimize, crop, redact, watermark, upscale, batch-process, or trim supported files before upload.
4. **Open the destination.** Click a file input on another website and select the saved media through the UploadFlow picker.
5. **Review and hand off.** UploadFlow fetches the source when requested, checks compatibility, and returns the approved `File` to the original upload flow.

![Cross-site capture and upload handoff](public/features/cross-site-handoff.png)

## One workspace, three surfaces

### Quick popup

Capture a URL, inspect recent media, enable or disable interception, and move directly into the appropriate editor.

### Persistent media shelf

The Chrome side panel keeps authorized media references available while moving between tabs. Search, tag, favourite, collect, reorder, select, batch-process, and prepare destination-specific variants.

![UploadFlow persistent media shelf](public/features/media-shelf-actual.png)

### Full preparation editor

The full workspace provides focused editors while preserving the original file. A completed output can be passed into any compatible editor before it is handed to a destination website.

![UploadFlow workspace settings](public/features/workspace-settings-actual.png)

## Preparation tools

### Optimize

Resize, compress, rename, convert between supported image formats, inspect metadata, and export a clean upload-ready image.

![UploadFlow image optimization workspace](public/features/optimize-actual.png)

### Crop and compose

Create square, portrait, landscape, and thumbnail compositions with adjustable focus and preview controls.

![UploadFlow crop workspace](public/features/crop-actual.png)

### Redact private regions

Blur or cover selected regions, review the cleaned preview, and apply the result only after confirming the before-and-after view.

![UploadFlow redaction workspace](public/features/redact-actual.png)

### Apply watermarks and brand kits

Reuse text or saved brand variants with configurable position, font, colour, alignment, and baseline.

![UploadFlow watermark workspace](public/features/watermark-actual.png)

### Upscale images

Choose a supported enlargement factor, review estimated output dimensions, and compare the generated result with the original. Upscaling is an explicit network action.

![UploadFlow upscaling workspace](public/features/upscale-actual.png)

### Prepare video

Trim MP4 files through fast stream copying when no transformation is needed. Crop, resize, speed, bitrate, audio, and format changes use the locally packaged FFmpeg Wasm renderer. Cover frames can be selected independently.

### Batch and platform packs

Process compatible selected media through a bounded queue, generate reusable destination variants, and download completed outputs together as a ZIP.

![UploadFlow batch and platform-pack workspace](public/features/batch-packs-actual.png)

### Browser-managed downloads

Explicit downloads are handed to Chrome so progress and saving continue safely after UploadFlow closes.

![UploadFlow download activity](public/features/downloads-actual.png)

## Privacy and permissions

Image preparation, metadata review, redaction, cropping, watermarking, duplicate checks, ZIP assembly, batches, platform packs, and FFmpeg Wasm video processing run locally in the extension.

Network access occurs only when the user explicitly retrieves a saved source URL or invokes optional AI upscaling. Private workflow history is disabled by default, bounded by the selected retention period, and user-deletable. UploadFlow does not operate an analytics service, advertising service, account system, or cloud media drive.

The extension requests website access to detect upload inputs and provide user-triggered media inspection across source and destination websites. Storage keeps extension preferences and bounded shelf records. Downloads lets explicit saves continue through Chrome. Side Panel provides the persistent shelf.

Read the complete [privacy policy](https://uploadflow.cloudgrids.tech/privacy).

## Compatibility boundaries

- Direct public HTTP and HTTPS media URLs work best.
- Signed or temporary URLs stop working after their source-defined expiry.
- Authenticated, protected, hotlink-blocked, blob, or streamed media might not be retrievable.
- Fast video trimming is available for compatible MP4 streams; transformations require local re-encoding.
- UploadFlow never grants permission to reuse media and does not circumvent source restrictions.

## Publishing and public resources

UploadFlow is developed and published by [CloudGrids](https://cloudgrids.tech/) under the publisher name **CLOUDGRIDS TECH**.

- [Official website](https://uploadflow.cloudgrids.tech/)
- [Detailed product guide](https://uploadflow.cloudgrids.tech/how-it-works)
- [Live demonstration](https://uploadflow.cloudgrids.tech/demo)
- [Privacy policy](https://uploadflow.cloudgrids.tech/privacy)
- [Support](https://uploadflow.cloudgrids.tech/support)
- [Report an issue or request a feature](https://github.com/cloudgrids/uploadflow/issues/new/choose)

Public listing and social assets are maintained in [`public/`](public/), including the Open Graph image, share preview, screenshots, workflow diagrams, posters, and demonstration video.
