import { MessageService } from '../services/MessageService';
import { ContentController } from './ContentController';
import { DragDropInterceptor } from './DragDropInterceptor';
import { FileChangeInterceptor } from './FileChangeInterceptor';
import { FileInputInterceptor } from './FileInputInterceptor';
import { OverlayManager } from './OverlayManager';
import { PageApiInterceptor } from './PageApiInterceptor';
import { PasteInterceptor } from './PasteInterceptor';

const overlayManager = new OverlayManager();
const messageService = new MessageService();
const pageApiInterceptor = new PageApiInterceptor(
  ['file-input', 'clipboard-read', 'fetch-send', 'xhr-send', 'file-handle-get-file'],
  overlayManager,
  messageService
);

new ContentController(
  new FileInputInterceptor(overlayManager, messageService),
  new FileChangeInterceptor(),
  new DragDropInterceptor(overlayManager, messageService),
  new PasteInterceptor(overlayManager, messageService),
  pageApiInterceptor
).initialize();
