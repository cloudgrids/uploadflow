'use client';

import { useEffect, useRef, useState } from 'react';
import { copyShareUrl, SHARE_URL, shareUploadFlow } from '../../utils/share';
import { primaryCta } from './content';
import { ArrowIcon } from './icons';

export function ShareAndCtaSections() {
  const [notice, setNotice] = useState<{ message: string; error?: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const show = (message: string, error = false) => {
    setNotice({ message, error });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 3000);
  };

  const share = async () => {
    try {
      if ((await shareUploadFlow()) === 'copied') show('UploadFlow link copied.');
    } catch {
      show('Could not open the share menu.', true);
    }
  };

  const copy = async () => {
    try {
      await copyShareUrl();
      show('UploadFlow link copied.');
    } catch {
      show('Could not copy the UploadFlow link.', true);
    }
  };

  return (
    <>
      {notice && (
        <div role="status" aria-live="polite" className={`fixed right-4 top-20 z-60 rounded-2xl border px-4 py-3 text-xs shadow-2xl backdrop-blur-xl animate-fadeIn ${notice.error ? 'border-red-500/25 bg-red-950/90 text-red-100' : 'border-emerald-500/25 bg-emerald-950/90 text-emerald-100'}`}>
          {notice.message}
        </div>
      )}
      <section id="share" className="border-y border-white/10 bg-[#101416]/90">
        <div className="mx-auto grid max-w-360 items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
          <div data-reveal="left">
            <p className="eyebrow">Share the toolkit</p>
            <h2 className="mt-5 text-5xl sm:text-6xl">
              A safer upload
              <br />
              is worth sharing.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/55">
              Send UploadFlow to someone who wants control over files before they leave the browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => void share()} className="hover-lift rounded-full bg-[#eefb7a] px-6 py-3.5 text-xs font-extrabold uppercase text-black transition hover:bg-[#f4ff94] sm:text-sm">
                Share UploadFlow
              </button>
              <button onClick={() => void copy()} className="hover-lift rounded-full border border-white/15 bg-white/3 px-6 py-3.5 text-xs font-extrabold uppercase transition hover:border-white/40 sm:text-sm">
                Copy link
              </button>
            </div>
          </div>
          <a href={SHARE_URL} className="media-frame block" data-reveal="right" aria-label="Open UploadFlow share preview">
            <img src="/share-preview.png" alt="UploadFlow public preview" width="1200" height="675" className="w-full" />
            <span className="absolute bottom-4 right-4 z-4 rounded-full border border-white/12 bg-black/70 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#eefb7a] backdrop-blur-xl">Open preview ↗</span>
          </a>
        </div>
      </section>
      <section className="p-3 sm:p-5" data-reveal>
        <div className="relative overflow-hidden rounded-[30px] bg-[#eefb7a] px-6 py-16 text-center text-black shadow-[0_35px_100px_rgba(238,251,122,.13)] sm:py-24">
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(0,0,0,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.12)_1px,transparent_1px)] bg-size-[42px_42px]" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[.22em] text-black/55">The browser&apos;s missing media layer</p>
            <h2 className="mt-5 text-5xl sm:text-7xl">
              Make the file ready
              <br />
              before the web sees it.
            </h2>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={primaryCta.href} target={primaryCta.href.startsWith('http') ? '_blank' : undefined} rel={primaryCta.href.startsWith('http') ? 'noreferrer' : undefined} className="hover-lift inline-flex min-h-12 items-center gap-3 rounded-full bg-black px-6 text-xs font-extrabold uppercase text-white transition hover:bg-neutral-800 sm:text-sm">
                {primaryCta.label} <ArrowIcon />
              </a>
              <a href="/how-it-works" className="hover-lift inline-flex min-h-12 items-center rounded-full border border-black/25 px-6 text-xs font-extrabold uppercase text-black transition hover:bg-black/10 sm:text-sm">
                Explore the workflow
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
