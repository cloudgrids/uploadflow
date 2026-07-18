import { UploadFlowIcon } from '../../lib/icons';
import { ArrowIcon } from './icons';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0d0f]/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-360 items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="/#top" className="flex items-center gap-3 text-white" aria-label="UploadFlow home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black">
            <UploadFlowIcon />
          </span>
          <span>
            <strong className="block text-sm font-black uppercase italic">UploadFlow</strong>
            <small className="hidden text-[8px] uppercase tracking-[.2em] text-white/35 min-[390px]:block">Private upload toolkit</small>
          </span>
        </a>
        <nav
          className="hidden items-center gap-7 text-[9px] font-bold uppercase tracking-[.16em] text-white/45 md:flex"
          aria-label="Main navigation"
        >
          <a href="/how-it-works">How it works</a>
          <a href="/#extension">Extension</a>
          <a href="/#tools">Tools</a>
          <a href="/#privacy">Privacy</a>
          <a href="/support">Support</a>
        </nav>
        <a
          href="/demo"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[9px] font-black uppercase text-black"
        >
          Open demo <ArrowIcon />
        </a>
      </div>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-360 flex-col gap-5 px-5 py-8 text-[9px] font-bold uppercase tracking-[.13em] text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
      <span className="flex items-center gap-2 text-white/70">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-black">
          <UploadFlowIcon />
        </span>
        UploadFlow
      </span>
      <a href="https://cloudgrids.tech/">Published by CloudGrids</a>
      <a href="/how-it-works">How it works</a>
      <a href="/privacy">Privacy policy</a>
      <a href="/support">Support</a>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}
