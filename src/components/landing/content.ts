export type ProductStatus = 'available' | 'beta' | 'early' | 'experimental' | 'next' | 'planned';

export const productStatus: Record<ProductStatus, { label: string; detail: string }> = {
  available: { label: 'Ready in build', detail: 'Working in the current pre-release extension build.' },
  beta: { label: 'In beta', detail: 'Working in the current development build and still being hardened.' },
  early: { label: 'Early Access', detail: 'Security and pairing groundwork exists; the complete user workflow is not yet available.' },
  experimental: {
    label: 'Experimental',
    detail: 'Opt-in development feature for supported upload flows; website compatibility varies.'
  },
  next: { label: 'Coming next', detail: 'Actively being prepared for the next public release.' },
  planned: { label: 'Planned', detail: 'Part of the roadmap, with scope still subject to change.' }
};

export const chromeWebStoreUrl = process.env.NEXT_PUBLIC_CHROME_WEB_STORE_URL;
export const primaryCta = chromeWebStoreUrl
  ? { label: 'Add to Chrome', href: chromeWebStoreUrl }
  : {
      label: 'Join the launch list',
      href: process.env.NEXT_PUBLIC_LAUNCH_LIST_URL ?? '/support#launch-list'
    };

export const editorTools = [
  {
    number: '01',
    label: 'Optimize',
    copy: 'Resize, compress, convert, and remove image metadata before upload.',
    mark: '↗',
    image: '/features/optimize-actual.png',
    status: 'available',
    screenshot: 'Released feature · Current extension UI'
  },
  {
    number: '02',
    label: 'Crop',
    copy: 'Prepare square, portrait, landscape, and thumbnail variants with safe-area guidance.',
    mark: '□',
    image: '/features/crop-actual.png',
    status: 'beta',
    screenshot: 'Working development build · Beta UI'
  },
  {
    number: '03',
    label: 'Redact',
    copy: 'Review local privacy findings and cover sensitive image regions or private text.',
    mark: '✦',
    image: '/features/redact-actual.png',
    status: 'available',
    screenshot: 'Released feature · Current extension UI'
  },
  {
    number: '04',
    label: 'Watermark',
    copy: 'Reuse text, logo, preview, subscriber, and premium brand-kit variants.',
    mark: 'A',
    image: '/features/watermark-actual.png',
    status: 'available',
    screenshot: 'Released feature · Current extension UI'
  },
  {
    number: '05',
    label: 'Upscale',
    copy: 'Recover detail when an image needs more resolution through an explicit network action.',
    mark: '⌁',
    image: '/features/upscale-actual.png',
    status: 'beta',
    screenshot: 'Working development build · Network feature'
  },
  {
    number: '06',
    label: 'Video',
    copy: 'Trim, crop, resize, mute, change speed, and extract cover frames locally where supported.',
    mark: '▶',
    status: 'beta'
  },
  {
    number: '07',
    label: 'Batch',
    copy: 'Apply bounded transformations to selected compatible files with progress, retry, and cancel.',
    mark: '≋',
    status: 'beta'
  },
  {
    number: '08',
    label: 'Packs',
    copy: 'Generate reusable destination variants and download completed outputs together as a ZIP.',
    mark: '⊞',
    status: 'beta'
  }
] satisfies Array<{
  number: string;
  label: string;
  copy: string;
  mark: string;
  status: ProductStatus;
  image?: string;
  screenshot?: string;
}>;

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
  {
    number: '01',
    title: 'Quick popup',
    copy: 'Capture, review files, and open the workspace from the extension action.',
    status: 'available'
  },
  {
    number: '02',
    title: 'Persistent side panel',
    copy: 'Search and organize the media shelf while moving between source and destination tabs.',
    status: 'beta'
  },
  { number: '03', title: 'Full editor', copy: 'Prepare media with compatible editors and pass a draft between tools.', status: 'beta' }
] satisfies Array<{ number: string; title: string; copy: string; status: ProductStatus }>;

export const availableToday = [
  ['Capture from a webpage', 'Save an authorized media URL from Inspect Mode or the context menu.'],
  ['Keep a private media shelf', 'Carry saved references between source and destination tabs without organizing a Downloads folder.'],
  ['Use a saved URL in an upload field', 'Fetch the file on demand, review it, and return it to the destination input.'],
  ['Prepare common image files', 'Optimize, redact, and watermark supported images before handoff.']
];

