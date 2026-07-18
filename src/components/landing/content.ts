export const editorTools = [
  { number: '01', label: 'Optimize', copy: 'Resize, compress, convert, and remove image metadata before upload.', mark: '↗', image: '/features/optimize-actual.png' },
  { number: '02', label: 'Crop', copy: 'Prepare square, portrait, landscape, and thumbnail variants with safe-area guidance.', mark: '□', image: '/features/crop-actual.png', comingSoon: true },
  { number: '03', label: 'Redact', copy: 'Review local privacy findings and cover sensitive image regions or private text.', mark: '✦', image: '/features/redact-actual.png' },
  { number: '04', label: 'Watermark', copy: 'Reuse text, logo, preview, subscriber, and premium brand-kit variants.', mark: 'A', image: '/features/watermark-actual.png' },
  {
    number: '05',
    label: 'Upscale',
    copy: 'Recover detail when an image needs more resolution through an explicit network action.',
    mark: '⌁',
    image: '/features/upscale-actual.png'
  },
  {
    number: '06',
    label: 'Video',
    copy: 'Trim, crop, resize, mute, change speed, and extract cover frames locally where supported.',
    mark: '▶',
    comingSoon: true
  },
  {
    number: '07',
    label: 'Batch',
    copy: 'Apply bounded transformations to selected compatible files with progress, retry, and cancel.',
    mark: '≋',
    comingSoon: true
  },
  {
    number: '08',
    label: 'Packs',
    copy: 'Generate reusable destination variants and download completed outputs together as a ZIP.',
    mark: '⊞',
    comingSoon: true
  }
];

export const workflow = [
  ['01', 'Capture the source', 'Hover or right-click media you are authorized to reuse and save its available URL to your private shelf.'],
  [
    '02',
    'Prepare it your way',
    'Use the quick popup, persistent side panel, or full editor for presets, privacy checks, edits, and batches.'
  ],
  ['03', 'Open the destination', 'Choose the saved item when another website requests a file. UploadFlow fetches it only when needed.'],
  [
    '04',
    'Review and hand off',
    'Confirm compatibility and return the approved File to the original upload without a permanent Downloads copy.'
  ]
];

export const productSurfaces = [
  ['01', 'Quick popup', 'Capture, add a URL, inspect recent items, and jump into a deeper workspace.'],
  [
    '02',
    'Persistent side panel',
    'Search and organize the media shelf, select batches, run platform packs, and follow queue progress across tabs.'
  ],
  [
    '03',
    'Full editor',
    'Work with image, crop, redaction, watermark, upscale, and video tools, then pass a draft into any compatible editor.'
  ]
];

export const browserFeatures = [
  ['01', 'Capture media URLs', 'Hover or right-click an image, video, audio element, or media link and save its source.'],
  ['02', 'Manage a persistent shelf', 'Search, tag, favorite, collect, and reorder up to 20 authorized media references across tabs.'],
  ['03', 'Prepare for destinations', 'Use compatibility checks, ordered presets, filename templates, and reusable brand kits.'],
  ['04', 'Process bounded batches', 'Transform selected compatible files and generate downloadable platform-pack archives.'],
  ['05', 'Fetch only when needed', 'The destination click triggers retrieval, review, and final upload handoff.']
];

export const permissions = [
  ['Website access', 'Detect file inputs across websites and show optional Inspect Mode controls for media you choose to inspect.'],
  ['Storage', 'Keep settings, shelf records, presets, brand kits, and optional bounded private history in extension storage.'],
  ['Downloads', 'Hand explicit downloads and completed pack archives to Chrome so the browser owns progress and saving.'],
  ['Side panel', 'Keep the media shelf beside your tabs without granting additional access to website data.']
];

export const compatibilityNotes = [
  'Direct public HTTP and HTTPS media URLs work best.',
  'Signed or expiring URLs stop working after their source-defined expiry time.',
  'Authenticated, hotlink-blocked, protected, blob, or streamed media may not be retrievable.',
  'Video preparation uses a locally packaged FFmpeg Wasm worker and produces H.264/AAC MP4 output.',
  'UploadFlow does not bypass authentication, paywalls, access controls, or usage rights.'
];
