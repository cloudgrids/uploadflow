import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import type { FilePickerMode } from '../settings/UploadFlowSettings';
import { PAGE_INTERCEPTOR_SOURCE, type PageInterceptorState } from '../types/PageInterceptor';

export class InterceptionState {
  private active = false;
  private pickerMode: FilePickerMode = 'url';
  private readonly messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  get enabled(): boolean {
    return this.active;
  }

  get filePickerMode(): FilePickerMode {
    return this.pickerMode;
  }

  register(): void {
    chrome.storage.onChanged.addListener(this.handleStorageChange);
    void this.refresh();
  }

  unregister(): void {
    this.update(false, 'url');
    chrome.storage?.onChanged?.removeListener(this.handleStorageChange);
  }

  private readonly handleStorageChange = (changes: Record<string, chrome.storage.StorageChange>, areaName: string): void => {
    if (areaName === 'local' && ('settings' in changes || 'isEnabled' in changes)) void this.refresh();
  };

  private async refresh(): Promise<void> {
    try {
      const config = await this.messageService.send<ExtensionConfig>({ type: 'GET_CONFIG' });
      this.update(
        (config.isEnabled ?? true) && Boolean(config.settings?.generalSettings?.enableUploadFlow),
        config.settings?.generalSettings?.filePickerMode ?? 'url'
      );
    } catch {
      this.update(false, 'url');
    }
  }

  private update(enabled: boolean, filePickerMode: FilePickerMode): void {
    this.active = enabled;
    this.pickerMode = filePickerMode;
    const state: PageInterceptorState = {
      source: PAGE_INTERCEPTOR_SOURCE,
      type: 'STATE',
      enabled,
      filePickerMode
    };
    window.postMessage(state, '*');
  }
}
