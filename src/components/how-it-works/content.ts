import type { ProductStatus } from '../landing/content';

export interface GuideFeature {
  id: string;
  eyebrow: string;
  title: string;
  image?: string;
  imageLabel?: string;
  concept?: boolean;
  copy: string;
  points: string[];
  comingSoon?: boolean;
  status?: ProductStatus;
}

export interface ConfigurationGuide {
  id: string;
  title: string;
  summary: string;
  choices: string[];
}

export const configurationGroups = [
  {
    id: 'uploadflow',
    title: 'Upload interception',
    summary:
      'The main UploadFlow switch controls whether websites can be intercepted and whether UploadFlow can return reviewed files to their upload fields.',
    choices: [
      'Enable it when you want UploadFlow to handle file inputs, drops, paste actions, and supported page upload APIs.',
      'Disable it to leave normal website upload behaviour untouched.',
      'Disabling it also clears connected pending-draft tracking.'
    ]
  },
  {
    id: 'picker',
    title: 'File input picker',
    summary: 'Choose what opens when a website requests a file.',
    choices: [
      'UploadFlow URL picker: choose captured URLs, shelf items, or post-bundle media.',
      'Computer picker: use Chrome’s normal local-file dialog.',
      'This changes the starting source, not the destination website’s file requirements.'
    ]
  },
  {
    id: 'post-bundles',
    title: 'Post Bundles',
    summary:
      'Combine ordered media with reusable post information so a complete content package can move together instead of rebuilding it on every website.',
    choices: [
      'Capture a supported webpage post or create a bundle from selected Media Shelf items.',
      'Review the media order, title, caption, attribution, links, hashtags, cover role, and per-media alt text.',
      'Insert the ordered media into a compatible multi-file input, then map supported text fields through a Site preset.',
      'Unsupported text fields remain available for manual copy instead of being silently discarded.'
    ]
  },
  {
    id: 'live-draft-sync',
    title: 'Live Draft Sync — Experimental',
    summary:
      'Opt in to track files that UploadFlow placed into supported, connected upload fields before those files start uploading.',
    choices: [
      'Replacement requires explicit confirmation and never submits or publishes a form.',
      'Compatibility varies because websites may keep attachment state outside the native file input.',
      'Unsupported destinations show that a newer version is available and ask you to replace the attachment manually.',
      'Keep this disabled for the stable launch workflow.'
    ]
  },
  {
    id: 'cross-device-handoff',
    title: 'UploadFlow Handoff — Early Access',
    summary: 'Short-lived encrypted pairing groundwork is available; live phone-to-browser file transfer is still being completed.',
    choices: [
      'Pairing sessions are temporary and can be cancelled explicitly.',
      'Do not expect live encrypted file delivery in the current build.',
      'Handoff remains separate from the local-only core and will require its own reviewed privacy boundary.'
    ]
  },
  {
    id: 'language',
    title: 'Language',
    summary: 'Choose whether UploadFlow follows the browser language or uses a supported language explicitly.',
    choices: ['System follows Chrome’s current locale.', 'A selected language remains active until you change it again.']
  },
  {
    id: 'inspect',
    title: 'Inspect Mode',
    summary: 'Inspect Mode adds an UploadFlow action to media you deliberately hover on supported webpages.',
    choices: [
      'Turn it on when capturing authorized images, video, audio, or source URLs from webpages.',
      'Turn it off when you do not want hover controls on ordinary browsing pages.',
      'Inspect Mode only operates while UploadFlow itself is enabled.'
    ]
  },
  {
    id: 'image-defaults',
    title: 'Image defaults',
    summary: 'Set the format and quality UploadFlow should initially suggest when an image enters the optimization workflow.',
    choices: [
      'Auto optimize can prepare supported images without requiring the same initial choices each time.',
      'Default format and quality are starting values; you can still review the result before continuing.'
    ]
  },
  {
    id: 'text-privacy',
    title: 'Text privacy defaults',
    summary: 'Choose which recognizable text patterns should be masked when text redaction is used.',
    choices: [
      'Email, phone, payment-card, and IPv4 detection can be enabled independently.',
      'These options configure text redaction; image-region redaction remains a separate reviewed action.'
    ]
  },
  {
    id: 'watermark-defaults',
    title: 'Watermark defaults',
    summary: 'Save the watermark text and visual defaults you normally want UploadFlow to begin with.',
    choices: [
      'Configure text, position, font, size, colour, alignment, and baseline once.',
      'The watermark workspace still shows a preview before the output is applied.'
    ]
  },
  {
    id: 'upscaling',
    title: 'Upscaling',
    summary: 'Control whether network-backed upscaling is available and which enlargement factor is selected initially.',
    choices: [
      'Keep it disabled if every preparation action must remain local.',
      'Enable it only when you intend to send an image to the configured processing service.',
      '2x and supported 4x options determine the initial resolution request.'
    ]
  },
  {
    id: 'site-presets',
    title: 'Site presets',
    summary:
      'Describe how UploadFlow should prepare media and insert Post Bundle fields for specific destination websites or hostname patterns.',
    choices: [
      'Match exact hosts or wildcard host patterns.',
      'Set file limits, filename templates, transforms, output format, quality, size, and optional branding.',
      'Choose which preset is enabled when several saved rules exist.',
      'Optional title, body, link, and hashtag selectors map only an explicitly inserted Post Bundle.',
      'A Site preset prepares and fills a draft; it never submits or publishes the destination form.'
    ]
  },
  {
    id: 'brand-kits',
    title: 'Brand kits',
    summary: 'Store reusable visual identity choices for repeated creator or campaign work.',
    choices: [
      'Save names, usernames, websites, fonts, colours, logo placement, and watermark variants.',
      'A destination preset or platform pack can reference a saved kit instead of rebuilding the same branding.'
    ]
  },
  {
    id: 'platform-packs',
    title: 'Platform packs',
    summary: 'Define a named set of output variants that should be generated together.',
    choices: [
      'Choose each variant’s dimensions, format, quality, watermark behaviour, and optional destination preset.',
      'Use packs for repeatable square, portrait, landscape, preview, thumbnail, or high-quality deliverables.'
    ]
  },
  {
    id: 'media-memory',
    title: 'Private Media Memory',
    summary: 'Choose whether UploadFlow remembers explicit captures, transformations, versions, and deliveries as local workflow metadata.',
    choices: [
      'It is optional and does not record general browsing activity.',
      'Choose a 7, 30, or 90-day retention period.',
      'Export the local record, remove one destination’s history, or erase everything.'
    ]
  }
] satisfies ConfigurationGuide[];

