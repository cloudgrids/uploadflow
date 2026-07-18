'use client';

import { useRef, useState } from 'react';
import { copyShareUrl, SHARE_URL, shareUploadFlow } from '../../utils/share';
import { primaryCta } from './content';
import { ArrowIcon } from './icons';

export function ShareAndCtaSections() {
  const [notice, setNotice] = useState<{ message: string; error?: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        <div
          role="status"
          className={`fixed right-4 top-20 z-50 rounded-xl border px-4 py-3 text-xs ${notice.error ? 'border-red-500/25 bg-red-950' : 'border-emerald-500/25 bg-emerald-950'}`}
        >
          {notice.message}
        </div>
      )}
      <section id="share" className="border-y border-white/10 bg-[#111416]">
        <div className="mx-auto grid max-w-360 items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#eefb7a]">Share the toolkit</p>
            <h2 className="mt-5 text-5xl">
              A safer upload
              <br />
              is worth sharing.
            </h2>
            <p className="mt-6 text-sm leading-6 text-white/45">
              Send UploadFlow to someone who wants control over files before they leave the browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <button onClick={() => void share()} className="rounded-xl bg-[#eefb7a] px-5 py-3 text-[9px] font-black uppercase text-black">
                Share UploadFlow
              </button>
              <button onClick={() => void copy()} className="rounded-xl border border-white/15 px-5 py-3 text-[9px] font-black uppercase">
                Copy link
              </button>
            </div>
          </div>
          <a href={SHARE_URL} className="overflow-hidden rounded-[26px] border border-white/15">
            <img src="/share-preview.png" alt="UploadFlow public preview" width="1200" height="675" className="w-full" />
          </a>
        </div>
      </section>
      <section className="p-3 sm:p-5">
        <div className="rounded-[28px] bg-[#eefb7a] px-6 py-16 text-center text-black sm:py-24">
          <h2 className="text-5xl sm:text-7xl">
            Make the file ready
            <br />
            before the web sees it.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={primaryCta.href}
              target={primaryCta.href.startsWith('http') ? '_blank' : undefined}
              rel={primaryCta.href.startsWith('http') ? 'noreferrer' : undefined}
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-black px-6 text-[10px] font-black uppercase text-white"
            >
              {primaryCta.label} <ArrowIcon />
            </a>
            <a
              href="/how-it-works"
              className="inline-flex min-h-12 items-center rounded-full border border-black/25 px-6 text-[10px] font-black uppercase text-black"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
