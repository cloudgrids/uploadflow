import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import { FileBypass } from './FileBypass';
import type { OverlayManager } from './OverlayManager';

export class PasteInterceptor {
  private readonly overlayManager: OverlayManager;
  private readonly messageService: MessageService;

  constructor(overlayManager: OverlayManager, messageService: MessageService) {
    this.overlayManager = overlayManager;
    this.messageService = messageService;
  }

  register(): void {
    window.addEventListener('paste', this.handlePaste, true);
  }

  unregister(): void {
    window.removeEventListener('paste', this.handlePaste, true);
  }

  private readonly handlePaste = (event: ClipboardEvent): void => {
    if (FileBypass.isBypassPaste(event) || !event.clipboardData?.files?.length || !event.target) return;

    event.stopImmediatePropagation();
    event.preventDefault();

    const files = Array.from(event.clipboardData.files);
    const target = event.target;

    void this.messageService.send<ExtensionConfig>({ type: 'GET_CONFIG' }).then((config) => {
      if (!config?.settings?.generalSettings?.enableUploadFlow) {
        FileBypass.paste(event, files, target);
        return;
      }

      this.overlayManager.show({
        files,
        config: config.settings,
        onComplete: (modifiedFiles) => FileBypass.paste(event, modifiedFiles, target),
        onCancel: () => undefined
      });
    });
  };
}