export const featureGroups = [
  {
    id: 'capture',
    eyebrow: '01 · Capture',
    title: 'Collect an authorized source',
    image: '/features/cross-site-handoff.png',
    copy: 'Enable Inspect Mode for hover controls, use the UploadFlow context menu, or paste a direct media URL. UploadFlow stores a bounded source reference rather than silently downloading every file.',
    points: [
      'Images, video, audio, and media links',
      'Optional hover inspection and right-click capture',
      'Signed and protected URLs remain subject to source access rules'
    ]
  },
  {
    id: 'shelf',
    eyebrow: '02 · Organize',
    title: 'Keep media available across tabs',
    image: '/features/media-shelf-actual.png',
    copy: 'The persistent side panel uses the same local shelf as the picker and editor. Search, tag, favourite, collect, select, and track work while moving from source to destination websites.',
    points: [
      'Bounded local shelf of source references',
      'Collections, tags, favourites, and multi-select',
      'Queue progress, retry, cancellation, and completed-item removal'
    ],
    comingSoon: true
  },
  {
    id: 'prepare',
    eyebrow: '03 · Prepare',
    title: 'Choose the depth the task needs',
    image: '/features/workspace-settings-actual.png',
    imageLabel: 'Working development build · Settings workspace',
    copy: 'Use quick actions in the popup, manage several items in the side panel, or open the full workspace. Settings control interception, pickers, editor defaults, presets, brand kits, packs, and optional history.',
    points: [
      'Optimize and convert images',
      'Crop, redact, watermark, upscale, or prepare supported video',
      'Destination presets, filename templates, and reusable brand kits'
    ],
    comingSoon: true
  },
  {
    id: 'optimize',
    eyebrow: '04 · Optimize',
    title: 'Make images upload-ready',
    image: '/features/optimize-actual.png',
    imageLabel: 'Released feature · Current Optimize workspace',
    copy: 'Resize, compress, convert, rename, and remove supported metadata while comparing the current output against the original.',
    points: ['JPEG, PNG, and WebP output choices', 'Independent dimension and quality controls', 'Local metadata scan and clean export']
  },
  {
    id: 'crop',
    eyebrow: '05 · Compose',
    title: 'Crop for the destination',
    image: '/features/crop-actual.png',
    imageLabel: 'Working development build · Beta Crop workspace',
    copy: 'Prepare square, portrait, landscape, and thumbnail compositions. Focus controls and preview zoom keep framing deliberate before the crop is applied.',
    points: [
      'Reusable destination aspect ratios',
      'Adjustable horizontal and vertical focus',
      'Preview before replacing the current draft'
    ],
    comingSoon: true
  },
  {
    id: 'redact',
    eyebrow: '06 · Protect',
    title: 'Redact private regions',
    image: '/features/redact-actual.png',
    imageLabel: 'Released feature · Current Redact workspace',
    copy: 'Draw blur or cover regions on the original, preview the cleaned result, and apply only after reviewing the before-and-after workspace.',
    points: ['Manual privacy regions', 'Undo, redo, and clear-region controls', 'Temporary preview before applying the output']
  },
  {
    id: 'watermark',
    eyebrow: '07 · Brand',
    title: 'Apply a reusable watermark',
    image: '/features/watermark-actual.png',
    imageLabel: 'Released feature · Current Watermark workspace',
    copy: 'Use custom text or a saved brand-kit variant, then control placement, font, colour, alignment, and baseline against a live preview.',
    points: ['Text and brand-kit variants', 'Nine-point positioning', 'Reusable visual identity across outputs']
  },
  {
    id: 'upscale',
    eyebrow: '08 · Resolve',
    title: 'Upscale when resolution is missing',
    image: '/features/upscale-actual.png',
    imageLabel: 'Working development build · Network-backed beta',
    copy: 'Choose a supported enlargement factor, inspect the estimated output dimensions, and compare the generated result with the original.',
    points: ['2x and supported 4x resolution modes', 'Before-and-after review', 'Explicit network action to the configured processor']
  },
  {
    id: 'batch',
    eyebrow: '09 · Scale',
    title: 'Build batches and platform variants',
    image: '/features/batch-packs-actual.png',
    imageLabel: 'Working development build · Beta side-panel controls',
    copy: 'Selected compatible items can enter a bounded queue. Platform packs generate purposeful variants with deterministic names and can be downloaded together as a locally assembled ZIP.',
    points: [
      'Bounded URL and CPU-heavy work concurrency',
      'Per-item progress, retry, cancellation, and errors',
      'Square, portrait, landscape, thumbnail, preview, and high-quality variants'
    ],
    comingSoon: true
  },
  {
    id: 'video',
    eyebrow: '10 · Video',
    title: 'Trim and prepare video locally',
    image: '/features/editor-workspace.png',
    imageLabel: 'Prototype interface · Planned presentation',
    concept: true,
    copy: 'The video workspace is being moved to a packaged FFmpeg Wasm pipeline for deterministic trimming, crop, resize, speed, audio, cover-frame, and broadly playable MP4 output.',
    points: [
      'Locally bundled worker and Wasm assets',
      'Frame-accurate processing without real-time playback capture',
      'Cancellable jobs with explicit progress'
    ],
    status: 'planned'
  },
  {
    id: 'handoff',
    eyebrow: '11 · Handoff',
    title: 'Return the approved File',
    image: '/features/cross-site-handoff.png',
    copy: 'When a destination asks for a file, UploadFlow retrieves the selected source on demand, opens review, and returns the approved File to the original input, drop, paste, or supported page API flow.',
    points: [
      'Continue returns the prepared File',
      'Cancel discards the temporary result',
      'Explicit Download hands progress and saving to Chrome'
    ]
  },
  {
    id: 'downloads',
    eyebrow: '12 · Download',
    title: 'Let Chrome own long-running saves',
    image: '/features/downloads-actual.png',
    imageLabel: 'Released feature · Current Downloads workspace',
    copy: 'Explicit downloads continue through Chrome after the UploadFlow window closes. The activity view keeps their progress and completed state visible.',
    points: ['Browser-managed progress', 'Completed download history and Show file', 'Clear completed items without deleting saved files']
  },
  {
    id: 'history',
    eyebrow: '13 · Repeat',
    title: 'Optionally remember the workflow',
    copy: 'Private history is disabled by default. When enabled, it stores bounded workflow metadata—not file bytes—with 7, 30, or 90-day retention and clear-all or per-destination deletion.',
    points: [
      'Local perceptual duplicate warnings',
      'Repeat a previous editor workflow',
      'No persisted fingerprints, scan findings, video frames, or temporary output bytes'
    ],
    comingSoon: true
  }
] satisfies GuideFeature[];
