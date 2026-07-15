import {
  URL_FILE_FETCH_PORT,
  type UrlFileFetchMessage,
  type UrlFileFetchRequest
} from '../types/UrlFileFetch';

export class UrlFileFetchService {
  register(): void {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== URL_FILE_FETCH_PORT) return;
      let controller: AbortController | null = null;
      port.onMessage.addListener((message: UrlFileFetchRequest) => {
        if (message?.type !== 'fetch') return;
        controller?.abort();
        controller = new AbortController();
        void this.fetchToPort(message.url, port, controller.signal);
      });
      port.onDisconnect.addListener(() => controller?.abort());
    });
  }

  private async fetchToPort(value: string, port: chrome.runtime.Port, signal: AbortSignal): Promise<void> {
    try {
      const url = new URL(value);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Only HTTP and HTTPS URLs are supported');
      const origin = `${url.protocol}//${url.host}/*`;
      const allowed = await chrome.permissions.contains({ origins: [origin] });
      if (!allowed) throw new Error(`UploadFlow does not have access to ${url.host}`);

      const response = await fetch(url.href, { credentials: 'include', signal });
      if (!response.ok) throw new Error(`The URL returned HTTP ${response.status}`);
      const contentType = response.headers.get('content-type')?.split(';')[0]?.trim() || 'application/octet-stream';
      const totalBytes = Number(response.headers.get('content-length')) || 0;
      this.send(port, {
        type: 'meta',
        contentType,
        filename: this.responseFilename(response),
        totalBytes
      });

      if (!response.body) {
        const bytes = new Uint8Array(await response.arrayBuffer());
        this.send(port, { type: 'chunk', data: this.toBase64(bytes), receivedBytes: bytes.byteLength });
      } else {
        const reader = response.body.getReader();
        let receivedBytes = 0;
        while (true) {
          const { done, value: chunk } = await reader.read();
          if (done) break;
          receivedBytes += chunk.byteLength;
          this.send(port, { type: 'chunk', data: this.toBase64(chunk), receivedBytes });
        }
      }
      this.send(port, { type: 'complete' });
    } catch (error) {
      if (signal.aborted) return;
      this.send(port, {
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not fetch this URL'
      });
    }
  }

  private responseFilename(response: Response): string | undefined {
    const disposition = response.headers.get('content-disposition');
    const encoded = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
    const plain = disposition?.match(/filename="?([^";]+)"?/i)?.[1];
    if (encoded) return decodeURIComponent(encoded);
    return plain;
  }

  private toBase64(bytes: Uint8Array): string {
    let binary = '';
    const batchSize = 0x8000;
    for (let index = 0; index < bytes.length; index += batchSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + batchSize));
    }
    return btoa(binary);
  }

  private send(port: chrome.runtime.Port, message: UrlFileFetchMessage): void {
    try {
      port.postMessage(message);
    } catch {
      // The picker was closed while the response was streaming.
    }
  }
}
