import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import {
  PAGE_INTERCEPTOR_SOURCE,
  type PageInterceptorKind,
  type PageInterceptorReady,
  type PageInterceptorRequest,
  type PageInterceptorResponse
} from '../types/PageInterceptor';
import type { OverlayManager } from './OverlayManager';

export class PageApiInterceptor {
  private readonly kinds: PageInterceptorKind[];
  private readonly overlayManager: OverlayManager;
  private readonly messageService: MessageService;

  constructor(kinds: PageInterceptorKind | PageInterceptorKind[], overlayManager: OverlayManager, messageService: MessageService) {
    this.kinds = Array.isArray(kinds) ? kinds : [kinds];
    this.overlayManager = overlayManager;
    this.messageService = messageService;
  }

  register(): void {
    window.addEventListener('message', this.handleMessage);
    const ready: PageInterceptorReady = { source: PAGE_INTERCEPTOR_SOURCE, type: 'READY' };
    window.postMessage(ready, '*');
  }

  unregister(): void {
    window.removeEventListener('message', this.handleMessage);
  }

  private respond(id: string, files: File[]): void {
    const response: PageInterceptorResponse = {
      source: PAGE_INTERCEPTOR_SOURCE,
      type: 'RESPONSE',
      id,
      files
    };
    window.postMessage(response, '*');
  }

  private readonly handleMessage = (event: MessageEvent<unknown>): void => {
    if (event.source !== window || !this.isRequest(event.data) || !this.kinds.includes(event.data.kind)) return;

    const { id, files } = event.data;
    if (!files.length) {
      this.respond(id, files);
      return;
    }

    void this.messageService
      .send<ExtensionConfig>({ type: 'GET_CONFIG' })
      .then((config) => {
        if (!config?.settings?.generalSettings?.enableUploadFlow) {
          this.respond(id, files);
          return;
        }

        this.overlayManager.show({
          files,
          config: config.settings,
          onComplete: (modifiedFiles) => this.respond(id, modifiedFiles),
          onCancel: () => this.respond(id, files)
        });
      })
      .catch(() => this.respond(id, files));
  };

  private isRequest(value: unknown): value is PageInterceptorRequest {
    if (!value || typeof value !== 'object') return false;
    const request = value as Partial<PageInterceptorRequest>;
    return (
      request.source === PAGE_INTERCEPTOR_SOURCE &&
      request.type === 'REQUEST' &&
      typeof request.id === 'string' &&
      Array.isArray(request.files)
    );
  }
}