export const simpleWorkflow = [
  ['01', 'Capture', 'Save media you are authorized to use from the webpage where you found it.'],
  ['02', 'Prepare', 'Crop, optimize, watermark, or redact it inside UploadFlow’s private browser workspace.'],
  ['03', 'Deliver', 'Choose the prepared file from another website’s upload field—without managing a permanent Downloads copy.']
];

export const productProblems = [
  ['A messy Downloads folder', 'Keep approved media in a searchable browser shelf instead of saving permanent local copies.'],
  ['Forgetting where a file came from', 'Retain its source reference, capture time, and prepared versions together.'],
  ['Repeating crop, resize, and watermark work', 'Prepare a reusable version once and use it in another supported upload flow.'],
  ['Switching between tabs, folders, and editors', 'Capture, prepare, and deliver from one browser workflow.'],
  ['Sensitive information in local files', 'Review and redact supported content locally before delivering it.']
];

export const practicalUseCases = [
  {
    audience: 'Content creators and social media managers',
    workflow: 'Capture an authorized image, resize and brand it, then use the prepared version in another social publishing form.',
    benefit: 'Faster posting and more consistent branding without download clutter.'
  },
  {
    audience: 'Freelancers and designers',
    workflow: 'Capture a client-provided reference, redact or prepare it, then deliver it to a design tool or client portal.',
    benefit: 'A cleaner handoff with fewer temporary files.'
  },
  {
    audience: 'E-commerce sellers',
    workflow: 'Prepare authorized supplier or product photos for the size and format expected by a marketplace.',
    benefit: 'Quicker listing preparation with reusable destination rules.'
  },
  {
    audience: 'Marketers working across platforms',
    workflow: 'Keep one approved asset in the Media Shelf and reuse prepared versions across supported destination sites.',
    benefit: 'Less repetitive file finding, renaming, and preparation.'
  },
  {
    audience: 'Researchers and students',
    workflow: 'Collect permitted visual references with their sources and reuse them in supported report or presentation upload flows.',
    benefit: 'Better source recall and less local file clutter.'
  },
  {
    audience: 'Privacy-sensitive workflows',
    workflow: 'Inspect and redact supported private content in the browser before handing it to a work system.',
    benefit: 'Sensitive intermediate versions do not need to remain in Downloads.'
  }
];

export const commonQuestions = [
  {
    question: 'What is UploadFlow?',
    answer:
      'A browser extension that acts like a smart, private media clipboard. It keeps user-approved media between the source webpage, a preparation workspace, and a destination upload field.'
  },
  {
    question: 'Is it only a bridge for transferring images?',
    answer:
      'The handoff is the core idea, but UploadFlow also provides a Media Shelf and compatible preparation tools for images, video, privacy review, batches, and destination rules.'
  },
  {
    question: 'Does it download files behind the scenes?',
    answer:
      'When you use a saved URL, UploadFlow retrieves the bytes on demand so the destination can receive a File. It avoids a permanent Downloads copy unless you explicitly choose Download.'
  },
  {
    question: 'Does it work with every file on every website?',
    answer:
      'No. Public HTTP/HTTPS media works best. Authentication, expiring links, site upload frameworks, access controls, and supported file types can affect compatibility.'
  }
];

export const mediaMemoryPillars = [
  ['01', 'Capture', 'Keep the source, capture date, and original reference attached to authorized media.'],
  ['02', 'Transform', 'Connect crops, compression, watermarks, redactions, and generated outputs as one version family.'],
  ['03', 'Deliver', 'Record the destinations a user explicitly confirms for each prepared version.'],
  ['04', 'Recall', 'Find media again by source, date, destination, description, or local visual similarity.'],
  ['05', 'Protect', 'Keep media memory local, bounded, user-controlled, exportable, and easy to erase.']
];

export const mediaMemoryRoadmap = [
  { label: 'Media lineage and version families', status: 'beta' },
  { label: 'Source tracking and find-original', status: 'beta' },
  { label: 'Explicit upload history', status: 'beta' },
  { label: 'Duplicate-post warnings', status: 'beta' },
  { label: 'Local visual search', status: 'beta' },
  { label: 'Reusable previous workflows', status: 'beta' },
  { label: 'Local retention, export, and deletion', status: 'beta' },
  { label: 'UploadFlow Handoff pairing groundwork', status: 'early' },
  { label: 'Live Draft Sync on supported fields', status: 'experimental' }
] satisfies Array<{ label: string; status: ProductStatus }>;

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
