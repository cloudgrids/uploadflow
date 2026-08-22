'use client';

import { useSyncExternalStore } from 'react';

/**
 * The current time, once per second, and `0` until the browser has it.
 *
 * The clock is unknowable during a server render — rendering one would put a timestamp in the HTML
 * that is wrong by however long the page sat in a cache — so the server snapshot is `0` and callers
 * treat that as *not yet*. This is the same shape the rest of the site uses for anything the server
 * cannot know.
 *
 * One interval for every consumer rather than one each, and it stops when the last one goes.
 */
let ticked = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (!timer) {
    ticked = Date.now();
    timer = setInterval(() => {
      ticked = Date.now();
      for (const fn of listeners) fn();
    }, 1000);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => ticked;
const getServerSnapshot = () => 0;

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** How long is left, in the largest units that still say something useful. */
export function timeLeft(untilIso: string, now: number): string | null {
  if (!now) return null;

  const ms = new Date(untilIso).getTime() - now;
  if (Number.isNaN(ms)) return null;
  if (ms <= 0) return 'Closed';

  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // Below a day the seconds are the point; above it they are noise that redraws every second for
  // nothing.
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s left`;
  return `${seconds}s left`;
}
