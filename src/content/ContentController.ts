import type { DragDropInterceptor } from './DragDropInterceptor';
import type { FileChangeInterceptor } from './FileChangeInterceptor';
import type { FileInputInterceptor } from './FileInputInterceptor';
import type { InterceptionState } from './InterceptionState';
import type { InterceptionController } from './InterceptionController';
import type { PageApiInterceptor } from './PageApiInterceptor';
import type { PasteInterceptor } from './PasteInterceptor';

export class ContentController {
  private readonly interceptionState: InterceptionState;
  private readonly inputInterceptor: FileInputInterceptor;
  private readonly changeInterceptor: FileChangeInterceptor;
  private readonly dropInterceptor: DragDropInterceptor;
  private readonly pasteInterceptor: PasteInterceptor;
  private readonly pageApiInterceptor: PageApiInterceptor;
  private readonly interceptionController: InterceptionController;

  constructor(
    interceptionState: InterceptionState,
    inputInterceptor: FileInputInterceptor,
    changeInterceptor: FileChangeInterceptor,
    dropInterceptor: DragDropInterceptor,
    pasteInterceptor: PasteInterceptor,
    pageApiInterceptor: PageApiInterceptor,
    interceptionController: InterceptionController
  ) {
    this.interceptionState = interceptionState;
    this.inputInterceptor = inputInterceptor;
    this.changeInterceptor = changeInterceptor;
    this.dropInterceptor = dropInterceptor;
    this.pasteInterceptor = pasteInterceptor;
    this.pageApiInterceptor = pageApiInterceptor;
    this.interceptionController = interceptionController;
  }

  initialize(): void {
    this.interceptionState.register();
    this.pageApiInterceptor.register();
    this.inputInterceptor.register();
    this.changeInterceptor.register();
    this.dropInterceptor.register();
    this.pasteInterceptor.register();
    this.interceptionController.register();
  }
}
