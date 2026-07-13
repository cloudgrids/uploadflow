import type { MessageService } from '../services/MessageService';
import type { OverlayManager } from './OverlayManager';
import { PageApiInterceptor } from './PageApiInterceptor';

export class XmlInterceptor extends PageApiInterceptor {
  constructor(overlayManager: OverlayManager, messageService: MessageService) {
    super('xhr-send', overlayManager, messageService);
  }
}
