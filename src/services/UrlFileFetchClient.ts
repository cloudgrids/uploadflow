import {
  URL_FILE_FETCH_PORT,
  type FetchedUrlFile,
  type UrlFileFetchMessage,
  type UrlFileFetchRequest
} from '../types/UrlFileFetch';

export class UrlFileFetchClient {
  fetch(url: string, onProgress?: (received: number, total: number) => void): Promise<FetchedUrlFile> {
    return new Promise((resolve, reject) => {
      const port = chrome.runtime.connect({ name: URL_FILE_FETCH_PORT });
      const chunks: ArrayBuffer[] = [];
      let contentType = 'application/octet-stream';
      let filename: string | undefined;
      let totalBytes = 0;
      let settled = false;

      const finish = (action: () => void) => {
        if (settled) return;
        settled = true;
        port.disconnect();
        action();
      };

      port.onMessage.addListener((message: UrlFileFetchMessage) => {
        if (message.type === 'meta') {
          contentType = message.contentType;
          filename = message.filename;
          totalBytes = message.totalBytes;
          return;
        }
        if (message.type === 'chunk') {
          chunks.push(this.fromBase64(message.data));
          onProgress?.(message.receivedBytes, totalBytes);
          return;
        }
        if (message.type === 'complete') {
          finish(() => resolve({ blob: new Blob(chunks, { type: contentType }), filename }));
          return;
        }
        finish(() => reject(new Error(message.message)));
      });
      port.onDisconnect.addListener(() => {
        if (settled) return;
        const error = chrome.runtime.lastError;
        finish(() => reject(new Error(error?.message ?? 'The background fetch ended unexpectedly')));
      });
      const request: UrlFileFetchRequest = { type: 'fetch', url };
      port.postMessage(request);
    });
  }

  private fromBase64(value: string): ArrayBuffer {
    const binary = atob(value);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return buffer;
  }
}
