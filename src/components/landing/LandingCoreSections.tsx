import type { CSSProperties } from 'react';
import { HeroExperience } from './HeroExperience';
import { availableToday, browserFeatures, compatibilityNotes, permissions, primaryCta, workflow } from './content';
import { ArrowIcon, CheckIcon } from './icons';

export function HeroSection() {
  const marqueeItems = ['Capture', 'Transform', 'Deliver', 'Recall', 'Reuse', 'Protect'];

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(238,251,122,.09),transparent_30%),linear-gradient(rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px)] bg-size-[auto,54px_54px,54px_54px]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-65px)] max-w-360 items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[.88fr_1.12fr] lg:px-12">
          <div data-reveal="left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
                Available on the Chrome Web Store
              </span>
              <span className="rounded-full border border-white/10 bg-white/4 px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-white/45">
                Local-first media layer
              </span>
            </div>
            <h1
              className="hero-title mt-8 text-[clamp(2.75rem,8vw,6.7rem)] leading-[.84] tracking-[-.068em]"
              aria-label="Move images and videos between websites without downloading."
            >
              <span className="hero-title-line" aria-hidden="true">
                <span className="hero-title-line-inner" style={{ '--hero-title-delay': '80ms' } as CSSProperties}>
                  Move images &amp; videos
                </span>
              </span>
              <span className="hero-title-line" aria-hidden="true">
                <span
                  className="hero-title-line-inner hero-title-line-accent text-[#eefb7a]"
                  style={{ '--hero-title-delay': '190ms' } as CSSProperties}
                >
                  between websites
                </span>
              </span>
              <span className="hero-title-line" aria-hidden="true">
                <span className="hero-title-line-inner" style={{ '--hero-title-delay': '300ms' } as CSSProperties}>
                  without downloading.
                </span>
              </span>
            </h1>
            <h2 className="mt-8 max-w-xl text-2xl leading-tight tracking-tight sm:text-3xl">
              Capture it on one site. <span className="text-white/42">Prepare it. Upload it on another.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/62 sm:text-lg">
              UploadFlow turns the space between a source webpage and a destination upload field into a private, intelligent workspace.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/48">
              It remembers the media you explicitly save, where it came from, how it changed, and where you chose to use it—without making
              you organise temporary files in Downloads.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={primaryCta.href}
                target={primaryCta.href.startsWith('http') ? '_blank' : undefined}
                rel={primaryCta.href.startsWith('http') ? 'noreferrer' : undefined}
                className="hover-lift inline-flex min-h-12 items-center gap-3 rounded-full bg-[#eefb7a] px-6 text-xs font-black uppercase text-black shadow-[0_18px_48px_rgba(238,251,122,.14)] transition hover:bg-[#f4ff94] sm:text-sm"
              >
                {primaryCta.label} <ArrowIcon />
              </a>
              <a
                href="/test"
                className="hover-lift inline-flex min-h-12 items-center rounded-full border border-white/15 bg-white/3 px-6 text-xs font-bold uppercase transition hover:border-[#eefb7a]/40 hover:text-[#eefb7a] sm:text-sm"
              >
                Test the upload layer
              </a>
              <a
                href="/how-it-works"
                className="hover-lift inline-flex min-h-12 items-center rounded-full border border-white/15 px-6 text-xs font-bold uppercase transition hover:border-white/40 sm:text-sm"
              >
                Explore the workflow
              </a>
            </div>
          </div>
          <div data-reveal="right" style={{ '--reveal-delay': '120ms' } as CSSProperties}>
            <HeroExperience />
          </div>
        </div>
      </section>
      <div className="overflow-hidden border-b border-black/15 bg-[#eefb7a] py-3.5 text-black" aria-label="UploadFlow workflow">
        <div className="animated-marquee gap-10 text-xs font-black uppercase italic tracking-[.22em] sm:text-sm">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-10">
              {item} <span aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function AvailableTodaySection() {
  return (
    <section className="border-b border-white/10 bg-[#101416]/88">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-12" data-reveal>
        <p className="eyebrow text-emerald-400">Chrome Web Store Extension</p>
        <h2 className="mt-5 text-4xl sm:text-6xl">What is already working</h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55">
          These are not isolated demos. They are connected parts of the extension&apos;s source-to-destination workflow.
        </p>
        <div className="mt-10 grid border-l border-t border-white/15 sm:grid-cols-2">
          {availableToday.map(([title, copy], index) => (
            <article key={title} className="feature-card border-b border-r border-white/15 p-6 sm:p-8" data-reveal style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Ready in build
                </span>
                <span className="font-mono text-xs text-white/25">/{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-10 text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection() {
  return (
    <section id="workflow" className="mx-auto max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
        <div data-reveal="left">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-5xl sm:text-6xl">
            One pause.
            <br />
            Total control.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/48">
            UploadFlow adds a reviewable workspace exactly where browsers normally force a download-and-find detour.
          </p>
        </div>
        <div className="section-rail pl-6 sm:pl-8" data-reveal="right">
          {workflow.map(([number, title, copy], index) => (
            <article key={number} className="feature-card grid gap-4 border-b border-white/15 py-8 sm:grid-cols-[70px_180px_1fr]" style={{ '--reveal-delay': `${index * 65}ms` } as CSSProperties}>
              <span className="font-mono text-xs font-semibold text-[#eefb7a] sm:text-sm">/{number}</span>
              <h3 className="text-xl">{title}</h3>
              <p className="text-sm leading-relaxed text-white/55 sm:text-base">{copy}</p>
            </article>
          ))}
        </div>
      </div>
      <figure className="media-frame mt-16" data-reveal>
        <img src="/features/cross-site-handoff.png" alt="UploadFlow cross-site media handoff" width="1731" height="909" />
        <figcaption className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/48">
          <span>Source → workspace → destination</span>
          <span className="text-[#eefb7a]">The complete browser flow</span>
        </figcaption>
      </figure>
    </section>
  );
}

export function ExtensionSection() {
  return (
    <section id="extension" className="border-y border-white/10 bg-[#101416]/90">
      <div className="mx-auto grid max-w-360 gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:px-12">
        <div data-reveal="left">
          <p className="eyebrow text-emerald-400">From source to destination</p>
          <h2 className="mt-5 text-5xl sm:text-6xl">
            Find it once.
            <br />
            <span className="text-[#eefb7a]">Upload it elsewhere.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">
            Inspect Mode appears only while needed. Right-click capture, the private shelf, and destination-aware retrieval provide alternate
            routes through the same media memory.
          </p>
        </div>
        <div className="section-rail pl-6 sm:pl-8" data-reveal="right">
          {browserFeatures.map(([number, title, copy]) => (
            <article key={number} className="feature-card grid grid-cols-[44px_1fr] border-b border-white/15 py-5">
              <span className="font-mono text-xs font-semibold text-[#eefb7a] sm:text-sm">/{number}</span>
              <div>
                <h3 className="text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{copy}</p>
              </div>
            </article>
          ))}
        </div>
        <figure className="media-frame lg:col-span-2" data-reveal>
          <img
            src="/features/media-shelf-actual.png"
            alt="UploadFlow side panel showing saved media beside the active website"
            width="2808"
            height="1498"
            loading="lazy"
            className="h-auto w-full object-contain object-top"
          />
          <figcaption className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/48">
            <span>Persistent side panel</span>
            <span className="text-[#eefb7a]">Context stays beside the destination</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function TrustSections() {
  return (
    <>
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-12" data-reveal>
          <p className="eyebrow">Trust boundaries</p>
          <h2 className="mt-5 text-4xl sm:text-6xl">
            Clear permissions.
            <br />
            Clear boundaries.
          </h2>
          <div className="mt-10 grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {permissions.map(([title, copy], index) => (
              <article key={title} className="feature-card border-b border-r border-white/15 p-6" data-reveal style={{ '--reveal-delay': `${index * 65}ms` } as CSSProperties}>
                <span className="font-mono text-xs text-[#eefb7a]">/{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-10 text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-white/10 bg-[#101416]/90">
        <div className="mx-auto grid max-w-360 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
          <div data-reveal="left">
            <p className="eyebrow text-emerald-400">Compatibility</p>
            <h2 className="mt-5 text-5xl">Some URLs stay protected.</h2>
          </div>
          <ul className="section-rail pl-6 sm:pl-8" data-reveal="right">
            {compatibilityNotes.map((note) => (
              <li key={note} className="flex gap-3 border-b border-white/15 py-4 text-sm text-white/60 sm:text-base">
                <span className="mt-0.5 shrink-0 text-[#eefb7a]"><CheckIcon /></span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="privacy">
        <div className="mx-auto grid max-w-360 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
          <h2 className="text-6xl sm:text-7xl" data-reveal="left">
            Your files
            <br />
            stay yours.
          </h2>
          <div className="content-card" data-reveal="right">
            <p className="text-lg leading-relaxed text-white/60 sm:text-xl">
              <strong className="text-white">Local by default. </strong>Image preparation, privacy review, crop/background work, watermarks,
              batches, platform packs, duplicate checks, and supported video work run in your browser. URL retrieval and optional AI upscaling
              are explicit network actions.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
