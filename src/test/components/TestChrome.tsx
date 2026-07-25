import { UploadFlowIcon } from '../../lib/icons';
import { TEST_METHODS, type TestStatus } from '../interceptorTestTypes';

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TestHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0b0d0f]/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex min-h-16 sm:min-h-20 w-full max-w-360 items-center justify-between px-4 sm:px-8 lg:px-12">
        <a href="/" className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3.5 text-white no-underline transition-opacity hover:opacity-90" aria-label="Return to UploadFlow home">
          <span className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-white text-[#101416] shadow-md"><UploadFlowIcon /></span>
          <span className="min-w-0"><strong className="block text-sm sm:text-base lg:text-lg font-black uppercase italic leading-none tracking-tight truncate">UploadFlow</strong><small className="mt-1 hidden min-[420px]:block text-[10px] sm:text-[11px] font-bold uppercase tracking-[.18em] text-white/50 truncate">Live demo</small></span>
        </a>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300 sm:flex"><i className="h-2 w-2 rounded-full bg-emerald-400" />{TEST_METHODS.length} ways to try</span>
          <a href="/" className="inline-flex shrink-0 whitespace-nowrap min-h-8 sm:min-h-10 items-center gap-1.5 sm:gap-2 rounded-full border border-white/15 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide text-white/80 transition hover:bg-white hover:text-[#101416]">Back home <ArrowIcon /></a>
        </div>
      </div>
    </header>
  );
}

export function TestHero({ passed, results }: { passed: number; results: Map<string, TestStatus> }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(52,211,153,.1),transparent_28%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-size-[auto,48px_48px,48px_48px]" />
      <div className="relative mx-auto grid w-full max-w-360 gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_360px] lg:items-end lg:px-12">
        <div data-reveal="left">
          <p className="text-xs font-bold uppercase tracking-wider text-[#eefb7a]">Interactive preview · real browser actions</p>
          <h1 className="mt-5 max-w-5xl text-[clamp(3.5rem,7vw,7rem)] leading-[.84] tracking-[-.065em]">See UploadFlow<br /><span className="text-[#eefb7a]">in action.</span></h1>
          <p className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-white/60">Try the different ways files reach a webpage and see how UploadFlow gives you a private review step before upload.</p>
        </div>
        <div className="content-card" data-reveal="right">
          <div className="flex items-end justify-between"><div><span className="font-mono text-xs uppercase tracking-wider text-white/40">Demo progress</span><strong className="mt-2 block text-4xl tracking-[-.06em]">{passed}/{TEST_METHODS.length}</strong></div><span className="mb-1 text-xs font-bold uppercase text-emerald-300">Completed</span></div>
          <div className="mt-5 grid grid-cols-8 gap-1.5">
            {TEST_METHODS.map((test) => <span key={test} title={test} className={`h-2 rounded-full ${results.get(test) === 'success' ? 'bg-emerald-400' : results.get(test) === 'error' ? 'bg-red-400' : results.get(test) === 'info' ? 'bg-amber-300' : 'bg-white/10'}`} />)}
          </div>
          <div className="mt-5 flex gap-3 rounded-2xl border border-[#eefb7a]/25 bg-[#eefb7a]/10 p-4">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eefb7a] text-xs font-extrabold text-[#101416]" aria-hidden="true">!</span>
            <div><strong className="block text-xs font-extrabold uppercase tracking-wider text-[#eefb7a]">Before you start</strong><p className="mt-1.5 text-xs sm:text-sm font-medium leading-relaxed text-white/80">Open the installed UploadFlow extension, keep upload interception enabled, then try each upload method below.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestMethodSidebar({ results }: { results: Map<string, TestStatus> }) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start" data-reveal="left">
      <p className="text-xs font-bold uppercase tracking-wider text-white/40">Upload methods</p>
      <div className="mt-4 border-t border-white/10">
        {TEST_METHODS.map((test, index) => {
          const result = results.get(test);
          return (
            <div key={test} className="flex items-center gap-3 border-b border-white/10 py-3.5 text-xs sm:text-sm">
              <span className={`grid h-6 w-6 place-items-center rounded-full font-mono text-xs font-bold ${result === 'success' ? 'bg-emerald-400 text-[#101416]' : result === 'error' ? 'bg-red-400 text-[#101416]' : result === 'info' ? 'bg-amber-300 text-[#101416]' : 'border border-white/15 text-white/35'}`}>{result === 'success' ? '✓' : String(index + 1).padStart(2, '0')}</span>
              <span className={result ? 'text-white/80 font-medium' : 'text-white/40'}>{test}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
