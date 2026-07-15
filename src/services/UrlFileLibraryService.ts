import type { StorageService } from './StorageService';
import type { UrlFileMediaType, UrlFileRecord } from '../types/Message';

const URL_FILES_KEY = 'urlFiles';
const MAX_URL_FILES = 20;

export class UrlFileLibraryService {
  private readonly storage: StorageService;

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  async list(): Promise<UrlFileRecord[]> {
    const { urlFiles = [] } = await this.storage.get<{ urlFiles?: UrlFileRecord[] }>([URL_FILES_KEY]);
    return Array.isArray(urlFiles)
      ? urlFiles.slice(0, MAX_URL_FILES).map((record) => ({ ...record, mediaType: record.mediaType ?? 'file' }))
      : [];
  }

  async save(
    url: string,
    name?: string,
    previewUrl?: string,
    mediaType: UrlFileMediaType = 'file'
  ): Promise<UrlFileRecord[]> {
    const normalizedUrl = this.normalizeUrl(url);
    const files = await this.list();
    const existing = files.find((item) => item.url === normalizedUrl);
    const record: UrlFileRecord = {
      id: existing?.id ?? crypto.randomUUID(),
      url: normalizedUrl,
      name: name?.trim() || existing?.name || this.nameFromUrl(normalizedUrl),
      previewUrl: previewUrl ? this.normalizeUrl(previewUrl) : existing?.previewUrl,
      mediaType: mediaType || existing?.mediaType || 'file',
      createdAt: new Date().toISOString()
    };
    const next = [record, ...files.filter((item) => item.url !== normalizedUrl)].slice(0, MAX_URL_FILES);
    await this.storage.set({ [URL_FILES_KEY]: next });
    return next;
  }

  async remove(id: string): Promise<UrlFileRecord[]> {
    const next = (await this.list()).filter((item) => item.id !== id);
    await this.storage.set({ [URL_FILES_KEY]: next });
    return next;
  }

  private normalizeUrl(value: string): string {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Only HTTP and HTTPS file URLs are supported');
    return url.href;
  }

  private nameFromUrl(url: string): string {
    try {
      const name = new URL(url).pathname.split('/').filter(Boolean).pop();
      return name ? decodeURIComponent(name) : 'remote-file';
    } catch {
      return 'remote-file';
    }
  }
}
