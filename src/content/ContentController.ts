import type { DragDropInterceptor } from './DragDropInterceptor';
import type { FileInputInterceptor } from './FileInputInterceptor';

export class ContentController {
  private readonly inputInterceptor: FileInputInterceptor;
  private readonly dropInterceptor: DragDropInterceptor;

  constructor(inputInterceptor: FileInputInterceptor, dropInterceptor: DragDropInterceptor) {
    this.inputInterceptor = inputInterceptor;
    this.dropInterceptor = dropInterceptor;
  }

  initialize(): void {
    this.inputInterceptor.register();
    this.dropInterceptor.register();
  }
}
