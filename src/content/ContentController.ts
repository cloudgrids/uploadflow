import type { DragDropInterceptor } from './DragDropInterceptor';
import type { FileChangeInterceptor } from './FileChangeInterceptor';
import type { FileInputInterceptor } from './FileInputInterceptor';
import type { PageApiInterceptor } from './PageApiInterceptor';
import type { PasteInterceptor } from './PasteInterceptor';

export class ContentController {
  private readonly inputInterceptor: FileInputInterceptor;
  private readonly changeInterceptor: FileChangeInterceptor;
  private readonly dropInterceptor: DragDropInterceptor;
  private readonly pasteInterceptor: PasteInterceptor;
  private readonly pageApiInterceptor: PageApiInterceptor;

  constructor(
    inputInterceptor: FileInputInterceptor,
    changeInterceptor: FileChangeInterceptor,
    dropInterceptor: DragDropInterceptor,
    pasteInterceptor: PasteInterceptor,
    pageApiInterceptor: PageApiInterceptor
  ) {
    this.inputInterceptor = inputInterceptor;
    this.changeInterceptor = changeInterceptor;
    this.dropInterceptor = dropInterceptor;
    this.pasteInterceptor = pasteInterceptor;
    this.pageApiInterceptor = pageApiInterceptor;
  }

  initialize(): void {
    this.inputInterceptor.register();
    this.changeInterceptor.register();
    this.dropInterceptor.register();
    this.pasteInterceptor.register();
    this.pageApiInterceptor.register();
  }
}
