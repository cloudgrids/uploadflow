'use client';

import { useEffect } from 'react';

export function MotionSystem() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('motion-ready');

    let intersectionObserver: IntersectionObserver | null = null;

    const reveal = (element: HTMLElement) => element.setAttribute('data-visible', 'true');
    const register = (element: HTMLElement) => {
      if (element.dataset.visible === 'true') return;
      if (reducedMotion || !intersectionObserver) reveal(element);
      else intersectionObserver.observe(element);
    };

    if (!reducedMotion && 'IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            reveal(entry.target as HTMLElement);
            intersectionObserver?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
    }

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(register);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches('[data-reveal]')) register(node);
          node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(register);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    if (!reducedMotion) window.addEventListener('pointermove', updatePointer, { passive: true });

    return () => {
      intersectionObserver?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('pointermove', updatePointer);
      root.classList.remove('motion-ready');
    };
  }, []);

  return (
    <>
      <div className="site-pointer-glow" aria-hidden="true" />
      <div className="site-scroll-progress" aria-hidden="true" />
    </>
  );
}
