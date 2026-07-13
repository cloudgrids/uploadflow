import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import { FileBypass } from './FileBypass';
import type { OverlayManager } from './OverlayManager';

export class FileInputInterceptor {
  private readonly overlayManager: OverlayManager;
  private readonly messageService: MessageService;

  constructor(overlayManager: OverlayManager, messageService: MessageService) {
    this.overlayManager = overlayManager;
    this.messageService = messageService;
  }

  register(): void {
    window.addEventListener('change', this.handleChange, true);
  }

  unregister(): void {
    window.removeEventListener('change', this.handleChange, true);
  }

  private readonly handleChange = (event: Event): void => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'file' || !input.files?.length) return;

    if (input.dataset.ufProcessed === 'true') {
      delete input.dataset.ufProcessed;
      return;
    }

    event.stopImmediatePropagation();
    event.preventDefault();
    const files = Array.from(input.files);

    void this.messageService
      .send<ExtensionConfig>({ type: 'GET_CONFIG' })
      .then((config) => {
        if (!config?.settings?.generalSettings?.enableUploadFlow) {
          FileBypass.input(input, files);
          return;
        }
        this.overlayManager.show({
          files,
          config: config.settings,
          onComplete: (modifiedFiles) => FileBypass.input(input, modifiedFiles),
          onCancel: () => {
            input.value = '';
          }
        });
      })
      .catch(() => FileBypass.input(input, files));
  };
}
