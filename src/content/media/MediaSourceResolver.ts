import type { MediaElement } from './Media';

export class MediaSourceResolver {
  private capturedSources: string[][] = [];

  capture(urls: string[]): void {
    if (!urls.length) return;
    this.capturedSources.push(urls);
    this.capturedSources = this.capturedSources.slice(-20);
  }

  clear(): void {
    this.capturedSources = [];
  }

  urlFor(media: MediaElement): string | null {
    const currentSource = this.resolve(media.currentSrc);
    if (currentSource && !currentSource.startsWith('blob:')) return currentSource;

    const declaredSource = Array.from(media.querySelectorAll<HTMLSourceElement>('source[src]'))
      .map((source) => this.resolve(source.src || source.getAttribute('src')))
      .find((url): url is string => Boolean(url && !url.startsWith('blob:')));
    if (declaredSource) return declaredSource;

    const attributeSource = this.resolve(media.getAttribute('src'));
    if (attributeSource && !attributeSource.startsWith('blob:')) return attributeSource;

    if (currentSource?.startsWith('blob:') && media instanceof HTMLVideoElement) {
      return this.capturedSourceFor(media);
    }
    return currentSource ?? attributeSource;
  }

  downloadName(url: string, media: MediaElement): string {
    try {
      const name = new URL(url).pathname.split('/').filter(Boolean).pop();
      if (name) {
        const decoded = decodeURIComponent(name);
        const safeName = Array.from(decoded.replace(/[<>:"/\\|?*]/g, '_'))
          .map((character) => (character.charCodeAt(0) < 32 ? '_' : character))
          .join('')
          .replace(/^\.+/, '');
        if (safeName) return safeName;
      }
    } catch {
      // Fall back to a stable generic filename below.
    }
    return `uploadflow-${media.tagName.toLowerCase()}`;
  }

  private resolve(raw: string | null): string | null {
    if (!raw) return null;
    try {
      return new URL(raw, document.baseURI).href;
    } catch {
      return raw;
    }
  }

  private capturedSourceFor(media: HTMLVideoElement): string | null {
    const posterIds = this.mediaIds(media.poster);
    let bestUrl: string | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    this.capturedSources.forEach((batch, batchIndex) => {
      batch.forEach((url) => {
        const isDirectVideo = /\.(mp4|webm|m3u8)(?:\?|$)/i.test(url);
        const sharedId = this.mediaIds(url).some((id) => posterIds.includes(id));
        const dimensions = url.match(/\/(\d{2,4})x(\d{2,4})\//);
        const pixels = dimensions ? Number(dimensions[1]) * Number(dimensions[2]) : 0;
        const score = (sharedId ? 1_000_000_000 : 0) + (isDirectVideo ? 10_000_000 : 0) + pixels + batchIndex;
        if (score > bestScore) {
          bestScore = score;
          bestUrl = url;
        }
      });
    });
    return bestUrl;
  }

  private mediaIds(url: string): string[] {
    return url.match(/\d{6,}/g) ?? [];
  }
}
