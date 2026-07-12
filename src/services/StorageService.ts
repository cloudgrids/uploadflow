export class StorageService {
  private get storage(): chrome.storage.StorageArea {
    if (!chrome?.storage?.local) console.log('Chrome storage API is not available');

    return chrome.storage.local;
  }

  async get<T = Record<string, unknown>>(keys: string[]): Promise<T> {
    return new Promise((resolve) => {
      this.storage.get(keys, (items) => resolve(items as T));
    });
  }

  async set(items: Record<string, unknown>): Promise<void> {
    return new Promise((resolve) => {
      this.storage.set(items, resolve);
    });
  }

  async remove(keys: string[]): Promise<void> {
    return new Promise((resolve) => {
      this.storage.remove(keys, resolve);
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve) => {
      this.storage.clear(resolve);
    });
  }
}

export const storageService = new StorageService();
