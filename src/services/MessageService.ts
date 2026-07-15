import type { ExtensionMessage } from '../types/Message';

const INVALIDATED_MESSAGE = 'UploadFlow was reloaded. Refresh this page to reconnect the extension.';

export class MessageService {
  private readonly invalidationListeners = new Set<() => void>();
  private invalidated = false;

  public onContextInvalidated(listener: () => void): () => void {
    this.invalidationListeners.add(listener);
    return () => this.invalidationListeners.delete(listener);
  }

  public normalizeRuntimeError(error: unknown): Error {
    const normalized = error instanceof Error ? error : new Error('Could not contact the UploadFlow background service');
    if (this.hasRuntimeContext() && !this.isInvalidatedMessage(normalized.message)) return normalized;
    this.notifyInvalidated();
    return new Error(INVALIDATED_MESSAGE);
  }

  public send<TResponse>(message: ExtensionMessage): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      if (!this.hasRuntimeContext()) {
        this.rejectInvalidated(reject);
        return;
      }

      try {
        chrome.runtime.sendMessage(message, (response: TResponse) => {
          if (!this.hasRuntimeContext()) {
            this.rejectInvalidated(reject);
            return;
          }
          const error = chrome.runtime.lastError;
          if (error) {
            if (this.isInvalidatedMessage(error.message ?? '')) this.rejectInvalidated(reject);
            else reject(new Error(error.message ?? 'Could not contact the UploadFlow background service'));
            return;
          }
          resolve(response);
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (!this.hasRuntimeContext() || this.isInvalidatedMessage(message)) this.rejectInvalidated(reject);
        else reject(error instanceof Error ? error : new Error('Could not contact the UploadFlow background service'));
      }
    });
  }

  private hasRuntimeContext(): boolean {
    return typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id);
  }

  private isInvalidatedMessage(message: string): boolean {
    return /extension context invalidated/i.test(message);
  }

  private rejectInvalidated(reject: (reason: Error) => void): void {
    reject(new Error(INVALIDATED_MESSAGE));
    this.notifyInvalidated();
  }

  private notifyInvalidated(): void {
    if (this.invalidated) return;
    this.invalidated = true;
    this.invalidationListeners.forEach((listener) => listener());
  }
}

export function isExtensionContextInvalidatedError(error: unknown): boolean {
  return error instanceof Error && error.message === INVALIDATED_MESSAGE;
}
