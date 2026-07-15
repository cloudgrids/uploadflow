export type MediaElement = HTMLImageElement | HTMLVideoElement | HTMLAudioElement;

export const MEDIA_SELECTOR = 'img, video, audio';

export function isMediaElement(value: unknown): value is MediaElement {
  return value instanceof HTMLImageElement || value instanceof HTMLVideoElement || value instanceof HTMLAudioElement;
}
