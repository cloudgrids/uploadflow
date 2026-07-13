import type { MessageService } from '../services/MessageService';
import type { OverlayManager } from './OverlayManager';
import { PageApiInterceptor } from './PageApiInterceptor';

export class ReadInterceptor extends PageApiInterceptor {
  constructor(overlayManager: OverlayManager, messageService: MessageService) {
    super('clipboard-read', overlayManager, messageService);
  }
}
