import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import { FileBypass } from './FileBypass';
import type { OverlayManager } from './OverlayManager';

export class DragDropInterceptor {
  private readonly overlay: OverlayManager;
  private readonly messages: MessageService;

  constructor(overlay: OverlayManager, messages: MessageService) {
    this.overlay = overlay;
    this.messages = messages;
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

    void this.messages
      .send<ExtensionConfig>({ type: 'GET_CONFIG' })
      .then((config) => {
        if (!config?.settings?.generalSettings?.enableUploadFlow) {
          FileBypass.drop(event, files, target);
          return;
        }
        this.overlay.show({
          files,
          config: config.settings,
          onComplete: (modifiedFiles) => FileBypass.drop(event, modifiedFiles, target),
          onCancel: () => undefined
        });
      })
      .catch(() => FileBypass.drop(event, files, target));
  };
}
