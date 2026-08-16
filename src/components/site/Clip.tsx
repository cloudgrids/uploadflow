'use client';

import { useEffect, useRef } from 'react';

/**
 * An autoplaying, muted, looping product recording.
 *
 * Reduced motion is honoured at runtime rather than only at first render: the
 * clip falls back to its poster with real controls, and follows the preference
 * if it changes mid-session.
 */
export function Clip({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    // A first play() can reject before enough data has arrived. If playback
    // starts on its own afterwards, take the fallback controls back off.
    const onPlaying = () => {
      if (!query.matches) video.controls = false;
    };
    video.addEventListener('playing', onPlaying);

    const apply = () => {
      if (query.matches) {
        video.loop = false;
        video.controls = true;
        video.pause();
        video.currentTime = 0;
        return;
      }
      video.loop = true;
      video.controls = false;
      video.play().catch(() => {
        if (video.paused) video.controls = true;
      });
    };

    apply();
    query.addEventListener('change', apply);
    return () => {
      query.removeEventListener('change', apply);
      video.removeEventListener('playing', onPlaying);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={1440}
      height={900}
      muted
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
