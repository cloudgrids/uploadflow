import { useEffect, useRef, type ComponentProps } from 'react';

interface CachedObjectUrl {
  url: string;
  references: number;
  revokeTimer: number | null;
}

const objectUrlCache = new WeakMap<Blob, CachedObjectUrl>();

function acquireObjectUrl(blob: Blob): CachedObjectUrl {
  const cached = objectUrlCache.get(blob);

  if (cached) {
    if (cached.revokeTimer !== null) {
      window.clearTimeout(cached.revokeTimer);
      cached.revokeTimer = null;
    }
    cached.references += 1;
    return cached;
  }

  const created = {
    url: URL.createObjectURL(blob),
    references: 1,
    revokeTimer: null
  };
  objectUrlCache.set(blob, created);
  return created;
}

function releaseObjectUrl(blob: Blob, cached: CachedObjectUrl): void {
  cached.references -= 1;
  if (cached.references > 0) return;

  // Delay revocation until the next task so another editor mounted during the
  // same navigation can reuse the URL instead of allocating a replacement.
  cached.revokeTimer = window.setTimeout(() => {
    if (cached.references > 0 || objectUrlCache.get(blob) !== cached) return;
    URL.revokeObjectURL(cached.url);
    objectUrlCache.delete(blob);
  }, 0);
}

interface ObjectUrlImageProps extends Omit<ComponentProps<'img'>, 'ref' | 'src'> {
  file: Blob;
}

export function ObjectUrlImage({ file, ...imageProps }: ObjectUrlImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const cached = acquireObjectUrl(file);
    const image = imageRef.current;
    if (image) image.src = cached.url;

    return () => {
      if (image) image.removeAttribute('src');
      releaseObjectUrl(file, cached);
    };
  }, [file]);

  return <img ref={imageRef} {...imageProps} />;
}
