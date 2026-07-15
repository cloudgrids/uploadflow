import { MEDIA_SELECTOR, type MediaElement, isMediaElement } from './Media';

type EnsureControl = (media: MediaElement) => boolean;

function containsPoint(media: MediaElement, x: number, y: number): boolean {
  const rect = media.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function isRendered(media: MediaElement): boolean {
  const style = getComputedStyle(media);
  return style.display !== 'none' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity || '1') > 0.01;
}

function priority(media: MediaElement): number {
  if (media instanceof HTMLVideoElement) return 3;
  if (media instanceof HTMLAudioElement) return 2;
  return 1;
}

function bestMediaAtPoint(candidates: Iterable<MediaElement>, x: number, y: number, ensureControl: EnsureControl): MediaElement | null {
  const matches = Array.from(candidates).filter(
    (candidate) => ensureControl(candidate) && containsPoint(candidate, x, y) && isRendered(candidate)
  );
  matches.sort((left, right) => priority(right) - priority(left));
  return matches[0] ?? null;
}

export function mediaFromPointerEvent(event: PointerEvent, ensureControl: EnsureControl): MediaElement | null {
  let directImage: HTMLImageElement | null = null;
  for (const node of event.composedPath()) {
    if (!isMediaElement(node) || !ensureControl(node)) continue;
    if (node instanceof HTMLVideoElement || node instanceof HTMLAudioElement) return node;
    directImage ??= node;
  }

  const target = event.target;
  if (!(target instanceof Element)) return directImage;

  const directMedia = target.closest<MediaElement>(MEDIA_SELECTOR);
  if (directMedia && ensureControl(directMedia)) {
    if (directMedia instanceof HTMLVideoElement || directMedia instanceof HTMLAudioElement) return directMedia;
    directImage ??= directMedia;
  }

  // Player controls and pseudo-elements often become the pointer target while
  // the visible media is a sibling elsewhere inside the same wrapper.
  let container: Element | null = target;
  for (let depth = 0; container && depth < 5; depth += 1, container = container.parentElement) {
    if (container === document.body || container === document.documentElement) break;
    const media = bestMediaAtPoint(
      Array.from(container.querySelectorAll<MediaElement>(MEDIA_SELECTOR)),
      event.clientX,
      event.clientY,
      ensureControl
    );
    if (media) return media;
  }

  for (const element of document.elementsFromPoint(event.clientX, event.clientY)) {
    if (isMediaElement(element) && ensureControl(element)) return element;
    const media = bestMediaAtPoint(
      Array.from(element.querySelectorAll<MediaElement>(MEDIA_SELECTOR)),
      event.clientX,
      event.clientY,
      ensureControl
    );
    if (media) return media;
  }

  return directImage;
}
