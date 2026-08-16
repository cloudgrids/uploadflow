import { chromeWebStoreUrl } from '../landing/content';

export const storeUrl = chromeWebStoreUrl;

export const navigation = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/whats-new', label: 'What\u2019s new' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/support', label: 'Support' }
];

export const heroChips = ['No account', 'No cloud drive', 'No analytics'];

export const flow = [
  {
    title: 'Capture',
    copy: 'Hover, right-click, or paste a direct media URL. UploadFlow saves a reference — not the file — to your local shelf.'
  },
  {
    title: 'Prepare',
    copy: 'Optimize, crop, redact, watermark, cut out, upscale, or trim video in the browser. The original is never touched.'
  },
  {
    title: 'Deliver',
    copy: 'Click a file input on another site and pick your prepared media. The bytes are fetched on demand and handed over.'
  }
];

export const surfaces = [
  {
    title: 'Quick popup',
    copy: 'Capture a URL, review recent media, toggle interception, and move between workspaces through a numbered rail. Arrow keys walk the grid; every tile keeps its name for screen readers.'
  },
  {
    title: 'Persistent side panel',
    copy: 'Keeps your shelf beside your tabs while you move from source to destination. Search, tag, favourite, collect, reorder, and batch-process.'
  },
  {
    title: 'Full editor',
    copy: 'A preview-led workbench. Finish in one tool, pass the draft to the next, hand off when it’s right.'
  }
];

export type ToolStatus = 'ok' | 'beta' | 'network';

export interface Tool {
  title: string;
  status: ToolStatus;
  statusLabel: string;
  image: string;
  alt: string;
  copy: string;
  limit?: { lead?: string; text: string };
}

export const tools = [
  {
    title: 'Optimize',
    status: 'ok',
    statusLabel: 'Available',
    image: '/site/optimize.webp',
    alt: 'The optimize workspace with format, compression quality and resize controls beside a live preview',
    copy: 'Resize, compress, convert between JPEG, PNG, WebP and AVIF, rename, and strip metadata — with the estimated output size and saving shown before you apply.',
    limit: { text: 'Metadata cleaning covers supported fields. Treat it as a reduction, not a guarantee of anonymity.' }
  },
  {
    title: 'Crop',
    status: 'beta',
    statusLabel: 'Beta',
    image: '/site/crop.webp',
    alt: 'The crop workspace showing aspect presets and focus controls',
    copy: 'Square, portrait, landscape and thumbnail compositions with adjustable focus and preview zoom, so framing stays deliberate before the crop lands.'
  },
  {
    title: 'Redact',
    status: 'ok',
    statusLabel: 'Available',
    image: '/site/redact.webp',
    alt: 'The redact workspace with blur and cover regions over an image',
    copy: 'Blur or cover regions and confirm against a before-and-after view. Regions cover exactly the pixels the overlay shows, and drags track the cursor one-to-one at any aspect ratio.',
    limit: { text: 'Text detection covers email, phone, payment-card and IPv4 patterns — not arbitrary sensitive text.' }
  },
  {
    title: 'Watermark',
    status: 'ok',
    statusLabel: 'Available',
    image: '/site/watermark.webp',
    alt: 'The watermark workspace with placement grid, font and colour controls',
    copy: 'Text or a saved brand-kit variant, placed from a nine-point grid or by clicking the preview against a visible marker.',
    limit: { text: 'Clicks on the letterbox margin pan the view rather than snapping to an edge — if placement feels dead, you’re outside the image.' }
  },
  {
    title: 'Upscale',
    status: 'network',
    statusLabel: 'Sends your image',
    image: '/site/upscale.webp',
    alt: 'The upscale workspace comparing an enlarged result against the original',
    copy: 'Pick 2× or supported 4×, review the estimated dimensions, and compare against the original.',
    limit: {
      lead: 'The one network tool.',
      text: 'Your image is sent over HTTPS to UploadFlow’s API and iLoveIMG. Don’t upscale anything you wouldn’t send there — or keep it switched off entirely.'
    }
  },
  {
    title: 'Video',
    status: 'beta',
    statusLabel: 'Beta',
    image: '/site/video.webp',
    alt: 'The video workspace with a timeline, trim handles and cover-frame selection',
    copy: 'Trim by stream copy when nothing needs re-encoding. Crop, resize, speed, bitrate and audio changes use the locally packaged FFmpeg Wasm renderer; cover frames are chosen separately.',
    limit: { text: 'Any transformation forces a local re-encode — slow and CPU-heavy. Output is H.264/AAC MP4.' }
  }
] satisfies Tool[];

export const transfers = [
  {
    title: 'Fetching a source',
    copy: 'The media URL you picked is requested from its own site, only when you choose that item.',
    target: '→ source site'
  },
  {
    title: 'AI upscaling',
    copy: 'The selected image goes to UploadFlow’s API and iLoveIMG to be enlarged.',
    target: '→ iLoveIMG'
  },
  {
    title: 'Explicit downloads',
    copy: 'Handed to Chrome’s Downloads API so saving continues after UploadFlow closes.',
    target: '→ Chrome'
  }
];

export const neverDoes = [
  'No account system, no cloud drive, no analytics, no advertising, no data brokers.',
  'Never bypasses authentication, paywalls, expiring links, hotlink protection or usage rights.',
  'Never clicks a site’s publish, post, schedule, purchase or submit control.'
];

export const remembers = [
  'A bounded shelf of up to 20 media references.',
  'Optional Private Media Memory — metadata only, never file bytes, with 7, 30 or 90-day retention.',
  'Everything is exportable, deletable per destination, and gone entirely if you uninstall.'
];

export const compatibility = [
  { title: 'Public HTTP / HTTPS media', copy: 'The intended case and the best supported one.', verdict: 'Works', status: 'ok' },
  {
    title: 'Signed or expiring links',
    copy: 'Fine until the source’s expiry, then the fetch fails while the shelf entry remains.',
    verdict: 'Until expiry',
    status: 'beta'
  },
  { title: 'Authenticated or paywalled media', copy: 'UploadFlow doesn’t carry your session, by design.', verdict: 'Fails', status: 'exp' },
  { title: 'Hotlink-protected media', copy: 'The source rejects the request on its own referrer rules.', verdict: 'Fails', status: 'exp' },
  { title: 'Blob or streamed media', copy: 'There’s no stable URL left to fetch when the destination asks.', verdict: 'Usually fails', status: 'exp' },
  {
    title: 'Sites with custom upload frameworks',
    copy: 'Inputs, drops, pastes and supported page APIs are covered; bespoke frameworks may not expose them.',
    verdict: 'Varies',
    status: 'beta'
  },
  {
    title: 'Browsers other than Chrome',
    copy: 'It’s a Chrome MV3 extension with a Chrome side panel and Downloads integration.',
    verdict: 'Not supported',
    status: 'exp'
  }
] satisfies Array<{ title: string; copy: string; verdict: string; status: 'ok' | 'beta' | 'exp' }>;
