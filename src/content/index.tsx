import { MessageService } from '../services/MessageService';
import { ContentController } from './ContentController';
import { DragDropInterceptor } from './DragDropInterceptor';
import { FileInputInterceptor } from './FileInputInterceptor';
import { OverlayManager } from './OverlayManager';

const overlay = new OverlayManager();
const messages = new MessageService();

new ContentController(new FileInputInterceptor(overlay, messages), new DragDropInterceptor(overlay, messages)).initialize();
