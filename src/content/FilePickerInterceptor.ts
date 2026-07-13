import type { MessageService } from '../services/MessageService';
import type { OverlayManager } from './OverlayManager';
import { PageApiInterceptor } from './PageApiInterceptor';

export class FilePickerInterceptor extends PageApiInterceptor {
  constructor(overlayManager: OverlayManager, messageService: MessageService) {
    super(['file-picker', 'file-handle-get-file'], overlayManager, messageService);
  }
}
