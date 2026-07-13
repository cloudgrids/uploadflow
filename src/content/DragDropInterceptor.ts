import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import { FileBypass } from './FileBypass';
import type { OverlayManager } from './OverlayManager';

export class DragDropInterceptor {
  private readonly overlayManager: OverlayManager;
  private readonly messageService: MessageService;

  constructor(overlayManager: OverlayManager, messageService: MessageService) {
    this.overlayManager = overlayManager;
    this.messageService = messageService;
  }

  register(): void {
    window.addEventListener('drop', this.handleDrop, true);
  }

  unregister(): void {
    window.removeEventListener('drop', this.handleDrop, true);
  }

  private readonly handleDrop = (event: DragEvent): void => {
    if (FileBypass.isBypassDrop(event) || !event.dataTransfer?.files.length || !event.target) return;

    event.stopImmediatePropagation();
    event.preventDefault();

    const files = Array.from(event.dataTransfer.files);
    const target = event.target;

    this.messageService
      .send<ExtensionConfig>({ type: 'GET_CONFIG' })
      .then((config) => {
        if (!config?.settings?.generalSettings?.enableUploadFlow) {
          FileBypass.drop(event, files, target);
          return;
        }

        this.overlayManager.show({
          files,
          config: config.settings,
          onComplete: (modifiedFiles) => FileBypass.drop(event, modifiedFiles, target),
          onCancel: () => undefined
        });
      })
      .catch(() => FileBypass.drop(event, files, target));
  };
}
