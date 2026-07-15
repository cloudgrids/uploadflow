export type MediaElement = HTMLImageElement | HTMLVideoElement | HTMLAudioElement;

export interface MediaBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export const MEDIA_SELECTOR = 'img, video, audio';

export function isMediaElement(value: unknown): value is MediaElement {
  return value instanceof HTMLImageElement || value instanceof HTMLVideoElement || value instanceof HTMLAudioElement;
}

export function visibleMediaBounds(media: MediaElement): MediaBounds {
  const elementRect = media.getBoundingClientRect();
  if (media instanceof HTMLAudioElement) return clipToVisibleArea(media, elementRect);

  const intrinsicWidth = media instanceof HTMLImageElement ? media.naturalWidth : media.videoWidth;
  const intrinsicHeight = media instanceof HTMLImageElement ? media.naturalHeight : media.videoHeight;
  if (!intrinsicWidth || !intrinsicHeight || !media.offsetWidth || !media.offsetHeight) {
    return clipToVisibleArea(media, elementRect);
  }

  const style = getComputedStyle(media);
  if (style.objectFit !== 'contain' && style.objectFit !== 'scale-down' && style.objectFit !== 'none') {
    return clipToVisibleArea(media, elementRect);
  }

  const scaleX = elementRect.width / media.offsetWidth;
  const scaleY = elementRect.height / media.offsetHeight;
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(style.paddingRight) || 0;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(style.paddingBottom) || 0;
  const contentWidth = Math.max(0, media.clientWidth - paddingLeft - paddingRight);
  const contentHeight = Math.max(0, media.clientHeight - paddingTop - paddingBottom);
  if (!contentWidth || !contentHeight) return clipToVisibleArea(media, elementRect);

  const containScale = Math.min(contentWidth / intrinsicWidth, contentHeight / intrinsicHeight);
  const fittedScale = style.objectFit === 'none'
    ? 1
    : style.objectFit === 'scale-down' ? Math.min(1, containScale) : containScale;
  const fittedWidth = intrinsicWidth * fittedScale;
  const fittedHeight = intrinsicHeight * fittedScale;

  const [positionX = '50%', positionY = '50%'] = style.objectPosition.split(/\s+/);
  const offsetX = objectPositionOffset(positionX, contentWidth - fittedWidth);
  const offsetY = objectPositionOffset(positionY, contentHeight - fittedHeight);
  const contentLeft = elementRect.left + (media.clientLeft + paddingLeft) * scaleX;
  const contentTop = elementRect.top + (media.clientTop + paddingTop) * scaleY;
  const left = Math.max(contentLeft, contentLeft + offsetX * scaleX);
  const top = Math.max(contentTop, contentTop + offsetY * scaleY);
  const right = Math.min(contentLeft + contentWidth * scaleX, contentLeft + (offsetX + fittedWidth) * scaleX);
  const bottom = Math.min(contentTop + contentHeight * scaleY, contentTop + (offsetY + fittedHeight) * scaleY);
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);

  if (!width || !height) return clipToVisibleArea(media, elementRect);

  return clipToVisibleArea(media, { top, right, bottom, left, width, height });
}

function clipToVisibleArea(media: MediaElement, initialBounds: MediaBounds): MediaBounds {
  let left = Math.max(0, initialBounds.left);
  let top = Math.max(0, initialBounds.top);
  let right = Math.min(window.innerWidth, initialBounds.right);
  let bottom = Math.min(window.innerHeight, initialBounds.bottom);
  let ancestor = composedParent(media);

  while (ancestor && ancestor !== document.documentElement) {
    const style = getComputedStyle(ancestor);
    const clipsPaint = style.contain.split(/\s+/).includes('paint');
    const clipsX = clipsPaint || clipsOverflow(style.overflowX);
    const clipsY = clipsPaint || clipsOverflow(style.overflowY);

    if (clipsX || clipsY) {
      const rect = ancestor.getBoundingClientRect();
      const scaleX = ancestor instanceof HTMLElement && ancestor.offsetWidth ? rect.width / ancestor.offsetWidth : 1;
      const scaleY = ancestor instanceof HTMLElement && ancestor.offsetHeight ? rect.height / ancestor.offsetHeight : 1;
      const clientLeft = rect.left + ancestor.clientLeft * scaleX;
      const clientTop = rect.top + ancestor.clientTop * scaleY;
      if (clipsX) {
        left = Math.max(left, clientLeft);
        right = Math.min(right, clientLeft + ancestor.clientWidth * scaleX);
      }
      if (clipsY) {
        top = Math.max(top, clientTop);
        bottom = Math.min(bottom, clientTop + ancestor.clientHeight * scaleY);
      }
    }

    ancestor = composedParent(ancestor);
  }

  return {
    top,
    right,
    bottom,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
}

function composedParent(element: Element): Element | null {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
}

function clipsOverflow(value: string): boolean {
  return value === 'hidden' || value === 'clip' || value === 'auto' || value === 'scroll';
}

function objectPositionOffset(value: string, freeSpace: number): number {
  if (value.endsWith('%')) return freeSpace * ((Number.parseFloat(value) || 0) / 100);
  if (value.endsWith('px')) return Number.parseFloat(value) || 0;
  if (value === 'center') return freeSpace / 2;
  if (value === 'right' || value === 'bottom') return freeSpace;
  if (value === 'left' || value === 'top') return 0;
  return freeSpace / 2;
}
