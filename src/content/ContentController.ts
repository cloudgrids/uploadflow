import type { DragDropInterceptor } from './DragDropInterceptor';
import type { FileInputInterceptor } from './FileInputInterceptor';
import type { FilePickerInterceptor } from './FilePickerInterceptor';
import type { PasteInterceptor } from './PasteInterceptor';
import type { ReadInterceptor } from './ReadInterceptor';
import type { XmlInterceptor } from './XmlInterceptor';

export class ContentController {
  private readonly inputInterceptor: FileInputInterceptor;
  private readonly dropInterceptor: DragDropInterceptor;
  private readonly pasteInterceptor: PasteInterceptor;
  private readonly readInterceptor: ReadInterceptor;
  private readonly xmlInterceptor: XmlInterceptor;
  private readonly filePickerInterceptor: FilePickerInterceptor;

  constructor(
    inputInterceptor: FileInputInterceptor,
    dropInterceptor: DragDropInterceptor,
    pasteInterceptor: PasteInterceptor,
    readInterceptor: ReadInterceptor,
    xmlInterceptor: XmlInterceptor,
    filePickerInterceptor: FilePickerInterceptor
  ) {
    this.inputInterceptor = inputInterceptor;
    this.dropInterceptor = dropInterceptor;
    this.pasteInterceptor = pasteInterceptor;
    this.readInterceptor = readInterceptor;
    this.xmlInterceptor = xmlInterceptor;
    this.filePickerInterceptor = filePickerInterceptor;
  }

  initialize(): void {
    this.inputInterceptor.register();
    this.dropInterceptor.register();
    this.pasteInterceptor.register();
    this.readInterceptor.register();
    this.xmlInterceptor.register();
    this.filePickerInterceptor.register();
  }
}
