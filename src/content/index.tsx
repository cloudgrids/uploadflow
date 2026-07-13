import { MessageService } from '../services/MessageService';
import { ContentController } from './ContentController';
import { DragDropInterceptor } from './DragDropInterceptor';
import { FileInputInterceptor } from './FileInputInterceptor';
import { FilePickerInterceptor } from './FilePickerInterceptor';
import { OverlayManager } from './OverlayManager';
import { PasteInterceptor } from './PasteInterceptor';
import { ReadInterceptor } from './ReadInterceptor';
import { XmlInterceptor } from './XmlInterceptor';

const overlayManager = new OverlayManager();
const messageService = new MessageService();

new ContentController(
  new FileInputInterceptor(overlayManager, messageService),
  new DragDropInterceptor(overlayManager, messageService),
  new PasteInterceptor(overlayManager, messageService),
  new ReadInterceptor(overlayManager, messageService),
  new XmlInterceptor(overlayManager, messageService),
  new FilePickerInterceptor(overlayManager, messageService)
).initialize();
