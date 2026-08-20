'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Headline that types itself in, with the caret treatment from
 * antigravity.google.
 *
 * The full text is always rendered in the DOM for search engines and for
 * anyone whose animations never run; only what is *shown* is trimmed, and it
 * settles on the complete string. Typing is skipped entirely when the document
 * is hidden or reduced motion is on, because a background tab throttles both
 * timers and animations and would otherwise strand a half-typed headline.
 */
export function Typewriter({ text, className }: { text: string; className?: string }) {
  const [shown, setShown] = useState(text);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || document.hidden) return;

    const CPS = 34;
    const start = performance.now();
    // No synchronous clear: state starts as the full text, so if rAF never runs
    // the headline is complete rather than empty. The first frame trims it.
    const step = (now: number) => {
      if (document.hidden) {
        setShown(text);
        raf.current = null;
        return;
      }
      const n = Math.floor(((now - start) / 1000) * CPS);
      if (n >= text.length) {
        setShown(text);
        raf.current = null;
        return;
      }
      setShown(text.slice(0, n));
      raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text]);

  const done = shown.length === text.length;

  return (
    <span className={className}>
      {/* the complete text stays in the accessibility tree the whole time */}
      <span className="uf-sr">{text}</span>
      <span aria-hidden="true">
        {shown}
        {done ? null : <span className="uf-caret" />}
      </span>
    </span>
  );
}
