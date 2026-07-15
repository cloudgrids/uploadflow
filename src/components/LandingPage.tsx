import { UploadFlowIcon } from '../lib/icons';
import { copyShareUrl, SHARE_URL, shareUploadFlow } from '../utils/share';
import { toast } from '../utils/Toaster';
import { LaunchCountdown } from './LaunchCountdown';

const tools = [
  { number: '01', label: 'Optimize', copy: 'Resize, compress, and convert images before upload.', mark: '↗' },
  { number: '02', label: 'Redact', copy: 'Mask emails, phone numbers, cards, and private text.', mark: '✦' },
  { number: '03', label: 'Watermark', copy: 'Apply a configurable mark with a live preview.', mark: 'A' },
  { number: '04', label: 'Upscale', copy: 'Recover detail when an image needs more resolution.', mark: '⌁' }
];

const workflow = [
  ['01', 'Choose a source', 'Use a normal file input, paste or drop files, or pick from URLs you saved while browsing.'],
  ['02', 'Review', 'A private workspace opens with the original files visible first. Choose only the tools you need.'],
  ['03', 'Return', 'Approve the result and UploadFlow returns the processed file to the exact upload flow you started.']
];

const browserFeatures = [
  ['01', 'Inspect media', 'Hover a webpage image, video, or audio element to reveal its available source without covering the page.'],
  ['02', 'Hand off downloads', 'Send detected media to Chrome so downloads remain visible and manageable in the browser.'],
  ['03', 'Save URL files', 'Keep up to 20 remote file URLs with previews, then fetch one only when a website asks for a file.']
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-170 lg:mr-0">
      <div className="absolute -inset-12 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-[#15191b] shadow-[0_45px_120px_rgba(0,0,0,.55)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f4c95d]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#58c477]" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">Private workspace · local</span>
        </div>

        <div className="grid min-h-97.5 sm:grid-cols-[150px_1fr]">
          <aside className="hidden border-r border-white/10 p-3 sm:block">
            <div className="mb-5 flex items-center gap-2 px-2 pt-1">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-[#0b0d0f]"><UploadFlowIcon /></span>
              <span className="text-[10px] font-black uppercase italic">UploadFlow</span>
            </div>
            {['Files', 'Optimize', 'Redact', 'Watermark'].map((item, index) => (
              <div key={item} className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[9px] font-bold uppercase tracking-wide ${index === 0 ? 'bg-white text-[#0b0d0f]' : 'text-white/40'}`}>
                <span className="font-mono text-[8px] opacity-50">0{index + 1}</span>{item}
              </div>
            ))}
          </aside>

          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-emerald-400">2 files intercepted</span>
                <h3 className="mt-1 text-lg text-white">Review before upload</h3>
              </div>
              <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[8px] text-white/35">gmail.com</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#202528]">
                <div className="relative aspect-4/3 overflow-hidden bg-[linear-gradient(135deg,#40555d,#a8c3b3_48%,#e9d7aa)]">
                  <div className="absolute inset-x-7 bottom-0 h-24 rounded-t-full bg-[#142c27]/70" />
                  <div className="absolute left-1/2 top-[28%] h-16 w-16 -translate-x-1/2 rounded-full border-10 border-white/50" />
                  <span className="absolute left-3 top-3 rounded-md bg-[#0b0d0f]/80 px-2 py-1 font-mono text-[8px]">JPG</span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <div><p className="text-[10px] font-bold text-white">campaign-cover.jpg</p><p className="mt-1 font-mono text-[8px] text-white/35">4.8 MB · 3024×4032</p></div>
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-xs text-black">✓</span>
                </div>
              </div>

              <div className="flex min-h-49 flex-col justify-between rounded-2xl border border-dashed border-white/15 bg-white/2.5 p-4">
                <div>
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-sm text-white/70">+</span>
                  <p className="mt-4 text-[10px] font-bold uppercase text-white/70">Drop another file</p>
                  <p className="mt-1 text-[9px] leading-4 text-white/30">PNG, JPG, WEBP, TXT and supported media.</p>
                </div>
                <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-wider text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Nothing uploaded yet</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[8px] uppercase tracking-[0.16em] text-white/30">Originals stay untouched</span>
              <button type="button" className="rounded-lg bg-white px-3.5 py-2 text-[9px] font-black uppercase text-[#0b0d0f]">Continue with 2 files</button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 -left-3 hidden w-44 rounded-2xl border border-white/15 bg-[#eefb7a] p-4 text-[#0b0d0f] shadow-2xl sm:block lg:-left-12">
        <p className="font-mono text-[8px] uppercase tracking-widest opacity-50">Latest result</p>
        <p className="mt-4 text-3xl font-black tracking-[-.06em]">−68%</p>
        <p className="mt-1 text-[9px] font-bold uppercase">smaller file</p>
      </div>
    </div>
  );
}

function BrowserToolsPreview() {
  return (
    <div className="relative min-h-125 overflow-hidden rounded-[26px] border border-white/15 bg-[#15191b] shadow-[0_35px_100px_rgba(0,0,0,.38)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#f4c95d]" /><span className="h-2.5 w-2.5 rounded-full bg-[#58c477]" /></div>
        <div className="rounded-full bg-white/5 px-4 py-1.5 font-mono text-[8px] text-white/35">example.com/gallery</div>
        <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400">Inspect on</span>
      </div>

      <div className="relative min-h-72 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_70%_25%,rgba(238,251,122,.18),transparent_27%),linear-gradient(135deg,#31484a,#91aca0_48%,#d8ca9f)]">
        <div className="absolute inset-x-[18%] bottom-0 h-[72%] rounded-t-[50%] bg-[#172d29]/75" />
        <div className="absolute left-1/2 top-[24%] h-24 w-24 -translate-x-1/2 rounded-full border-14 border-white/45" />
        <button type="button" aria-label="Media inspector example" className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-[#171717] text-lg font-black text-white shadow-xl">↓</button>

        <div className="absolute left-14 top-4 w-[min(310px,calc(100%-72px))] rounded-2xl border border-white/15 bg-[#171717]/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3"><div><p className="text-[8px] font-black uppercase italic tracking-wider">Image source</p><p className="mt-2 line-clamp-2 font-mono text-[8px] leading-4 text-white/35">https://media.example.com/campaign-cover.jpg</p></div><span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" /></div>
          <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-lg bg-white px-3 py-2 text-[8px] font-black uppercase text-[#101416]">Download</span><span className="rounded-lg border border-white/15 px-3 py-2 text-[8px] font-black uppercase text-white/60">Save URL</span><span className="rounded-lg border border-white/15 px-3 py-2 text-[8px] font-black uppercase text-white/60">Copy</span></div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-end justify-between"><div><p className="text-[8px] font-black uppercase tracking-[.18em] text-[#eefb7a]">Remote file library</p><h3 className="mt-1 text-xl">Ready for the next file input</h3></div><span className="font-mono text-[8px] text-white/30">2 / 20</span></div>
        <div className="grid gap-2">
          {[['campaign-cover.jpg', 'IMAGE · SAVED JUST NOW'], ['product-demo.mp4', 'VIDEO · CHROME DOWNLOAD']].map(([name, meta], index) => (
            <div key={name} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-2.5">
              <div className={`h-11 rounded-lg ${index === 0 ? 'bg-[linear-gradient(135deg,#40555d,#e9d7aa)]' : 'grid place-items-center bg-[#252a2d] text-xs text-white/50'}`}>{index === 1 ? '▶' : ''}</div>
              <div className="min-w-0"><p className="truncate text-[10px] font-bold">{name}</p><p className="mt-1 text-[7px] font-bold tracking-wider text-white/30">{meta}</p></div>
              <span className="rounded-lg bg-white px-3 py-2 text-[8px] font-black uppercase text-[#101416]">Use</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const handleCopy = async () => {
    try {
      await copyShareUrl();
      toast.success('UploadFlow link copied.');
    } catch {
      toast.error('Could not copy the UploadFlow link.');
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareUploadFlow();
      if (result === 'copied') toast.success('UploadFlow link copied.');
    } catch {
      toast.error('Could not open the share menu.');
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#0b0d0f] text-white selection:bg-[#eefb7a] selection:text-[#0b0d0f]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0d0f]/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-360 items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="flex items-center gap-3 text-white no-underline" aria-label="UploadFlow home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#0b0d0f]"><UploadFlowIcon /></span>
            <span><strong className="block text-[15px] font-black uppercase italic leading-none">UploadFlow</strong><small className="mt-1 block text-[8px] font-bold uppercase tracking-[.2em] text-white/35">Private upload toolkit</small></span>
          </a>

          <nav className="hidden items-center gap-7 text-[9px] font-bold uppercase tracking-[.16em] text-white/45 md:flex" aria-label="Main navigation">
            <a href="#workflow" className="transition hover:text-white">How it works</a>
            <a href="#extension" className="transition hover:text-white">Extension</a>
            <a href="#tools" className="transition hover:text-white">Tools</a>
            <a href="#privacy" className="transition hover:text-white">Privacy</a>
            <a href="#share" className="transition hover:text-white">Share</a>
          </nav>

          <a href="/demo" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-4 py-2.5 text-[9px] font-black uppercase tracking-[.08em] text-[#0b0d0f] transition hover:-translate-y-0.5 hover:bg-[#eefb7a]">
            Open live demo <ArrowIcon />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(238,251,122,.08),transparent_31%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-size-[auto,48px_48px,48px_48px]" />
          <div className="mx-auto grid min-h-[calc(100svh-65px)] w-full max-w-360 items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:py-24">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /> Runs locally in your browser
              </div>
              <h1 className="max-w-190 text-[clamp(3.6rem,7.4vw,7.8rem)] leading-[.83] tracking-[-.07em]">
                Own every<br />file <span className="text-[#eefb7a]">before</span><br />it uploads.
              </h1>
              <p className="mt-8 max-w-xl text-sm leading-6 text-white/50 sm:text-base sm:leading-7">
                Intercept uploads, inspect media already on the page, and reuse files from saved URLs—all from one private browser workspace.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="/demo" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#eefb7a] px-6 text-[10px] font-black uppercase tracking-widest text-[#0b0d0f] transition hover:-translate-y-0.5 hover:bg-white">Try UploadFlow <ArrowIcon /></a>
                <a href="#workflow" className="inline-flex min-h-12 items-center rounded-full border border-white/15 px-6 text-[10px] font-bold uppercase tracking-widest text-white/70 transition hover:border-white/35 hover:text-white">See the workflow</a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[9px] font-bold uppercase tracking-widest text-white/35">
                {['No account', 'URL file picker', 'Chrome-managed downloads'].map((item) => <span key={item} className="flex items-center gap-2"><span className="text-[#eefb7a]"><CheckIcon /></span>{item}</span>)}
              </div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <div className="overflow-hidden border-b border-white/10 bg-[#eefb7a] py-3 text-[#0b0d0f]">
          <div className="flex min-w-max items-center justify-center gap-8 px-4 text-[10px] font-black uppercase italic tracking-[.12em] sm:gap-14">
            <span>Intercept</span><span>✦</span><span>Inspect media</span><span>✦</span><span>Save URL</span><span>✦</span><span>Protect</span><span>✦</span><span>Return</span>
          </div>
        </div>

        <LaunchCountdown />

        <section id="workflow" className="mx-auto w-full max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#eefb7a]">How it works</p>
              <h2 className="mt-4 max-w-sm text-4xl leading-[.95] sm:text-5xl">One pause.<br />Total control.</h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/40">The page never needs to change its upload flow. UploadFlow pauses, processes, and safely continues it.</p>
            </div>
            <div className="border-t border-white/15">
              {workflow.map(([number, title, copy]) => (
                <article key={number} className="grid gap-4 border-b border-white/15 py-8 sm:grid-cols-[70px_180px_1fr] sm:items-start sm:py-10">
                  <span className="font-mono text-[10px] text-[#eefb7a]">/{number}</span>
                  <h3 className="text-xl sm:text-2xl">{title}</h3>
                  <p className="max-w-lg text-sm leading-6 text-white/45">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="extension" className="border-y border-white/10 bg-[#111416]">
          <div className="mx-auto grid w-full max-w-360 items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.82fr_1.18fr] lg:px-12">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.22em] text-emerald-400">Beyond the upload button</p>
              <h2 className="mt-5 max-w-xl text-5xl leading-[.9] sm:text-6xl">Files you find.<br /><span className="text-[#eefb7a]">Ready when needed.</span></h2>
              <p className="mt-6 max-w-lg text-sm leading-6 text-white/45">Inspect mode adds one small control only while you hover media. Download it through Chrome or save the URL for a future upload—without permanently storing the file in UploadFlow.</p>

              <div className="mt-10 border-t border-white/15">
                {browserFeatures.map(([number, title, copy]) => (
                  <article key={number} className="grid grid-cols-[36px_1fr] gap-3 border-b border-white/15 py-5">
                    <span className="font-mono text-[9px] text-[#eefb7a]">/{number}</span>
                    <div><h3 className="text-lg">{title}</h3><p className="mt-2 max-w-md text-xs leading-5 text-white/40">{copy}</p></div>
                  </article>
                ))}
              </div>
            </div>
            <BrowserToolsPreview />
          </div>
        </section>

        <section id="tools" className="border-y border-white/10 bg-[#111416]">
          <div className="mx-auto w-full max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="text-[9px] font-bold uppercase tracking-[.22em] text-emerald-400">Inside the workspace</p><h2 className="mt-4 text-4xl leading-none sm:text-5xl">Four tools. One flow.</h2></div>
              <p className="max-w-sm text-sm leading-6 text-white/40">Use one transformation or combine them. You decide what happens to every file.</p>
            </div>
            <div className="grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool) => (
                <article key={tool.number} className="group min-h-72 border-b border-r border-white/15 p-6 transition hover:bg-[#eefb7a] hover:text-[#0b0d0f] sm:p-7">
                  <div className="flex items-center justify-between"><span className="font-mono text-[9px] opacity-35">/{tool.number}</span><span className="grid h-10 w-10 place-items-center rounded-xl border border-current/15 text-base font-black">{tool.mark}</span></div>
                  <h3 className="mt-20 text-2xl">{tool.label}</h3>
                  <p className="mt-3 text-xs leading-5 opacity-45 group-hover:opacity-65">{tool.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="privacy" className="relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(52,211,153,.12),transparent_60%)]" />
          <div className="relative mx-auto grid w-full max-w-360 gap-16 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:px-12">
            <div>
              <span className="inline-flex rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.18em] text-white/45">Privacy by architecture</span>
              <h2 className="mt-7 text-5xl leading-[.88] sm:text-7xl">Your files<br />stay yours.</h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="max-w-xl text-lg leading-8 text-white/55">Image optimization, redaction, and watermarking happen in your browser. UploadFlow does not use a cloud drive as a middleman.</p>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[['00', 'Cloud copies'], ['01', 'Private workspace'], ['100%', 'User controlled']].map(([value, label]) => (
                  <div key={label} className="border-t border-white/15 pt-4"><strong className="text-2xl text-[#eefb7a]">{value}</strong><span className="mt-2 block text-[8px] font-bold uppercase tracking-[.15em] text-white/35">{label}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="share" className="border-y border-white/10 bg-[#111416]">
          <div className="mx-auto grid w-full max-w-360 items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#eefb7a]">Share the toolkit</p>
              <h2 className="mt-5 text-5xl leading-[.88] sm:text-6xl">A safer upload<br />is worth sharing.</h2>
              <p className="mt-6 max-w-lg text-sm leading-6 text-white/45">Send UploadFlow to someone who wants control over files before they leave the browser. The public preview explains the workflow without requiring the extension.</p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <span className="truncate font-mono text-[9px] text-white/35">{SHARE_URL}</span>
                  <span className="shrink-0 text-[8px] font-black uppercase tracking-wider text-emerald-400">Public link</span>
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  <button type="button" onClick={() => void handleShare()} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#eefb7a] px-5 text-[9px] font-black uppercase tracking-wider text-[#101416] transition hover:bg-white">Share UploadFlow <ArrowIcon /></button>
                  <button type="button" onClick={() => void handleCopy()} className="min-h-11 cursor-pointer rounded-xl border border-white/12 px-5 text-[9px] font-black uppercase tracking-wider text-white/55 transition hover:border-white/30 hover:text-white">Copy link</button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-[#eefb7a]/8 blur-3xl" />
              <a href={SHARE_URL} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-[26px] border border-white/15 bg-[#0b0d0f] shadow-[0_35px_100px_rgba(0,0,0,.45)]">
                <img src="/share-preview.png" alt="Preview of the UploadFlow share card and private workspace" width="1200" height="675" loading="lazy" className="aspect-video h-auto w-full object-cover transition duration-500 group-hover:scale-[1.015]" />
                <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-black text-[#101416] shadow-xl transition group-hover:bg-[#eefb7a]">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="px-3 pb-3 sm:px-5 sm:pb-5">
          <div className="relative overflow-hidden rounded-[28px] bg-[#eefb7a] px-6 py-16 text-center text-[#0b0d0f] sm:py-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.7),transparent_25%)]" />
            <div className="relative mx-auto max-w-4xl">
              <p className="text-[9px] font-black uppercase tracking-[.22em] opacity-45">See the handoff for yourself</p>
              <h2 className="mt-5 text-5xl leading-[.88] sm:text-7xl">Make the file ready<br />before the web sees it.</h2>
              <a href="/demo" className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#0b0d0f] px-6 text-[10px] font-black uppercase tracking-widest text-white transition hover:-translate-y-0.5">Open the live demo <ArrowIcon /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-360 flex-col gap-5 px-5 py-8 text-[9px] font-bold uppercase tracking-[.13em] text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div className="flex items-center gap-2 text-white/70"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-black"><UploadFlowIcon /></span>UploadFlow</div>
        <p>Private tools for files in motion.</p>
        <a href="#top" className="transition hover:text-white">Back to top ↑</a>
      </footer>
    </div>
  );
}
