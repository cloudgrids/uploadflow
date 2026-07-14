import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import { FileBypass } from './FileBypass';
import type { OverlayManager } from './OverlayManager';

export class FileInputInterceptor {
  private readonly overlayManager: OverlayManager;
  private readonly messageService: MessageService;
  private readonly pendingInputs = new WeakSet<HTMLInputElement>();

  constructor(overlayManager: OverlayManager, messageService: MessageService) {
    this.overlayManager = overlayManager;
    this.messageService = messageService;
  }

  register(): void {
    window.addEventListener('input', this.handleInput, true);
  }

  unregister(): void {
    window.removeEventListener('input', this.handleInput, true);
  }

  private readonly handleInput = (event: Event): void => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'file' || !input.files?.length) return;

    if (FileBypass.consumeProcessedInput(input)) return;
    if (FileBypass.isBypassInput(event)) return;
    if (!event.isTrusted) return;

    event.stopImmediatePropagation();
    event.preventDefault();

    if (this.pendingInputs.has(input)) return;

    this.pendingInputs.add(input);
    input.dataset.ufInputPending = 'true';
    const files = Array.from(input.files);

    const replay = (nextFiles: File[]) => {
      this.pendingInputs.delete(input);
      delete input.dataset.ufInputPending;
      FileBypass.input(input, nextFiles);
    };

    const cancel = () => {
      this.pendingInputs.delete(input);
      delete input.dataset.ufInputPending;
      input.value = '';
    };

    void this.messageService
      .send<ExtensionConfig>({ type: 'GET_CONFIG' })
      .then((config) => {
        if (!config?.settings?.generalSettings?.enableUploadFlow) {
          replay(files);
          return;
        }

        this.overlayManager.show({
          files,
          config: config.settings,
          onComplete: replay,
          onCancel: cancel
        });
      })
      .catch(() => replay(files));
  };
}
