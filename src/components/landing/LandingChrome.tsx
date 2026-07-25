'use client';

import { useEffect, useState } from 'react';
import { UploadFlowIcon } from '../../lib/icons';
import { ArrowIcon } from './icons';
import { primaryCta } from './content';

const navigation = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/#extension', label: 'Extension' },
  { href: '/#tools', label: 'Tools' },
  { href: '/#privacy', label: 'Privacy' },
  { href: '/support', label: 'Support' }
];

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? 'border-white/12 bg-[#080b0d]/92 shadow-[0_18px_60px_rgba(0,0,0,.25)] backdrop-blur-2xl' : 'border-white/8 bg-[#080b0d]/76 backdrop-blur-xl'
      }`}
    >
      <div className={`mx-auto flex w-full max-w-360 items-center justify-between px-4 transition-all duration-300 sm:px-8 lg:px-12 ${scrolled ? 'min-h-16' : 'min-h-16 sm:min-h-20'}`}>
        <a href="/#top" className="group flex min-w-0 shrink items-center gap-2.5 text-white sm:gap-3.5" aria-label="UploadFlow home">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,.12)] transition duration-300 group-hover:-rotate-3 group-hover:scale-105 group-hover:bg-[#eefb7a] sm:h-10 sm:w-10">
            <UploadFlowIcon />
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-sm font-black uppercase italic tracking-tight sm:text-base lg:text-lg">UploadFlow</strong>
            <small className="hidden truncate text-[10px] font-bold uppercase tracking-[.18em] text-white/45 min-[420px]:block sm:text-[11px]">
              The browser&apos;s missing media layer
            </small>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[.14em] text-white/62 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="group relative py-2 transition-colors hover:text-white">
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#eefb7a] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          <a href="/test" className="rounded-full border border-[#eefb7a]/30 bg-[#eefb7a]/8 px-4 py-2 font-extrabold text-[#eefb7a] transition hover:bg-[#eefb7a]/15">
            Test layer
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={primaryCta.href}
            target={primaryCta.href.startsWith('http') ? '_blank' : undefined}
            rel={primaryCta.href.startsWith('http') ? 'noreferrer' : undefined}
            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-black transition-all duration-300 hover:scale-[1.03] hover:bg-[#eefb7a] active:scale-95 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-xs"
          >
            {primaryCta.label} <ArrowIcon />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-[#eefb7a]/35 hover:bg-white/10 md:hidden sm:h-10 sm:w-10"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${mobileMenuOpen ? 'translate-y-1.75 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-1.75 h-0.5 w-5 bg-current transition ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-3.5 h-0.5 w-5 bg-current transition ${mobileMenuOpen ? '-translate-y-1.75 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-white/10 bg-[#080b0d]/96 backdrop-blur-2xl transition-[max-height,opacity] duration-300 md:hidden ${
          mobileMenuOpen ? 'max-h-112 opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <nav className="mx-auto grid max-w-360 gap-1 px-5 py-5 text-sm font-semibold uppercase tracking-wider" aria-label="Mobile navigation">
          <a href="/test" onClick={() => setMobileMenuOpen(false)} className="rounded-xl bg-[#eefb7a]/10 px-4 py-3 font-extrabold text-[#eefb7a] hover:bg-[#eefb7a]/18">
            Test upload layer
          </a>
          {navigation.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
              <span className="font-mono text-[10px] text-white/25">/{String(index + 1).padStart(2, '0')}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#070a0b]/80">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-5 py-10 text-xs font-semibold uppercase tracking-wider text-white/38 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <span className="flex items-center gap-3 text-sm font-bold text-white/82">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black transition hover:rotate-3 hover:bg-[#eefb7a]">
            <UploadFlowIcon />
          </span>
          <span>
            <strong className="block">UploadFlow</strong>
            <small className="mt-1 block text-[9px] tracking-[.18em] text-white/30">Private media in motion</small>
          </span>
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-8">
          <a href="https://cloudgrids.tech/" className="transition-colors hover:text-white">CloudGrids</a>
          <a href="/how-it-works" className="transition-colors hover:text-white">How it works</a>
          <a href="/privacy" className="transition-colors hover:text-white">Privacy</a>
          <a href="/support" className="transition-colors hover:text-white">Support</a>
          <a href="#top" className="text-[#eefb7a] transition-colors hover:text-[#f4ff94]">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
