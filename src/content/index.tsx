import { MessageService } from '../services/MessageService';
import { ContentController } from './ContentController';
import { DragDropInterceptor } from './DragDropInterceptor';
import { FileChangeInterceptor } from './FileChangeInterceptor';
import { FileInputInterceptor } from './FileInputInterceptor';
import { InterceptionState } from './InterceptionState';
import { InterceptionController } from './InterceptionController';
import { OverlayManager } from './OverlayManager';
import { PageApiInterceptor } from './PageApiInterceptor';
import { PasteInterceptor } from './PasteInterceptor';

const overlayManager = new OverlayManager();
const messageService = new MessageService();
const interceptionState = new InterceptionState(messageService);
const pageApiInterceptor = new PageApiInterceptor(
  ['file-input', 'clipboard-read', 'fetch-send', 'xhr-send', 'file-handle-get-file'],
  overlayManager,
  messageService,
  interceptionState
);

new ContentController(
  interceptionState,
  new FileInputInterceptor(overlayManager, messageService, interceptionState),
  new FileChangeInterceptor(),
  new DragDropInterceptor(overlayManager, messageService, interceptionState),
  new PasteInterceptor(overlayManager, messageService, interceptionState),
  pageApiInterceptor,
  new InterceptionController(messageService)
).initialize();
